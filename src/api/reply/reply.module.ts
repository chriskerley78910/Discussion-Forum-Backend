import { Module } from '@nestjs/common';
import { ReplyController } from './reply.controller'
import { ReplyEntity } from './reply.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReplyService } from './reply.service';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { QuestionEntity } from '../question/question.entity';
import { QuestionService } from '../question/question.service';

@Module({
  imports:[TypeOrmModule.forFeature([ReplyEntity, UserEntity, QuestionEntity])],
  controllers: [ReplyController],
  providers: [ReplyService, UserService, QuestionService],
})
export class ReplyModule {}
