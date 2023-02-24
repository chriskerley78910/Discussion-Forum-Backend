import { Test, TestingModule } from '@nestjs/testing';
import { ReplyController } from './reply.controller';
import { ReplyService } from './reply.service';
import { QuestionReplyDto } from './dtos/question-reply.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ReplyEntity } from './reply.entity';
import { EntityManager } from 'typeorm';
import { createMock } from '@golevelup/ts-jest';
import { UserService } from '../user/user.service';
import { QuestionService } from '../question/question.service';
import { ReplyReplyDto } from './dtos/reply-reply.dto';

describe('ReplyController', () => {

  let replyService: ReplyService;
  let replyController: ReplyController;
  let mockRepository = {
    
  }

  beforeEach(async () => {
    const reply: TestingModule = await Test.createTestingModule({
      controllers: [ReplyController],
      providers: [ReplyService,
        {
          provide:getRepositoryToken(ReplyEntity),
          useValue: mockRepository
        },
        { 
          provide: EntityManager, 
          useValue: createMock<EntityManager>() 
        },
        {
          provide: UserService,
          useValue: createMock<UserService>()
        },
        {
          provide: QuestionService,
          useValue: createMock<QuestionService>()
        }
      ],
    }).compile();
    replyService = reply.get<ReplyService>(ReplyService);
    replyController = reply.get<ReplyController>(ReplyController);
  });

  describe('reply.controller', () => {

    it('uses the createQuestionReply() on the service to store the reply.', async () => {
        jest.spyOn(replyService,'createQuestionReply').mockImplementation(()=> Promise.resolve(new ReplyEntity()))
        await replyController.createQuestionReply(new QuestionReplyDto())
        expect(replyService.createQuestionReply).toBeCalledTimes(1) 
    });

    it('uses createReplyReply() on the service to reply to an existing reply.', async ()=>{
      jest.spyOn(replyService,'createReplyReply').mockImplementation(()=> Promise.resolve(new ReplyEntity()))
      await replyController.createReplyReply(new ReplyReplyDto())
      expect(replyService.createReplyReply).toBeCalledTimes(1) 
    })

    it('uses getReplyTree() on the service to get a reply and all its sub-replies.', async ()=>{
      jest.spyOn(replyService,'getReplyTree').mockImplementation(()=> Promise.resolve(new ReplyEntity()))
      const fakeReplyId = 1
      await replyController.getReply(fakeReplyId)
      expect(replyService.getReplyTree).toBeCalledTimes(1) 
    })

  });
});
