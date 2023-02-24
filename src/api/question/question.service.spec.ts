import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { createMock } from '@golevelup/ts-jest';
import { QuestionController } from './question.controller';
import { QuestionEntity } from './question.entity';
import { QuestionService } from './question.service';
import { UserService } from '../user/user.service';
import { ReplyEntity } from '../reply/reply.entity';
import { CACHE_MANAGER } from '@nestjs/common';

describe('QuestionController', () => {

  let questionService: QuestionService;
  let questionController: QuestionController;
  const fakeQuestionId = 1
  const fakeQuestion = new QuestionEntity()
  const fakeReplyTrees = [new ReplyEntity()]


  let stubQuestionRepo = {
    find:() => [fakeQuestion],
    create:jest.fn(() => fakeQuestion),
    save:jest.fn(() => {})
  }

  let entityManager: EntityManager;
  let stubEntityManager = createMock<EntityManager>()
  let stubUserService = createMock<UserService>()
 

  beforeEach(async () => {
  
    const question: TestingModule = await Test.createTestingModule({
      controllers: [QuestionController],
      providers: [QuestionService,
        {
          provide: CACHE_MANAGER,
          useValue:{}
        },
      {
        provide:getRepositoryToken(QuestionEntity),
        useValue: stubQuestionRepo
      },
      { 
        provide: EntityManager, 
        useValue: stubEntityManager 
      },
      {
        provide: UserService,
        useValue: stubUserService
      }
    ],
    }).compile();
    questionService = question.get<QuestionService>(QuestionService);
    questionController = question.get<QuestionController>(QuestionController);
    entityManager = question.get(EntityManager);
   
  });

  describe('question.service', () => {

  

    it('returns all the questions in the repo on findAll()', async () => {
        const result = await questionService.findAll()
        expect(result.length).toBe(1)
        expect(result[0]).toBe(fakeQuestion)
    });

    it('throws on getById() when the question with that id does not exist.', async ()=>{
      const fakeQuestionId = 1
      jest.spyOn(questionService,'getQuestionWithTopLevelReplys').mockImplementationOnce(() => Promise.resolve(null))
      await expect(questionService.getById(fakeQuestionId)).rejects.toThrow('No question exists with')
    })

    it('attaches the reply trees and returns the question on getById() when the question exists.', async ()=>{
      jest.spyOn(questionService,'getQuestionWithTopLevelReplys').mockImplementationOnce(() => Promise.resolve(fakeQuestion))
      jest.spyOn(questionService,'getReplyTrees').mockImplementationOnce(() => Promise.resolve(fakeReplyTrees))
      const result = await questionService.getById(fakeQuestionId)
      expect(result.replies).toBe(fakeReplyTrees)
    })

    it('attaches the reply trees for every question on attachReplyTrees()', async ()=>{
      const fakeQuestions = [fakeQuestion, fakeQuestion]
      jest.spyOn(questionService,'getReplyTrees').mockImplementation(() => Promise.resolve([new ReplyEntity()]))
      const result = await questionService.attachReplyTrees(fakeQuestions)
      expect(questionService.getReplyTrees).toHaveBeenCalledTimes(2)
      expect(result.length).toBe(2)
      expect(result[0].replies.length).toBe(1)
    })

    it('replaces 1 level replies with their full level reply trees on getReplyTrees()', async ()=>{
      const stubReples = [new ReplyEntity(), new ReplyEntity()]
      const result = await questionService.getReplyTrees(stubReples)
      expect(stubEntityManager.getTreeRepository).toHaveBeenCalledTimes(2)
      expect(result.length).toBe(2)
    })

    it('verifies the user can post on createQuestion() before saving the question.', async ()=>{
      const fakeUserId = 'id'
      const fakeQuestionText = 'text'
      jest.spyOn(questionService,'verifyUserCanPost').mockImplementation()
      await questionService.createQuestion(fakeUserId, fakeQuestionText)
      expect(questionService.verifyUserCanPost).toHaveBeenCalledWith(fakeUserId)
      expect(stubQuestionRepo.save).toHaveBeenCalled()
    })

    it('throws an Unauthorized HTTP exception when a non-prof tries to post a discussion question.', async ()=>{
      const fakeUserId = 'id'
      await expect(questionService.verifyUserCanPost(fakeUserId)).rejects.toThrow('Only professors are allowed')
    })


  });
});
