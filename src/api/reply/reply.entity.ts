import { IsDefined } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn, ManyToMany, Tree, TreeParent, TreeChildren } from 'typeorm';
import { QuestionEntity } from '../question/question.entity';
import { UserEntity } from '../user/user.entity';

@Tree("closure-table")
@Entity()
export class ReplyEntity {

    
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @JoinColumn()
  @ManyToOne(type => QuestionEntity)
  question: number

  @Column()
  @IsDefined()
  @ManyToOne(() => UserEntity, (user) => user.replies)
  userId: string

  @TreeChildren()
  children: ReplyEntity[];

  @TreeParent()
  parent: ReplyEntity;







}