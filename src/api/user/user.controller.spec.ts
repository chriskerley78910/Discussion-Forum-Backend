import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { createMock } from '@golevelup/ts-jest';
import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { UserService } from '../user/user.service';
import { UserCreationDto } from './dtos/user-creation.dto';
import { RoleType } from './enum/role-type.enum';
import { UserInfoRequestDto } from './dtos/user-info.dto';

describe('UserController', () => {

  let userService: UserService;
  let userController: UserController;
  let mockRepository = {

  }

  let entityManager: EntityManager;

  beforeEach(async () => {
    const user: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService,
      {
        provide:getRepositoryToken(UserEntity),
        useValue: mockRepository
      },
      { 
        provide: EntityManager, 
        useValue: createMock<EntityManager>() 
      },
      {
        provide: UserService,
        useValue: createMock<UserService>()
      }
    ],
    }).compile();
    userService = user.get<UserService>(UserService);
    userController = user.get<UserController>(UserController);
    entityManager = user.get(EntityManager);
  });

  describe('user.controller', () => {

    it('parses the dto and calls create user on the service.', async () => {
        const fakeEmail = 'a@b.com', fakeRole = RoleType.PROF
        await userController.createUser(new UserCreationDto())
        expect(userService.createUser).toBeCalled()
    });

    it('parses the email and gets the user info from the user service.', async ()=>{
        await userController.getUserByEmail(new UserInfoRequestDto())
        expect(userService.getUserByEmail).toBeCalled()
    })


  });
});
