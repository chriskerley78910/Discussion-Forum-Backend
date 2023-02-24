import { Module } from '@nestjs/common';
import { QuestionController } from './question.controller'
import { QuestionEntity } from './question.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionService } from './question.service';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/user.entity';
import { Repository } from 'typeorm';

@Module({
  imports:[TypeOrmModule.forFeature([QuestionEntity,UserEntity])],
  controllers: [QuestionController],
  providers: [QuestionService, UserService, QuestionEntity],
  exports:[QuestionService, QuestionEntity]
})
export class QuestionModule {}
