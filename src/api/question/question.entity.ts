import { IsDefined, IsNotEmpty } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, OneToOne, ManyToOne } from 'typeorm';
import { ReplyEntity } from '../reply/reply.entity'
import { UserEntity } from '../user/user.entity';

@Entity()
export class QuestionEntity {

    
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsDefined()
  @IsNotEmpty()
  text: string;

  @Column()
  @IsDefined()
  @ManyToOne(() => UserEntity, (user) => user.questions)
  userId: string

  @OneToMany(type => ReplyEntity, reply => reply.question)
  @JoinColumn()
  replies: ReplyEntity[];

}