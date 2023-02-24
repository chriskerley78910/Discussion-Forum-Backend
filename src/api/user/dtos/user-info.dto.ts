import { IsDefined, IsEmail } from "class-validator";

export class UserInfoRequestDto {

    @IsEmail()
    user_email
}