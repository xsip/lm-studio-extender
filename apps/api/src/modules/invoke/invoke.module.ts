import { DynamicModule, Module } from '@nestjs/common';
import { InvokeService } from './invoke.service';

@Module({})
export class InvokeModule {
  static forRoot(invokeBaseUrl: string): DynamicModule {
    return {
      module: InvokeModule,
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
