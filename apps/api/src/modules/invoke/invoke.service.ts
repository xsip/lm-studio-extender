import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ModelsList } from './model/modelsList';
import { lastValueFrom } from 'rxjs';
import { BodyEnqueueBatch } from './model/bodyEnqueueBatch';
import { EnqueueBatchResult } from './model/enqueueBatchResult';

import { io, Socket } from 'socket.io-client';
import { NodesValue } from './model/nodesValue';

export enum InvokeAiModel {
  DREAMSHAPER_8 = 'Dreamshaper 8',
  JUGGERNAUT_XL_V9 = 'Juggernaut XL v9',
}

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
    modelName: InvokeAiModel = InvokeAiModel.DREAMSHAPER_8,
  ): Promise<{
    fullPath: string;
    thumbPath: string;
  }> {
    const models = await this.getModels();

    const model = models.models.find((m) =>
      m.name.toLowerCase().includes(modelName.toLowerCase()),
    );

    if (!model) {
      throw new Error(
        `Model ${modelName} not found! Available models: "${models.models.map((m) => m.name).join(', ')}."`,
      );
    }

    const randomId = () =>
      Math.random().toString(36).slice(2, 7) +
      Math.random().toString(36).slice(2, 7);

    const isSDXL = model.base === 'sdxl';

    const modelLoaderType = isSDXL ? 'sdxl_model_loader' : 'main_model_loader';

    const ids = {
      graph: `${model.base}_graph:${randomId()}`,
      seed: `seed:${randomId()}`,
      positivePrompt: `positive_prompt:${randomId()}`,
      modelLoader: `model_loader:${randomId()}`,
      clipSkip: `clip_skip:${randomId()}`,
      posCond: `pos_cond:${randomId()}`,
      posCondCollect: `pos_cond_collect:${randomId()}`,
      negCond: `neg_cond:${randomId()}`,
      negCondCollect: `neg_cond_collect:${randomId()}`,
      noise: `noise:${randomId()}`,
      denoiseLatents: `denoise_latents:${randomId()}`,
      coreMetadata: `core_metadata:${randomId()}`,
      canvasOutput: `canvas_output:${randomId()}`,
    };

    const imageUrl = await new Promise<{ fullPath: string; thumbPath: string }>(
      (resolve, reject) => {
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
          resolve({
            fullPath: `${this.invokeBaseUrl}/api/v1/images/i/${imageName}/full`,
            thumbPath: `${this.invokeBaseUrl}/api/v1/images/i/${imageName}/thumbnail`,
          });
        });

        socket.on('connect_error', (err) => {
          socket.disconnect();
          reject(new Error(`Socket connection failed: ${err.message}`));
        });

        // --- Nodes ---
        const condNodes = isSDXL
          ? {
              [ids.posCond]: {
                type: 'sdxl_compel_prompt',
                id: ids.posCond,
                is_intermediate: true,
                use_cache: true,
              },
              [ids.negCond]: {
                type: 'sdxl_compel_prompt',
                id: ids.negCond,
                prompt: '',
                style: '',
                is_intermediate: true,
                use_cache: true,
              },
            }
          : {
              [ids.clipSkip]: {
                type: 'clip_skip',
                id: ids.clipSkip,
                skipped_layers: 0,
                is_intermediate: true,
                use_cache: true,
              },
              [ids.posCond]: {
                type: 'compel',
                id: ids.posCond,
                is_intermediate: true,
                use_cache: true,
              },
              [ids.negCond]: {
                type: 'compel',
                id: ids.negCond,
                prompt: '',
                is_intermediate: true,
                use_cache: true,
              },
            };

        // --- Edges ---
        const condEdges = isSDXL
          ? [
              {
                source: { node_id: ids.modelLoader, field: 'clip' },
                destination: { node_id: ids.posCond, field: 'clip' },
              },
              {
                source: { node_id: ids.modelLoader, field: 'clip' },
                destination: { node_id: ids.negCond, field: 'clip' },
              },
              {
                source: { node_id: ids.modelLoader, field: 'clip2' },
                destination: { node_id: ids.posCond, field: 'clip2' },
              },
              {
                source: { node_id: ids.modelLoader, field: 'clip2' },
                destination: { node_id: ids.negCond, field: 'clip2' },
              },
              {
                source: { node_id: ids.positivePrompt, field: 'value' },
                destination: { node_id: ids.posCond, field: 'prompt' },
              },
              {
                source: { node_id: ids.positivePrompt, field: 'value' },
                destination: { node_id: ids.posCond, field: 'style' },
              },
            ]
          : [
              {
                source: { node_id: ids.modelLoader, field: 'clip' },
                destination: { node_id: ids.clipSkip, field: 'clip' },
              },
              {
                source: { node_id: ids.clipSkip, field: 'clip' },
                destination: { node_id: ids.posCond, field: 'clip' },
              },
              {
                source: { node_id: ids.clipSkip, field: 'clip' },
                destination: { node_id: ids.negCond, field: 'clip' },
              },
              {
                source: { node_id: ids.positivePrompt, field: 'value' },
                destination: { node_id: ids.posCond, field: 'prompt' },
              },
            ];

        const req: BodyEnqueueBatch = {
          prepend: false,
          batch: {
            graph: {
              id: ids.graph,
              nodes: {
                [ids.seed]: {
                  id: ids.seed,
                  type: 'integer',
                  is_intermediate: true,
                  use_cache: true,
                },
                [ids.positivePrompt]: {
                  id: ids.positivePrompt,
                  type: 'string',
                  is_intermediate: true,
                  use_cache: true,
                },
                [ids.modelLoader]: {
                  type: modelLoaderType as any,
                  id: ids.modelLoader,
                  model: model,
                  is_intermediate: true,
                  use_cache: true,
                },
                ...condNodes,
                [ids.posCondCollect]: {
                  type: 'collect',
                  id: ids.posCondCollect,
                  is_intermediate: true,
                  use_cache: true,
                },
                [ids.negCondCollect]: {
                  type: 'collect',
                  id: ids.negCondCollect,
                  is_intermediate: true,
                  use_cache: true,
                },
                [ids.noise]: {
                  type: 'noise',
                  id: ids.noise,
                  use_cpu: true,
                  is_intermediate: true,
                  use_cache: true,
                  width: isSDXL ? 512 : 512,
                  height: isSDXL ? 512 : 512,
                },
                [ids.denoiseLatents]: {
                  type: 'denoise_latents',
                  id: ids.denoiseLatents,
                  cfg_scale: 7.5,
                  cfg_rescale_multiplier: 0,
                  scheduler: 'dpmpp_3m_k',
                  steps: 30,
                  denoising_start: 0,
                  denoising_end: 1,
                  is_intermediate: true,
                  use_cache: true,
                },
                [ids.coreMetadata]: {
                  id: ids.coreMetadata,
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
                  width: isSDXL ? 1024 : 512,
                  height: isSDXL ? 1024 : 512,
                  generation_mode: isSDXL ? 'sdxl_txt2img' : 'txt2img',
                  ref_images: [],
                },
                [ids.canvasOutput]: {
                  type: 'l2i',
                  id: ids.canvasOutput,
                  fp32: true,
                  is_intermediate: false,
                  use_cache: false,
                },
              } as unknown as Record<string, NodesValue>,
              edges: [
                {
                  source: { node_id: ids.modelLoader, field: 'unet' },
                  destination: { node_id: ids.denoiseLatents, field: 'unet' },
                },
                ...condEdges,
                {
                  source: { node_id: ids.posCond, field: 'conditioning' },
                  destination: { node_id: ids.posCondCollect, field: 'item' },
                },
                {
                  source: { node_id: ids.posCondCollect, field: 'collection' },
                  destination: {
                    node_id: ids.denoiseLatents,
                    field: 'positive_conditioning',
                  },
                },
                {
                  source: { node_id: ids.negCond, field: 'conditioning' },
                  destination: { node_id: ids.negCondCollect, field: 'item' },
                },
                {
                  source: { node_id: ids.negCondCollect, field: 'collection' },
                  destination: {
                    node_id: ids.denoiseLatents,
                    field: 'negative_conditioning',
                  },
                },
                {
                  source: { node_id: ids.seed, field: 'value' },
                  destination: { node_id: ids.noise, field: 'seed' },
                },
                {
                  source: { node_id: ids.noise, field: 'noise' },
                  destination: { node_id: ids.denoiseLatents, field: 'noise' },
                },
                {
                  source: { node_id: ids.denoiseLatents, field: 'latents' },
                  destination: { node_id: ids.canvasOutput, field: 'latents' },
                },
                {
                  source: { node_id: ids.seed, field: 'value' },
                  destination: { node_id: ids.coreMetadata, field: 'seed' },
                },
                {
                  source: { node_id: ids.positivePrompt, field: 'value' },
                  destination: {
                    node_id: ids.coreMetadata,
                    field: 'positive_prompt',
                  },
                },
                {
                  source: { node_id: ids.modelLoader, field: 'vae' },
                  destination: { node_id: ids.canvasOutput, field: 'vae' },
                },
                {
                  source: { node_id: ids.coreMetadata, field: 'metadata' },
                  destination: { node_id: ids.canvasOutput, field: 'metadata' },
                },
              ],
            },
            runs: 1,
            data: [
              [
                {
                  node_path: ids.seed,
                  field_name: 'value',
                  items: [Math.floor(Math.random() * 2 ** 32) as any],
                },
              ],
              [
                {
                  node_path: ids.positivePrompt,
                  field_name: 'value',
                  items: [prompt],
                },
              ],
            ],
            origin: 'generate',
            destination: 'generate',
          },
        };

        socket.on('connect', async () => {
          try {
            await lastValueFrom(
              this.httpService.post<EnqueueBatchResult, BodyEnqueueBatch>(
                `${this.invokeBaseUrl}/api/v1/queue/default/enqueue_batch`,
                req,
              ),
            );
          } catch (err) {
            console.log(err);
            socket.disconnect();
            reject(JSON.stringify(err));
          }
        });
      },
    );

    return imageUrl;
  }
}
