import { Test, TestingModule } from "@nestjs/testing";
import { AuthGuard } from "../common/guards/auth.guard";
import { UserResolver } from "./user.resolver";
import { UserService } from "./user.service";
import { CreateUserInput } from "./dto/create-user.dto";
import { UserRoles } from "../common/enums";
import { LoginInput } from "./dto/login.dto";
import { UpdatedUserInput } from "./dto/update-user.dto";
import { User } from "../models";

describe('UserResolver', () => {
  let resolver: UserResolver;
  let mockUserService: Partial<UserService>;

  beforeEach(async () => {
    mockUserService = {
      createUser: jest.fn(),
      login: jest.fn(),
      getAll: jest.fn(),
      getOne: jest.fn(),
      getByEmail: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        { provide: UserService, useValue: mockUserService },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    resolver = module.get(UserResolver);
  });

  it('should call userService.createUser when registration mutation is called', async () => {
    // Arrange
    const createUserInput: CreateUserInput = {
      role: UserRoles.MODERATOR,
      name: "Sasha",
      surname: "Dudnyk",
      password: "1234qwer",
      age: 20,
      email: "sashad1903@gmail.com"
    };

    // Act
    await resolver.registration(createUserInput);

    // Assert
    expect(mockUserService.createUser).toHaveBeenCalledWith(createUserInput);
  });

  it('should call userService.login when login mutation is called', async () => {
    // Arrange
    const loginInput: LoginInput = {
      email:"sashad1903@gmail.com",
      password:"1234qwer"
    } as LoginInput;

    // Act
    await resolver.login(loginInput);

    // Assert
    expect(mockUserService.login).toHaveBeenCalledWith(loginInput);
  });

  it('should call userService.getAll when users query is called', async () => {
    // Act
    await resolver.users();

    // Assert
    expect(mockUserService.getAll).toHaveBeenCalled();
  });

  it('should call userService.updateUser when updateUser mutation is called', async () => {
    // Arrange
    const user = new User();
    user.id= 1;
    user.role= UserRoles.MODERATOR;
    user.name= "Sasha";
    user.surname= "Dudnyk";
    user.password= "1234qwer";
    user.age= 20;
    user.email= "sashad1903@gmail.com"
    const updatedUserInput: UpdatedUserInput = {
      surname: "Dudnyk2",
      password: "1234qwer",
    };

    // Act
    await resolver.updateUser(user, updatedUserInput);

    // Assert
    expect(mockUserService.updateUser).toHaveBeenCalledWith(user, updatedUserInput);
  });

  it('should call userService.deleteUser when deleteUser mutation is called', async () => {
    // Arrange
    const user = new User();
    user.id= 1;
    user.role= UserRoles.MODERATOR;
    user.name= "Sasha";
    user.surname= "Dudnyk";
    user.password= "1234qwer";
    user.age= 20;
    user.email= "sashad1903@gmail.com"
    const id = 1;

    // Act
    await resolver.deleteUser(user, id);

    // Assert
    expect(mockUserService.deleteUser).toHaveBeenCalledWith(user, id);
  });
});