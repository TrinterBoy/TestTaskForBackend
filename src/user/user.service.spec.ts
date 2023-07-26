import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "../models";
import { UserRoles } from "../common/enums";
import { UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "../common/guards/auth.guard";

describe('UserService', () => {
  let service: UserService;
  let mockUserRepository;

  beforeEach(async () => {
    jest.clearAllMocks();

    mockUserRepository={
      create: jest.fn((user: Partial<User>) => user),

      save: jest.fn((user: Partial<User>) => Promise.resolve({id:1,...user})),

      findOne: jest.fn((query: any) => {
        const mockUser: Partial<User> = {
          id: 1,
          email: 'test@example.com',
          password: '91ea3462f20c2a8d5c9ec3c8a45a46da:76a9ac16d44cc7684991289eb59cbafaa21394b8549d530559dab6e4670cf6c66c5874795881016426658a9cd499ab0636d17fccc787aad41048d3ce0c287ace',
        };

        return (query.where.email === mockUser.email || query.where.id === mockUser.id) ? mockUser : undefined;
      }),

      find: jest.fn(() => {
        const mockUsers: Partial<User>[] = [
          { id: 1, email: 'test1@example.com', password: '91ea3462f20c2a8d5c9ec3c8a45a46da:76a9ac16d44cc7684991289eb59cbafaa21394b8549d530559dab6e4670cf6c66c5874795881016426658a9cd499ab0636d17fccc787aad41048d3ce0c287ace\n' },
          { id: 2, email: 'test2@example.com', password: '91ea3462f20c2a8d5c9ec3c8a45a46da:76a9ac16d44cc7684991289eb59cbafaa21394b8549d530559dab6e4670cf6c66c5874795881016426658a9cd499ab0636d17fccc787aad41048d3ce0c287ace\n' },
        ];

        return mockUsers;
      }),

      delete: jest.fn((id: number) => {
        return id;
      }),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        JwtService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).overrideGuard(AuthGuard).useValue({ canActivate: () => true }).compile();

    service = module.get(UserService);
  });

  it('should create a new user', async () => {
    const createUserInput = {
      role: UserRoles.MODERATOR,
      name: "Sasha",
      surname: "Dudnyk",
      password: "1234qwer",
      age: 20,
      email: "sashad1903@gmail.com"
    };

    const createdUser = await service.createUser(createUserInput);

    expect(createdUser).toBeDefined();
    expect(createdUser.id).toBeDefined();
    expect(createdUser.email).toBe(createUserInput.email);
  });

  it('should return a valid token on successful login', async () => {
    const loginInput = {
      email: 'test@example.com',
      password: 'hashed_password',
    };

    const { token } = await service.login(loginInput);

    expect(token).toBeDefined();
    expect(token.length).toBeGreaterThan(0);
  });

  it('should throw UnauthorizedException on wrong email or password', async () => {
    const loginInput = {
      email: 'invalid@example.com',
      password: 'wrong_password',
    };

    await expect(service.login(loginInput)).rejects.toThrowError(
      UnauthorizedException,
    );
  });

  it('should return an array of users', async () => {
    const users = await service.getAll();

    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBeGreaterThan(0);
  });

  it('should update the user information', async () => {
    const requestUser = {
      id: 1,
      email: 'test@example.com',
    } as User;

    const updatedUserInput = {
      surname: "Dudnyk2",
      password: "1234qwer",
    };

    const updatedUser = await service.updateUser(requestUser, updatedUserInput);

    expect(updatedUser).toBeDefined();
    expect(updatedUser.id).toBeDefined();
  });

  it('should delete a user', async () => {
    const requestUser = {
      id: 1,
      email: 'moderator@example.com',
      role: UserRoles.MODERATOR,
    } as User;

    const idToDelete = 1;

    const deletedUser = await service.deleteUser(requestUser, idToDelete);

    expect(deletedUser).toBeDefined();
    expect(deletedUser.id).toBe(idToDelete);
  });

  it('should throw ForbiddenError if the requester is not a moderator', async () => {
    const requestUser = {
      email: 'normaluser@example.com',
      role: UserRoles.WRITER,
    } as User;

    const idToDelete = 1;

    await expect(service.deleteUser(requestUser, idToDelete)).rejects.toThrowError();
  });

  it('should throw ForbiddenError if the user to delete does not exist', async () => {
    const requestUser = {
      email: 'moderator@example.com',
      role: UserRoles.MODERATOR,
    } as User;

    const idToDelete = 999;

    await expect(service.deleteUser(requestUser, idToDelete)).rejects.toThrowError();
  });

});