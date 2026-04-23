import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AssetsController } from './assets.controller';
import { ImageBlob, ImageBlobSchema } from './image-blob.schema';
import { AssetsService } from './assets.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ImageBlob.name, schema: ImageBlobSchema },
    ]),
  ],
  providers: [AssetsService],
  controllers: [AssetsController],
  exports: [AssetsService],
})
export class AssetsModule {}
