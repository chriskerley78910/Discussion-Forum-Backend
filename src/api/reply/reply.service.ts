import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, getManager, Repository } from 'typeorm';
import { QuestionService } from '../question/question.service';
import { UserService } from '../user/user.service';
import { ReplyEntity } from './reply.entity';

@Injectable()
export class ReplyService {


  constructor(
    @InjectRepository(ReplyEntity) private replyRepo: Repository<ReplyEntity>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private readonly userService: UserService,
    private readonly questionService: QuestionService
  ){}
  
  /**
   * Gets a reply and all its decendants. 
   * 
   * @param rootReplyId - The unique identifier for a reply.
   * @returns - The reply entity and all its children replies.
   */
  async getReplyTree(rootReplyId: number): Promise<ReplyEntity> {
    const rootReply = await this.getReplyById(rootReplyId)
    const replyTree = await this.getTreeGivenRootReply(rootReply)
    if(!replyTree)
      throw new HttpException(`No reply with id "${rootReplyId}" exists!`, HttpStatus.NOT_FOUND)
    else 
      return replyTree
  }

  /**
   * @param rootReply - The root reply entity is a reply tree.
   * @returns - The reply entity and all its children replies.
   */
  public getTreeGivenRootReply(rootReply: ReplyEntity): Promise<ReplyEntity>{
    return this.entityManager.getTreeRepository(ReplyEntity).findDescendantsTree(rootReply)
  }


  /**
   * Stores a reply to a discussion question.
   * 
   * @param questionId - The unique identifier for the queston being replied to.
   * @param text - The reply text.
   * @returns - The newly created reply.
   */
  async createQuestionReply(userId: string, questionId: number, text: string): Promise<ReplyEntity>{
    await this.userService.getUserById(userId)
    await this.questionService.getById(questionId)
    const reply: ReplyEntity = this.replyRepo.create()
    reply.userId = userId
    reply.text = text
    reply.question = questionId
    return this.replyRepo.save(reply)
  }

  /**
   * Stores a reply to a reply.
   * 
   * @param parentReplyId - The unique identifier for the parent reply being replied to.
   * @param text - The text of the reply.
   */
  async createReplyReply(userId: string, parentReplyId: number, text: string): Promise<ReplyEntity> {
    await this.userService.getUserById(userId)
    const parentReply = await this.getReplyById(parentReplyId)
    const childReply = this.replyRepo.create()
    childReply.userId = userId
    childReply.parent = parentReply
    childReply.question = parentReply.question
    childReply.text = text 
    return this.replyRepo.save(childReply)
  }

  /**
   * Gets a specific reply from storage using its unique id.
   * 
   * @param replyId - The unique indentifier for the reply to be found.
   * @returns - The reply with the matching identifier, but not it's decendant replies!
   * @throws - When no reply exists with the given id.
   */
  async getReplyById(replyId: number): Promise<ReplyEntity>{
    const reply = await this.replyRepo.findOne({
      where:{
        id:replyId
      }
    })
    if(!reply) 
      throw new HttpException(`Reply with id "${replyId}" does not exist!`, HttpStatus.NOT_FOUND)
    return reply
  }



  
}
