import { IsEmail, IsEnum, IsInt, IsNotEmpty, IsNumber, IsPositive, IsString, IsUUID } from "class-validator";
import { RoleType } from '../enum/role-type.enum';

export class UserCreationDto {

    @IsEmail()
    email

    @IsString()
    @IsNotEmpty()
    @IsEnum(RoleType)
    role
}