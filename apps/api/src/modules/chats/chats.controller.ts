import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiParam,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { Types } from 'mongoose';
import { ChatsService } from './chats.service';
import { ChatEntryDto } from './chat.schema';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../auth/user.schema';

@ApiTags('Chats')
@ApiBearerAuth()
@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Get()
  @ApiOperation({
    summary: 'List all chat sessions belonging to the authenticated user',
    operationId: 'listChats',
  })
  @ApiOkResponse({
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          internalChatId: { type: 'string' },
          name: { type: 'string', nullable: true },
          lastActivity: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  listChats(@CurrentUser() user: User) {
    const userId = (user as any)._id as Types.ObjectId;
    return this.chatsService.listChats(userId);
  }

  @Get(':internalChatId')
  @ApiOperation({
    summary: 'Get all entries for a chat session (must belong to the authenticated user)',
    operationId: 'getChatEntries',
  })
  @ApiParam({ name: 'internalChatId', description: 'MD5 chat session hash' })
  @ApiOkResponse({ type: [ChatEntryDto] })
  @ApiForbiddenResponse({ description: 'Session belongs to a different user' })
  getChatEntries(
    @CurrentUser() user: User,
    @Param('internalChatId') internalChatId: string,
  ): Promise<ChatEntryDto[]> {
    const userId = (user as any)._id as Types.ObjectId;
    return this.chatsService.findByInternalChatId(userId, internalChatId);
  }
}
