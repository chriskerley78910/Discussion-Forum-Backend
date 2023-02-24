import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { createMock } from '@golevelup/ts-jest';
import { QuestionController } from './question.controller';
import { QuestionEntity } from './question.entity';
import { QuestionService } from './question.service';
import { UserService } from '../user/user.service';
import { CreateQuestionDto } from './question.dto';
import { CACHE_MANAGER } from '@nestjs/common';

describe('QuestionController', () => {

  let questionService: QuestionService;
  let questionController: QuestionController;
  let mockRepository = {

  }

  let entityManager: EntityManager;

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
        useValue: mockRepository
      },
      { 
        provide: EntityManager, 
        useValue: createMock<EntityManager>() 
      },
      {
        provide: UserService,
        useValue: createMock<UserService>()
      }
    ],
    }).compile();
    questionService = question.get<QuestionService>(QuestionService);
    questionController = question.get<QuestionController>(QuestionController);
    entityManager = question.get(EntityManager);
  });

  describe('question.controller', () => {

    const fakeQuestionId = 1
    const mockQuestion = new QuestionEntity()

    it('finds all the questions and attached their reply trees on findAll()', async () => {
        const fakeIntermediateResult = [new QuestionEntity()];
        const fakeFinalResult = [new QuestionEntity()]
        jest.spyOn(questionService, 'findAll').mockImplementation(() => Promise.resolve(fakeIntermediateResult));
        jest.spyOn(questionService, 'attachReplyTrees').mockImplementation(() => Promise.resolve(fakeFinalResult))
        const result = await questionController.findAll()
        expect(questionService.findAll).toBeCalled()
        expect(questionService.attachReplyTrees).toBeCalledWith(fakeIntermediateResult)
        expect(result).toBe(fakeFinalResult)
    });

    it('throws on findOne() when no question exists with the given id.', async ()=>{
      jest.spyOn(questionService,'getById').mockImplementation(() => Promise.resolve(null))
      await expect(questionController.findOne(fakeQuestionId)).rejects.toThrow('does not exist')
    })

    it('returns the question with the given id on findOne(questionId)', async () => {
      jest.spyOn(questionService,'getById').mockImplementation(() => Promise.resolve(mockQuestion))
      const result = await questionController.findOne(fakeQuestionId)
      expect(result).toBe(mockQuestion)
    })

    it('uses the userId and text of the question to create a new discussion question.', async ()=>{
      const dto = new CreateQuestionDto()
      dto.text = 'text'
      dto.userId = 'fake userId'
      jest.spyOn(questionService,'createQuestion').mockImplementation(() => Promise.resolve(mockQuestion))
      const result = await questionController.createQuestion(dto)
      expect(questionService.createQuestion).toBeCalledWith(dto.userId, dto.text)
      expect(result).toBe(mockQuestion)
    })


  });
});
