import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn, ManyToMany, Tree, TreeParent, TreeChildren, Unique } from 'typeorm';
import { QuestionEntity } from '../../question/question.entity';
import { ReplyEntity } from '../../reply/reply.entity';

@Entity()
export class UserEntity {

    
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({unique: true})
  email: string;

  @Column()
  role: string

  @OneToMany(() => QuestionEntity, (question) => question.userId)
  questions: QuestionEntity[]

  @OneToMany(() => ReplyEntity, (reply) => reply.userId)
  replies: ReplyEntity[]


}