import { Test, TestingModule } from '@nestjs/testing';
import { ReplyController } from './reply.controller';
import { ReplyService } from './reply.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ReplyEntity } from './reply.entity';
import { EntityManager } from 'typeorm';
import { createMock } from '@golevelup/ts-jest';
import { UserService } from '../user/user.service';
import { QuestionService } from '../question/question.service';

describe('ReplyService', () => {

  let replyService: ReplyService;
  let replyController: ReplyController;
  let mockRepository
  let mockEntityManager
  let mockReply = new ReplyEntity()
  const createMockReply = () => mockReply

  beforeEach(async () => {
    mockEntityManager = createMock<EntityManager>()
    mockRepository = {
        save:jest.fn(),
        create:jest.fn(() => createMockReply())
      }
    const reply: TestingModule = await Test.createTestingModule({
      controllers: [ReplyController],
      providers: [ReplyService,
        {
          provide:getRepositoryToken(ReplyEntity),
          useValue: mockRepository
        },
        { 
          provide: EntityManager, 
          useValue: mockEntityManager 
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

    it('throws on getReplyTree(rootReplyId) when the root reply does not exists.', async () => {
        const mockReply = new ReplyEntity()
        jest.spyOn(replyService,'getReplyById').mockImplementation(() => Promise.resolve(mockReply))
        jest.spyOn(replyService,'getTreeGivenRootReply').mockImplementation(() => null)
        await expect(replyService.getReplyTree(100)).rejects.toThrow('No reply with id "100"')
    });

    it('creates, sets and saves a new reply on createReplyReply()', async ()=>{
        const fakeUserId = 'user', parentReplyId = 1, fakeText = 'text'
        const mockReply = new ReplyEntity()
        jest.spyOn(replyService,'getReplyById').mockImplementation(() => Promise.resolve(mockReply))
        await replyService.createReplyReply(fakeUserId, parentReplyId, fakeText)
        expect(mockRepository.create).toHaveBeenCalled()
        expect(mockRepository.save).toHaveBeenCalledWith(expect.objectContaining({
            parent:mockReply,
            userId:fakeUserId,
            text:fakeText
        }))
    })

    it('throws on getReplyById(id) when no reply with that id exists.', async ()=>{
        const fakeReplyId = 1
        mockRepository.findOne = jest.fn(() => Promise.resolve(null))
        await expect(replyService.getReplyById(fakeReplyId)).rejects.toThrow('does not exist')
    })

    it('returns the reply on getReplyByReply(id)', async ()=>{
        const fakeReplyId = 1
        mockRepository.findOne = jest.fn(() => Promise.resolve(mockReply))
        expect(replyService.getReplyById(fakeReplyId)).resolves.toBe(mockReply)
    })


  });
});
