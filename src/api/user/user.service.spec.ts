import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { createMock } from '@golevelup/ts-jest';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { UserCreationDto } from './dtos/user-creation.dto';
import { RoleType } from './enum/role-type.enum';
import { UserInfoRequestDto } from './dtos/user-info.dto';

describe('UserService', () => {

  let userService: UserService;
  let mockRepository
  let entityManager: EntityManager;
  let mockUser

  beforeEach(async () => {
    mockUser = new UserEntity()
    mockRepository = {
        create:jest.fn(() => mockUser),
        save:jest.fn()
    }
    const user: TestingModule = await Test.createTestingModule({
      controllers: [UserService],
      providers: [UserService,
      {
        provide:getRepositoryToken(UserEntity),
        useValue: mockRepository
      },
      { 
        provide: EntityManager, 
        useValue: createMock<EntityManager>() 
      }
    ],
    }).compile();
    userService = user.get<UserService>(UserService);
    entityManager = user.get(EntityManager);
  });

  describe('user.controller', () => {

    const fakeEmail = 'a@b.com', fakeRole = RoleType.PROF, fakeUserId = 'user'

    it('creates and saves the new user when the email is unique.', async () => {
     
        jest.spyOn(userService,'assertUniqueEmail').mockImplementation(() => Promise.resolve())
        await userService.createUser(fakeEmail, fakeRole)
        expect(mockRepository.create).toBeCalled()
    });

    it('throws when trying to get a user by id and they do not exist.', async ()=>{
        const fakeUserId = 'user'
        mockRepository.findOne = jest.fn(() => Promise.resolve(null))
        await expect(userService.getUserById(fakeUserId)).rejects.toThrow('No user with uuid')
    })

    it('returns the user when they exist  given their id.',()=>{
        const fakeUserId = 'user'
        mockRepository.findOne = jest.fn(() => Promise.resolve(mockUser))
        expect(userService.getUserById(fakeUserId)).resolves.toBe(mockUser)
    })

    it('throws when trying to get a user by email and they do not exist.', async ()=>{
        mockRepository.findOne = jest.fn(() => Promise.resolve(null))
        await expect(userService.getUserByEmail(fakeEmail)).rejects.toThrow('User with email ')
    })

    it('returns the user when getting them by email and they exist.', async ()=>{
        mockRepository.findOne = jest.fn(() => Promise.resolve(mockUser))
        await expect(userService.getUserByEmail(fakeEmail)).resolves.toBe(mockUser)
    })

    it('throws when the email is not unique.', async ()=>{
      mockRepository.findOne = jest.fn(() => Promise.resolve(mockUser))
      await expect(userService.assertUniqueEmail(fakeEmail)).rejects.toThrow('email already exists')
  })


  });
});
