import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { ReplyService} from './reply.service'
import { QuestionReplyDto } from './dtos/question-reply.dto';
import { ReplyReplyDto } from './dtos/reply-reply.dto';
import { ReplyEntity } from './reply.entity';

@Controller('replies')
export class ReplyController {

  constructor(private readonly replyService: ReplyService) {}

/**
 * @param reply - The reply to a discussion question.
 * @returns - The created reply.
 */
  @Post('create')
  createQuestionReply(@Body() reply: QuestionReplyDto): Promise<ReplyEntity> {
    return this.replyService.createQuestionReply(reply.userId, reply.questionId, reply.text)
  }

/**
 * @param reply - The reply to an existing reply.
 * @returns - The reply created
 */
  @Post('reply')
  createReplyReply(@Body() reply: ReplyReplyDto): Promise<ReplyEntity>{
    return this.replyService.createReplyReply(reply.userId, reply.parentId, reply.text)
  }

  /**
   * @param id - The unique identifier of the reply to get.
   * @returns - The reply corresponding to the given id.
   */
  @Get()
  getReply(@Query('id') id: number): Promise<ReplyEntity>{
    return this.replyService.getReplyTree(id)
  }



}
