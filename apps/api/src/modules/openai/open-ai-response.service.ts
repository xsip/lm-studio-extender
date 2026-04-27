import { Injectable } from '@nestjs/common';
import {Response} from 'express';
@Injectable()
export class OpenAiResponseService {
  private map: Map<string, Response> = new Map<string, Response>();
  create(key: string, value: Response) {
    this.map.set(key, value);
  }

  get(key: string): Response {
    return this.map.get(key)!;
  }

  destroy(key: string) {
    this.map.delete(key);
  }
}
