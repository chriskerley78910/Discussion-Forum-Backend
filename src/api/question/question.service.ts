import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { ReplyEntity } from '../reply/reply.entity';
import { RoleType } from '../user/enum/role-type.enum';
import { UserService } from '../user/user.service';
import { QuestionEntity } from './question.entity';

@Injectable()
export class QuestionService {

  /**
   *  A mapping between role type and whether or not users of the given role can post 
   * discussion questions.
   */
  private static POSTABLE_ROLES: Map<string, boolean> = new Map<string,boolean>([
    [RoleType.PROF, true],
    [RoleType.STUDENT, false]
  ])

  constructor(
    @InjectRepository(QuestionEntity) private questionRepository: Repository<QuestionEntity>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private readonly userService: UserService
  ){}
  
  /**
   * @returns - All the discussion questions currently posted.
   */
  async findAll(): Promise<QuestionEntity[]>{
    const result = await this.questionRepository.find({
      relations:{
        replies:true
      }
    })
    return result
  }

  /**
   * Finds the given question and returns it and all its reply trees.
   * 
   * @param questionId - The unique identifier for the question.
   * @returns - The question associated with the given id.
   * @throws - When no question with the given id exists.
   */
  async getById(questionId: number): Promise<QuestionEntity>{
    const result = await this.getQuestionWithTopLevelReplys(questionId)
    if(!result) throw new HttpException(`No question exists with id "${questionId}".`, HttpStatus.NOT_FOUND)
    result.replies = await this.getReplyTrees(result.replies)
    return result
  }

  /**
   * Gets a question with all its first level of replies. 
   * 
   * @param questionId - The unique identifer for the question.
   * @returns - The question with the given id and all its replies.
   */
  public async getQuestionWithTopLevelReplys(questionId: number): Promise<QuestionEntity>{
    return this.questionRepository.findOne({
      where:{
        id:questionId
      },
      relations:{
        replies:true
      }
    })
  }

  /**
   * Attaches reply trees to the given questions.
   * 
   * @param questions - The questions which are expected to only include their top level replies.
   * @returns - A copy of the questions which their associated reply trees attached.
   */
  public async attachReplyTrees(questions: QuestionEntity[]): Promise<QuestionEntity[]>{
    const questionsWithTrees = [...questions]
    for(let i = 0; i < questionsWithTrees.length; i++)
      questionsWithTrees[i].replies = await this.getReplyTrees(questionsWithTrees[i].replies)
    return questionsWithTrees
  }

  /**
   * Attaches the reply trees for each reply given and returns a shallow copy of them.
   * 
   * @param replies - A list of top level replies without their sub-replies.
   * @returns - The shallow copy of the replies, but with their sub-replies attached to them.
   */
  public async getReplyTrees(replies: ReplyEntity[]): Promise<ReplyEntity[]>{
    const replyTrees: ReplyEntity[] = [...replies]
    for(let i = 0; i < replyTrees.length; i++){
      const topLevelReply = replyTrees[i]
      const treeRepo = await this.entityManager.getTreeRepository(ReplyEntity)
      replyTrees[i] = await treeRepo.findDescendantsTree(topLevelReply)
    }
    return replyTrees
  }
 
  /**
   * Creates a new discussion question.
   * 
   * @param text - The text of the question to be posted.
   * @returns - The created discussion question.
   * @throws - When the user if not authorized to post a question.
   */
  async createQuestion(userId: string, questionText: string): Promise<QuestionEntity>{
    await this.verifyUserCanPost(userId)
    const question: QuestionEntity = this.questionRepository.create()
    question.userId = userId
    question.text = questionText
    return this.questionRepository.save(question)
  }

  /**
   * Verifies that the user is authorized to post a discussion question.
   * 
   * @param userId - The unique indentifier for the user.
   * @throws - When the user is not allowed to post a discussion question.
   */
  public async verifyUserCanPost(userId: string): Promise<void> {
    const user = await this.userService.getUserById(userId)
    const isAllowedToPost = QuestionService.POSTABLE_ROLES.get(user.role)
    if(!isAllowedToPost) 
      throw new HttpException(`Only professors are allowed to post discussion questions!`, HttpStatus.UNAUTHORIZED)
  }

}
