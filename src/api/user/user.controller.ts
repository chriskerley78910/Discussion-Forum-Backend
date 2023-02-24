import { Body, Controller, Get, Param, Post } from "@nestjs/common"
import { UserCreationDto } from "./dtos/user-creation.dto"
import { UserInfoRequestDto } from "./dtos/user-info.dto"
import { UserEntity } from "./user.entity"
import { UserService } from "./user.service"

@Controller('users')
export class UserController {

  constructor(private readonly userService: UserService) {}


  /**
   * @param user - The user info needed to create a new user.
   * @returns - The new user.
   */
  @Post('create')
  createUser(@Body() user: UserCreationDto): Promise<UserEntity> {
    return this.userService.createUser(user.email, user.role)
  }

  /**
   * 
   * @param infoRequest - A request for the users info.
   * @returns - Info about the user with the given email address.
   */
  @Get('info')
  getUserByEmail(@Body() infoRequest: UserInfoRequestDto): Promise<UserEntity> {
    return this.userService.getUserByEmail(infoRequest.user_email)
  }

}
