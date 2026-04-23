import { DynamicModule, Module } from '@nestjs/common';
import { InvokeService } from './invoke.service';
import { InvokeController } from './invoke.controller';
import { HttpModule } from '@nestjs/axios';

@Module({})
export class InvokeModule {
  static forRoot(invokeBaseUrl: string): DynamicModule {
    return {
      module: InvokeModule,
      imports: [HttpModule],
      controllers: [InvokeController],
      providers: [
        {
          provide: 'INVOKE_BASE_URL',
          useValue: invokeBaseUrl,
        },
        InvokeService,
      ],
      exports: ['INVOKE_BASE_URL', InvokeService],
    };
  }
}
