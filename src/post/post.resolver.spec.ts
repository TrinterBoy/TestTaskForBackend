import { PostResolver } from './post.resolver';
import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "../common/guards/auth.guard";
import { CreatePostInput } from "./dto/create-post.dto";
import { UpdatePostInput } from "./dto/update-post.dto";
import { UserRoles } from "../common/enums";
import { User } from "../models";

describe('PostResolver', () => {
  let resolver: PostResolver;

  const mockUser: User = new User();
  mockUser.id = 3;
  mockUser.role = UserRoles.MODERATOR;
  mockUser.name = "test";
  mockUser.surname = "Second";
  mockUser.email = "sashad1903@gmail.com";
  mockUser.age = 20;

  const mockJwtService = {};
  const mockPostService = {
    createPost: jest.fn((dto: CreatePostInput) => {
      return {
        id: Date.now(),
        ...dto,
      }
    }),
    update: jest.fn((user: User,dto: UpdatePostInput) => {
      return {
        id: Date.now(),
        header: "string",
        theme: "string",
        text: "string",
        blogId: 1,
        ...dto
      }
    })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostResolver, PostService, JwtService],
    })
      .overrideProvider(PostService)
      .useValue(mockPostService)
      .overrideGuard(AuthGuard)
      .useValue(mockJwtService)
      .compile();

    resolver = module.get(PostResolver);
  });

  it('should be defined', () => {
      expect(resolver).toBeDefined();
    },
  );

  it('should create post', () => {
    expect(resolver.createPost({
      header: "string",
      theme: "string",
      text: "string",
      blogId: 1,
    })).toEqual({
      id:expect.any(Number),
      header: "string",
      theme: "string",
      text: "string",
      blogId: 1,
    })
  })

  it('should update post', () => {
    const updateInput: UpdatePostInput = new UpdatePostInput()
    updateInput.theme = "aaaa";
    expect(resolver.updatePost(mockUser,updateInput)).toEqual({
      id:expect.any(Number),
      header: "string",
      theme: "aaaa",
      text: "string",
      blogId: 1,
    })
  })
});
