import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ModelsList } from './model/modelsList';
import { lastValueFrom } from 'rxjs';
import { BodyEnqueueBatch } from './model/bodyEnqueueBatch';
import { EnqueueBatchResult } from './model/enqueueBatchResult';

import { io, Socket } from 'socket.io-client';

@Injectable()
export class InvokeService {
  constructor(
    private readonly httpService: HttpService,
    @Inject('INVOKE_BASE_URL') private readonly invokeBaseUrl: string,
  ) {}

  async getModels(): Promise<ModelsList> {
    return (
      await lastValueFrom(
        this.httpService.get<ModelsList>(
          `${this.invokeBaseUrl}/api/v2/models/`,
        ),
      )
    ).data;
  }

  async generateImage(
    prompt: string,
    modelName: string = 'Dreamshaper 8',
  ): Promise<string> {
    const models = await this.getModels();

    const model = models.models.find((m) =>
      m.name.toLowerCase().includes(modelName.toLowerCase()),
    );

    if (!model) {
      throw new Error(
        `Model ${modelName} not found! Available models: "${models.models.map((m) => m.name).join(', ')}."`,
      );
    }

    // Connect socket and wait for invocation_complete before returning
    const imageUrl = await new Promise<string>((resolve, reject) => {
      const socket: Socket = io(this.invokeBaseUrl, {
        path: '/ws/socket.io/',
        transports: ['polling'],
      });

      socket.on('connect', () => {
        socket.emit('subscribe_queue', { queue_id: 'default' });
      });

      socket.on('invocation_complete', (data) => {
        const imageName = data?.result?.image?.image_name;
        if (!imageName) return;

        socket.disconnect();
        resolve(`${this.invokeBaseUrl}/api/v1/images/i/${imageName}/full`);
      });

      socket.on('connect_error', (err) => {
        socket.disconnect();
        reject(new Error(`Socket connection failed: ${err.message}`));
      });

      // Enqueue the batch after socket is ready
      socket.on('connect', async () => {
        try {
          await lastValueFrom(
            this.httpService.post<EnqueueBatchResult, BodyEnqueueBatch>(
              `${this.invokeBaseUrl}/api/v1/queue/default/enqueue_batch`,
              {
                prepend: false,
                batch: {
                  graph: {
                    id: 'sd1_graph',
                    nodes: {
                      seed: {
                        id: 'seed',
                        type: 'integer',
                        is_intermediate: true,
                        use_cache: true,
                      },
                      positive_prompt: {
                        id: 'positive_prompt',
                        type: 'string',
                        is_intermediate: true,
                        use_cache: true,
                      },
                      sd1_model_loader: {
                        type: 'main_model_loader',
                        id: 'sd1_model_loader',
                        model: model,
                        is_intermediate: true,
                        use_cache: true,
                      },
                      clip_skip: {
                        type: 'clip_skip',
                        id: 'clip_skip',
                        skipped_layers: 0,
                        is_intermediate: true,
                        use_cache: true,
                      },
                      pos_cond: {
                        type: 'compel',
                        id: 'pos_cond',
                        is_intermediate: true,
                        use_cache: true,
                      },
                      pos_cond_collect: {
                        type: 'collect',
                        id: 'pos_cond_collect',
                        is_intermediate: true,
                        use_cache: true,
                      },
                      neg_cond: {
                        type: 'compel',
                        id: 'neg_cond',
                        prompt: '',
                        is_intermediate: true,
                        use_cache: true,
                      },
                      neg_cond_collect: {
                        type: 'collect',
                        id: 'neg_cond_collect',
                        is_intermediate: true,
                        use_cache: true,
                      },
                      noise: {
                        type: 'noise',
                        id: 'noise',
                        use_cpu: true,
                        is_intermediate: true,
                        use_cache: true,
                        width: 512,
                        height: 512,
                      },
                      denoise_latents: {
                        type: 'denoise_latents',
                        id: 'denoise_latents',
                        cfg_scale: 7.5,
                        cfg_rescale_multiplier: 0,
                        scheduler: 'dpmpp_3m_k',
                        steps: 30,
                        denoising_start: 0,
                        denoising_end: 1,
                        is_intermediate: true,
                        use_cache: true,
                      },
                      core_metadata: {
                        id: 'core_metadata',
                        type: 'core_metadata',
                        is_intermediate: true,
                        use_cache: true,
                        cfg_scale: 7.5,
                        cfg_rescale_multiplier: 0,
                        negative_prompt: '',
                        model: {
                          key: model.key,
                          hash: model.hash,
                          name: model.name,
                          base: model.base,
                          type: model.type,
                        },
                        steps: 30,
                        rand_device: 'cpu',
                        scheduler: 'dpmpp_3m_k',
                        clip_skip: 0,
                        seamless_x: false,
                        seamless_y: false,
                        width: 512,
                        height: 512,
                        generation_mode: 'txt2img',
                        ref_images: [],
                      },
                      canvas_output: {
                        type: 'l2i',
                        id: 'canvas_output',
                        fp32: true,
                        is_intermediate: false,
                        use_cache: false,
                      },
                    },
                    edges: [
                      {
                        source: {
                          node_id: 'sd1_model_loader',
                          field: 'unet',
                        },
                        destination: {
                          node_id: 'denoise_latents',
                          field: 'unet',
                        },
                      },
                      {
                        source: {
                          node_id: 'sd1_model_loader',
                          field: 'clip',
                        },
                        destination: { node_id: 'clip_skip', field: 'clip' },
                      },
                      {
                        source: { node_id: 'clip_skip', field: 'clip' },
                        destination: { node_id: 'pos_cond', field: 'clip' },
                      },
                      {
                        source: { node_id: 'clip_skip', field: 'clip' },
                        destination: { node_id: 'neg_cond', field: 'clip' },
                      },
                      {
                        source: {
                          node_id: 'positive_prompt',
                          field: 'value',
                        },
                        destination: { node_id: 'pos_cond', field: 'prompt' },
                      },
                      {
                        source: {
                          node_id: 'pos_cond',
                          field: 'conditioning',
                        },
                        destination: {
                          node_id: 'pos_cond_collect',
                          field: 'item',
                        },
                      },
                      {
                        source: {
                          node_id: 'pos_cond_collect',
                          field: 'collection',
                        },
                        destination: {
                          node_id: 'denoise_latents',
                          field: 'positive_conditioning',
                        },
                      },
                      {
                        source: {
                          node_id: 'neg_cond',
                          field: 'conditioning',
                        },
                        destination: {
                          node_id: 'neg_cond_collect',
                          field: 'item',
                        },
                      },
                      {
                        source: {
                          node_id: 'neg_cond_collect',
                          field: 'collection',
                        },
                        destination: {
                          node_id: 'denoise_latents',
                          field: 'negative_conditioning',
                        },
                      },
                      {
                        source: { node_id: 'seed', field: 'value' },
                        destination: { node_id: 'noise', field: 'seed' },
                      },
                      {
                        source: { node_id: 'noise', field: 'noise' },
                        destination: {
                          node_id: 'denoise_latents',
                          field: 'noise',
                        },
                      },
                      {
                        source: {
                          node_id: 'denoise_latents',
                          field: 'latents',
                        },
                        destination: {
                          node_id: 'canvas_output',
                          field: 'latents',
                        },
                      },
                      {
                        source: { node_id: 'seed', field: 'value' },
                        destination: {
                          node_id: 'core_metadata',
                          field: 'seed',
                        },
                      },
                      {
                        source: {
                          node_id: 'positive_prompt',
                          field: 'value',
                        },
                        destination: {
                          node_id: 'core_metadata',
                          field: 'positive_prompt',
                        },
                      },
                      {
                        source: { node_id: 'sd1_model_loader', field: 'vae' },
                        destination: {
                          node_id: 'canvas_output',
                          field: 'vae',
                        },
                      },
                      {
                        source: {
                          node_id: 'core_metadata',
                          field: 'metadata',
                        },
                        destination: {
                          node_id: 'canvas_output',
                          field: 'metadata',
                        },
                      },
                    ],
                  },
                  runs: 1,
                  data: [
                    [
                      {
                        node_path: 'seed',
                        field_name: 'value',
                        items: [3375714790 as any],
                      },
                    ],
                    [
                      {
                        node_path: 'positive_prompt',
                        field_name: 'value',
                        items: [prompt],
                      },
                    ],
                  ],
                  origin: 'generate',
                  destination: 'generate',
                },
              },
            ),
          );
        } catch (err) {
          console.log(err);
          socket.disconnect();
          reject(err);
        }
      });
    });

    return imageUrl;
  }
}
