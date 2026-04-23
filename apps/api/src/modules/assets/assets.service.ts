import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ImageBlob, ImageBlobDocument } from './image-blob.schema';
import { Model } from 'mongoose';

@Injectable()
export class AssetsService {
  constructor(
    @InjectModel(ImageBlob.name)
    private readonly imageBlobModel: Model<ImageBlobDocument>,
  ) {}

  async getAsset(
    userId: string,
    chatId: string,
    filename: string,
  ): Promise<ImageBlobDocument> {
    // Prevent path traversal
    if (filename.includes('..')) {
      throw new NotFoundException();
    }

    const blob = await this.imageBlobModel
      .findOne({
        userId,
        chatId,
        filename,
      })
      .exec();

    if (!blob) {
      throw new NotFoundException('Image not found');
    }
    return blob;
  }

  async uploadFile(
    userId: string,
    chatId: string,
    originalFilename: string,
    data: Buffer,
    mimeType: string,
  ) {
    const ext = originalFilename.split('.').pop()?.toLowerCase() ?? 'bin';
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    await this.imageBlobModel.create({
      userId,
      chatId,
      filename,
      mimeType,
      data,
    });

    return { url: `assets/${chatId}/${filename}`, filename };
  }
}
