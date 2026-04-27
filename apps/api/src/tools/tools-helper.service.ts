import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { OpenAiResponseService } from '../modules/openai/open-ai-response.service';
import crypto from 'crypto';

export enum ApiEvent {
  MCP_PROGRESS = 'MCP_PROGRESS',
}

export interface McpProgressApiEvent {
  progress: string | number;
  total?: string;
  message?: string;
}

@Injectable()
export class ToolsHelperService {
  constructor(private readonly openAiResponseService: OpenAiResponseService) {}
  emitApiEvent(request: Request, type: ApiEvent, payload: McpProgressApiEvent) {
    const requestId = request.headers['requestid'] as string;
    if (!requestId) return;
    const res = this.openAiResponseService.get(requestId);

    if (type === ApiEvent.MCP_PROGRESS) {
      res.write(
        `event: api_report_mcp_progress\ndata: ${JSON.stringify({
          type: 'api_report_mcp_progress',
          progressToken: requestId,
          progress: payload.progress + '',
          total: payload.total ?? '100',
          message: payload.message,
        })}\n\n`,
      );
    }
  }
}
