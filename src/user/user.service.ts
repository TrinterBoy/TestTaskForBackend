import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../models';
import { CreateUserInput } from './dto/create-user.dto';
import { LoginInput } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as util from 'node:util';
import * as crypto from 'node:crypto';
import { configService } from '../common/config/config.service';
import { UpdatedUserInput } from './dto/update-user.dto';
import { UserRoles } from '../common/enums';
import { ForbiddenError } from '@nestjs/apollo';

const encryptIterations = 50_000;
const encryptKeyLength = 64;
const encryptDigest = 'sha512';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async createUser(createUserInput: CreateUserInput): Promise<User> {
    try {
      createUserInput.password = await this.encryptPassword(
        createUserInput.password,
      );
      const newUser = this.userRepository.create(createUserInput);
      return this.userRepository.save(newUser);
    } catch (error) {
      throw new Error(error);
    }
  }

  async login(loginInput: LoginInput): Promise<{ token: string }> {
    const user = await this.userRepository.findOne({
      where: { email: loginInput.email },
    });
    if (!user) {
      throw new UnauthorizedException('Wrong email or password');
    }
    if (!(await this.checkPassword(loginInput.password, user.password))) {
      throw new UnauthorizedException('Incorrect password or email');
    }
    delete user.password;
    const payload = {
      ...user,
    };
    const token = await this.jwtService.signAsync(payload, {
      secret: configService.getAppSecret(),
    });
    if (!token) {
      throw new Error('token error');
    }
    return { token };
  }

  async getAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async getOne(id: number): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async getByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async updateUser(
    requestUser: User,
    updatedUserInput: UpdatedUserInput,
  ): Promise<User> {
    try {
      let user = await this.getByEmail(requestUser.email);
      if (updatedUserInput.password) {
        updatedUserInput.password = await this.encryptPassword(
          updatedUserInput.password,
        );
      }
      user = { ...user, ...updatedUserInput };
      await this.userRepository.save(user);
      return await this.getOne(user.id);
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteUser(requestUser: User, id: number): Promise<User> {
    try {
      if (requestUser.role !== UserRoles.MODERATOR) {
        throw new ForbiddenError('You dont have permission to delete users');
      }
      const user = await this.getOne(id);
      if (!user) {
        throw new ForbiddenError(`No user with id:${id}`);
      }
      await this.userRepository.delete({ id });
      return requestUser;
    } catch (error) {
      throw new Error(error);
    }
  }

  private async encryptPassword(plainPassword: string): Promise<string> {
    const salt = crypto.randomBytes(16).toString('hex');

    const crypt = util.promisify(crypto.pbkdf2);

    const encryptedPassword = await crypt(
      plainPassword,
      salt,
      encryptIterations,
      encryptKeyLength,
      encryptDigest,
    );

    return salt + ':' + encryptedPassword.toString('hex');
  }

  private async checkPassword(
    password: string,
    existPassword: string,
  ): Promise<boolean> {
    const [salt, key] = existPassword.split(':');

    const crypt = util.promisify(crypto.pbkdf2);

    const encryptedPassword = await crypt(
      password,
      salt,
      encryptIterations,
      encryptKeyLength,
      encryptDigest,
    );
    return key === encryptedPassword.toString('hex');
  }
}
