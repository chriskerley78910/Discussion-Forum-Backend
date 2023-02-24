import { IsInt, IsNotEmpty, IsNumber, IsPositive, IsString, IsUUID } from "class-validator";


export class QuestionReplyDto {

    @IsNumber()
    @IsPositive()
    @IsInt()
    questionId

    @IsUUID()
    userId

    @IsString()
    @IsNotEmpty()
    text
}