import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Types } from 'mongoose';
import { ChatMetadataService } from './chat-metadata.service';
import { ChatMetadataDto } from './chat-metadata.schema';
import { CreateChatMetadataDto } from './dto/create-chat-metadata.dto';
import { UpdateChatMetadataDto } from './dto/update-chat-metadata.dto';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../auth/user.schema';

@ApiTags('Chat Metadata')
@ApiBearerAuth()
@Controller('chats-metadata')
export class ChatMetadataController {
  constructor(private readonly chatMetadataService: ChatMetadataService) {}

  // ── POST /chats/metadata ─────────────────────────────────────────────────

  @Post()
  @ApiOperation({
    summary: 'Create a new chat metadata entry',
    operationId: 'createChatMetadata',
  })
  @ApiCreatedResponse({ type: ChatMetadataDto })
  create(@CurrentUser() user: User, @Body() dto: CreateChatMetadataDto) {
    const userId = (user as any)._id as Types.ObjectId;
    return this.chatMetadataService.create(userId, dto);
  }

  // ── GET /chats/metadata ──────────────────────────────────────────────────

  @Get('')
  @ApiOperation({
    summary:
      'List all chat metadata entries belonging to the authenticated user',
    operationId: 'listChatMetadata',
  })
  @ApiOkResponse({ type: [ChatMetadataDto] })
  async findAll(@CurrentUser() user: User) {
    try {
      const userId = (user as any)._id as Types.ObjectId;
      const res = await this.chatMetadataService.findAll(userId);
      return res;
    } catch (error) {
      console.log(error);
    }
    return [];
  }

  // ── GET /chats/metadata/:id ──────────────────────────────────────────────

  @Get(':id')
  @ApiOperation({
    summary:
      'Get a single chat metadata entry (must belong to the authenticated user)',
    operationId: 'getChatMetadata',
  })
  @ApiParam({ name: 'id', description: 'ChatMetadata ObjectId' })
  @ApiOkResponse({ type: ChatMetadataDto })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiForbiddenResponse({ description: 'Belongs to a different user' })
  findOne(@CurrentUser() user: User, @Param('id') id: string) {
    const userId = (user as any)._id as Types.ObjectId;
    return this.chatMetadataService.findOne(userId, id);
  }

  // ── PATCH /chats/metadata/:id ────────────────────────────────────────────

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a chat metadata entry',
    operationId: 'updateChatMetadata',
  })
  @ApiParam({ name: 'id', description: 'ChatMetadata ObjectId' })
  @ApiOkResponse({ type: ChatMetadataDto })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiForbiddenResponse({ description: 'Belongs to a different user' })
  update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() dto: UpdateChatMetadataDto,
  ) {
    const userId = (user as any)._id as Types.ObjectId;
    return this.chatMetadataService.update(userId, id, dto);
  }

  // ── DELETE /chats/metadata/:id ───────────────────────────────────────────

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary:
      'Delete a chat metadata entry and all associated messages in the chats collection',
    operationId: 'deleteChatMetadata',
  })
  @ApiParam({ name: 'id', description: 'ChatMetadata ObjectId' })
  @ApiNoContentResponse({
    description: 'Deleted (cascade includes chat messages)',
  })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiForbiddenResponse({ description: 'Belongs to a different user' })
  remove(@CurrentUser() user: User, @Param('id') id: string) {
    const userId = (user as any)._id as Types.ObjectId;
    return this.chatMetadataService.remove(userId, id);
  }
}
