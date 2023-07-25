import { Test, TestingModule } from "@nestjs/testing";
import { BlogService } from "./blog.service";
import { UserService } from "../user/user.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Blog, User } from "../models";
import { CreateBlogInput } from "./dto/create-blog.dto";
import { UpdateBlogInput } from "./dto/update-blog.dto";
import { GetBlogArgs } from "./dto/get-blog.dto";
import { OrderTypeEnum } from "../common/enums";

describe('BlogService', () => {
  let service: BlogService;
  const mockUserService = { getOne: jest.fn() };
  const mockBlogRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
    findOne: jest.fn().mockImplementation(()=> {
      return {
      description: "This is a test blog.",
      id: 1,
      title: "Test Blog",
      userId: 1,
        user: {
          id: 1
        }
      }
    }),
  };

  const mockUser: any = { id: 1, username: 'testuser' };
  const mockCreateBlogInput: CreateBlogInput = {
    title: 'Test Blog',
    description: 'This is a test blog.',
    userId: 1,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: getRepositoryToken(Blog),
          useValue: mockBlogRepository,
        },
      ],
    }).compile();

    service = module.get(BlogService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new blog if the user exists', async () => {
    // Mock the userService getOne method to return the user
    mockUserService.getOne.mockResolvedValue(mockUser);

    // Mock the blogRepository create and save methods
    mockBlogRepository.create.mockReturnValue({
      id: 1,
      ...mockCreateBlogInput,
      userId: mockUser.id,
    });
    mockBlogRepository.save.mockResolvedValue({
      id: 1,
      ...mockCreateBlogInput,
      userId: mockUser.id,
    });

    const result = await service.create(mockUser, mockCreateBlogInput);

    expect(mockUserService.getOne).toHaveBeenCalledWith(mockCreateBlogInput.userId);

    expect(mockBlogRepository.create).toHaveBeenCalledWith(mockCreateBlogInput);

    expect(mockBlogRepository.save).toHaveBeenCalled();

    expect(result).toEqual({
      id: 1,
      ...mockCreateBlogInput,
      userId: mockUser.id,
      user: {
        id: 1
      }
    });
  });

  it('should throw an error if the user does not exist', async () => {
    mockUserService.getOne.mockResolvedValue(null);

    await expect(
      service.create(mockUser, mockCreateBlogInput),
    ).rejects.toThrowError(
      `There is no user with id:${mockCreateBlogInput.userId}`,
    );

    expect(mockUserService.getOne).toHaveBeenCalledWith(mockCreateBlogInput.userId);

    expect(mockBlogRepository.save).not.toHaveBeenCalled();
  });

  it('should get all blogs with pagination, sorting, and filtering options', async () => {
    const mockGetBlogArgs: GetBlogArgs = {
      offset: 0,
      limit: 10,
      sortField: 'title',
      sortValue: OrderTypeEnum.asc,
      filterField: 'description',
      filterValue: 'test',
    } as GetBlogArgs;

    const mockBlog = new Blog();
    mockBlog.id = 1; // Assuming 'blogId' is a variable with a valid value
    mockBlog.title = 'Test Blog 1';
    mockBlog.description = 'This is a test blog 1.';
    mockBlog.userId = 1;
    mockBlog.user = null; // Replace with your mocked user if needed
    mockBlog.posts = []; // Replace with your mocked posts if needed

    const mockBlog2 = new Blog();
    mockBlog2.id = 2; // Assuming 'blogId' is a variable with a valid value
    mockBlog2.title = 'Test Blog 2';
    mockBlog2.description = 'This is a test blog 2.';
    mockBlog2.userId = 1;
    mockBlog2.user = null; // Replace with your mocked user if needed
    mockBlog2.posts = []; // Replace with your mocked posts if needed


    const mockBlogs: Blog[] = [
      { ...mockBlog},
      { ...mockBlog2},
    ];

    // Mock the blogRepository find method to return the mockBlogs array
    mockBlogRepository.find.mockResolvedValue(mockBlogs);

    const result = await service.getAll(mockGetBlogArgs as GetBlogArgs);

    // Assert that blogRepository find method was called with the correct arguments
    expect(mockBlogRepository.find).toHaveBeenCalledWith({
      relations: { user: true, posts: true },
      skip: mockGetBlogArgs.offset,
      take: mockGetBlogArgs.limit,
      order: { [mockGetBlogArgs.sortField]: mockGetBlogArgs.sortValue },
      where: { [mockGetBlogArgs.filterField]: mockGetBlogArgs.filterValue },
    });

    // Assert that the result matches the expected blogs array
    expect(result).toEqual(mockBlogs);
  });

  it('should get one blog by its ID', async () => {
    const blogId = 1;

    const mockBlog = new Blog();
    mockBlog.id = blogId;
    mockBlog.title = 'Test Blog';
    mockBlog.description = 'This is a test blog.';
    mockBlog.userId = 1;
    mockBlog.user = null;
    mockBlog.posts = [];

    mockBlogRepository.findOne.mockResolvedValue(mockBlog);

    const result = await service.getOne(blogId);

    expect(mockBlogRepository.findOne).toHaveBeenCalledWith({
      where: { id: blogId },
      relations: { user: true, posts: true },
    });

    // Assert that the result matches the expected blog object
    expect(result).toEqual(mockBlog);
  });

  it('should get all blogs associated with a specific user', async () => {
    const userId = 1;

    const mockBlog1 = new Blog();
    mockBlog1.id = 1;
    mockBlog1.title = 'Test Blog 1';
    mockBlog1.description = 'This is a test blog 1.';
    mockBlog1.userId = userId; // Assuming 'userId' is a variable with a valid value
    mockBlog1.user = null; // Replace with your mocked user if needed
    mockBlog1.posts = []; // Replace with your mocked posts if needed

    const mockBlog2 = new Blog();
    mockBlog2.id = 2; // Assuming 'blogId' is a variable with a valid value
    mockBlog2.title = 'Test Blog';
    mockBlog2.description = 'This is a test blog.';
    mockBlog2.userId = 1;
    mockBlog2.user = null; // Replace with your mocked user if needed
    mockBlog2.posts = []; // Replace with your mocked posts if needed

    const mockBlogs: Blog[] = [
          {...mockBlog1},
      {...mockBlog2},
    ];

    // Mock the blogRepository find method to return the mockBlogs array
    mockBlogRepository.find.mockResolvedValue(mockBlogs);

    const result = await service.getByUserId(userId);

    // Assert that blogRepository find method was called with the correct arguments
    expect(mockBlogRepository.find).toHaveBeenCalledWith({
      relations: { user: true, posts: true },
      where: { user: { id: userId } },
    });

    // Assert that the result matches the expected blogs array
    expect(result).toEqual(mockBlogs);
  });

  it('should update a blog with the provided data', async () => {
    const mockRequestUser = new User();
    mockRequestUser.id = 1;
    mockRequestUser.name = 'testuser';
    const blogId = 1;

    const mockUpdateBlogInput: UpdateBlogInput = {
      id: blogId,
      title: 'Updated Test Blog',
      description: 'This is an updated test blog.',
      userId: 1,
    };

    let mockUpdatedBlog = new Blog()
    mockUpdatedBlog.id= blogId;
    mockUpdatedBlog = {...mockUpdatedBlog,...mockUpdateBlogInput}
    mockUpdatedBlog.user = {id: 1} as User;
    mockUpdatedBlog.posts = [];

    mockBlogRepository.findOne.mockResolvedValue(mockUpdatedBlog);

    mockBlogRepository.save.mockResolvedValue(mockUpdatedBlog);

    const result = await service.update(mockRequestUser as User, mockUpdateBlogInput as UpdateBlogInput);

    expect(mockBlogRepository.findOne).toHaveBeenCalledWith({
      where: { id: blogId },
      relations: { user: true },
    });

    // Assert that blogRepository save method was called with the updated blog data
    expect(mockBlogRepository.save).toHaveBeenCalledWith({
      ...mockUpdatedBlog,
      ...mockUpdateBlogInput,
    });

    // Assert that the result matches the updated blog object
    expect(result).toEqual(mockUpdatedBlog);
  });

  it('should throw a ForbiddenError when updating a blog with insufficient permissions', async () => {
    const mockRequestUser: User = { id: 2, name: 'otheruser' } as User;
    const blogId = 1;

    const mockUpdateBlogInput: UpdateBlogInput = {
      id: blogId,
      title: 'Updated Test Blog',
      description: 'This is an updated test blog.',
      userId: 1,
    };

    const mockBlog = new Blog();
    mockBlog.id = blogId; // Assuming 'blogId' is a variable with a valid value
    mockBlog.title = 'Test Blog';
    mockBlog.description = 'This is a test blog.';
    mockBlog.userId = 1;
    mockBlog.user = {id:1}as User; // Replace with your mocked user if needed
    mockBlog.posts = []; // Replace with your mocked posts if needed

    mockBlogRepository.findOne.mockResolvedValue(mockBlog);

    // Assert that updating the blog with insufficient permissions throws a ForbiddenError
    await expect(
      service.update(mockRequestUser, mockUpdateBlogInput),
    ).rejects.toThrowError('You dont have permission to update this blog');
  });

  it('should delete a blog by its ID', async () => {
    const mockRequestUser: User = { id: 1, name: 'testuser' } as User;
    const blogId = 1;

    const mockBlog = new Blog();
    mockBlog.id = blogId; // Assuming 'blogId' is a variable with a valid value
    mockBlog.title = 'Test Blog';
    mockBlog.description = 'This is a test blog.';
    mockBlog.userId = 1;
    mockBlog.user = {id:1} as User; // Replace with your mocked user if needed
    mockBlog.posts = []; // Replace with your mocked posts if needed

    mockBlogRepository.findOne.mockResolvedValue(mockBlog);

    mockBlogRepository.delete.mockResolvedValue(undefined);

    const result = await service.delete(mockRequestUser, blogId);

    expect(mockBlogRepository.findOne).toHaveBeenCalledWith({
      where: { id: blogId },
      relations: { user: true },
    });

    // Assert that blogRepository delete method was called with the correct blog ID
    expect(mockBlogRepository.delete).toHaveBeenCalledWith({ id: blogId });

    // Assert that the result matches the deleted blog object
    expect(result).toEqual(mockBlog);
  });

  it('should throw a ForbiddenError when deleting a blog with insufficient permissions', async () => {
    const mockRequestUser: User = { id: 2, name: 'otheruser' } as User;
    const blogId = 1;

    const mockBlog = new Blog();
    mockBlog.id = blogId; // Assuming 'blogId' is a variable with a valid value
    mockBlog.title = 'Test Blog';
    mockBlog.description = 'This is a test blog.';
    mockBlog.userId = 1;
    mockBlog.user = { id: 1, name: 'testuser' } as User; // Replace with your mocked user if needed
    mockBlog.posts = []; // Replace with your mocked posts if needed


    mockBlogRepository.findOne.mockResolvedValue(mockBlog);

    await expect(
      service.delete(mockRequestUser, blogId),
    ).rejects.toThrowError('You dont have permission to delete this blog');
  });
});