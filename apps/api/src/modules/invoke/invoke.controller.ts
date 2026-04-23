import { Controller, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '../auth/public.decorator';
import { InvokeService } from './invoke.service';

@ApiTags('Invoke')
@ApiBearerAuth()
@Controller('invoke')
export class InvokeController {
  constructor(private readonly invokeService: InvokeService) {}

  @Public()
  @Get('test')
  @ApiOperation({
    summary: 'Test of generating an image',
    operationId: 'testGenerateImage',
  })
  @ApiOkResponse({ type: String })
  testGenerateImage(): Promise<string> {
    return this.invokeService.generateImage('Image of a cat photorealistic');
  }
}
