import { Body, CacheInterceptor, CacheTTL, Controller, Get, HttpException, HttpStatus, Inject, Post, Query, Req, UseInterceptors } from '@nestjs/common';
import { CreateQuestionDto} from './question.dto';
import { QuestionEntity } from './question.entity';
import { QuestionService } from './question.service';


@Controller('questions')
export class QuestionController {

  constructor(private readonly questionService: QuestionService) {}

  @Get('all')
  async findAll(): Promise<QuestionEntity[]>{ 
    const questions = await this.questionService.findAll()
    const allFullQuestionTrees = await this.questionService.attachReplyTrees(questions)
    return allFullQuestionTrees
  }

  @Get()
  async findOne(@Query('id') questionId: number): Promise<QuestionEntity>{
    const result = await this.questionService.getById(questionId)
    if(!result) throw new HttpException(`Question with id "${questionId}" does not exist`,HttpStatus.NOT_FOUND)
    return result
  }

  @Post('create')
  createQuestion(@Body() question: CreateQuestionDto): Promise<QuestionEntity> {
    return this.questionService.createQuestion(question.userId, question.text)
  }
}
