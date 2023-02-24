import { IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";


export class ReplyReplyDto {

    @IsUUID()
    userId

    @IsNumber()
    parentId

    @IsString()
    @IsNotEmpty()
    text
}