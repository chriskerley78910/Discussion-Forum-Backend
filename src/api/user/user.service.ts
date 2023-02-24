import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, getManager, Repository } from 'typeorm';
import { UserEntity } from './user.entity'

@Injectable()
export class UserService {


  constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>){}
    
  /**
   * Creates a new user.
   * 
   * @param email - The email for the user.
   * @param role - the role of the user.
   */
    public async createUser(email: string, role: string):Promise<UserEntity>{
        await this.assertUniqueEmail(email)
        const user: UserEntity = this.userRepository.create()
        user.email = email 
        user.role = role
        return this.userRepository.save(user)
    }

    /**
     * Gets a user by their id.
     * 
     * @param userId - The unique identifier for the user to get.
     * @returns - The corresponding user or null if they don't exist.
     * @throws - When the user does not exist.
     */
    public async getUserById(userId: string): Promise<UserEntity> {
        const user = await this.userRepository.findOne({
            where:{
                id:userId
            }
        })
        if(!user) throw new HttpException(`No user with uuid "${userId}" exists.`,HttpStatus.BAD_REQUEST)
        return user

    }

    /**
     * Gets user info using their email address.
     * 
     * @param email - The unqiue email address of the user you are trying to find.
     * @returns - The user info for that user. (or nothing if the user does not exist).
     */
    public async getUserByEmail(email: string): Promise<UserEntity>{
        const user: UserEntity | null = await this.userRepository.findOne({
            where:{
                email:email
            }
        })
        if(!user) throw new HttpException(`User with email "${email}" does not exist!`,HttpStatus.NOT_FOUND)
        return user
    }

    
    /**
     * Asserts that the email is unique.
     * 
     * @param email - The email to check for uniqueness.
     * @throws - When the email is not unique.
     */
    public async assertUniqueEmail(email: string):Promise<void>{
        const result = await this.userRepository.findOne({
            where:{
                email:email
            }
        })
        if(result)
            throw new HttpException(`A user with that email already exists!`, HttpStatus.CONFLICT)
    }
}
