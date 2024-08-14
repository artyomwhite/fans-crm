import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/service/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AppErrors } from '../common/errors/errors';
import { UserLoginDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { TokenService } from '../token/token.service';
import { AuthUserResponse } from './responsType/authUserResponse';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async registerUsers(createUserDto: CreateUserDto): Promise<CreateUserDto> {
    const existUser = await this.userService.findUserByEmail(createUserDto.email);
    if (existUser) throw new BadRequestException(AppErrors.USER_EXIST);
    return this.userService.create(createUserDto);
  }

  async login(user: UserLoginDto): Promise<AuthUserResponse> {
    const existUser = await this.userService.findUserByEmail(user.email);
    if (!existUser) throw new BadRequestException(AppErrors.USER_DOES_NOT_EXIST);
    const validatePassword = await bcrypt.compare(user.password, existUser.password);
    if (!validatePassword) throw new BadRequestException(AppErrors.WRONG_PASSWORD_OR_EMAIL);
    const token = await this.tokenService.generateJwtToken(user.email);
    const responseUser = await this.userService.publicUser(user.email);
    return { ...responseUser.dataValues, token };
  }

  async getUserById(id: string) {
    const existUser = await this.userService.findOne(+id);
    if (!existUser) throw new BadRequestException(AppErrors.USER_DOES_NOT_EXIST);
    return existUser;
  }

  async getAllUsers() {
    return await this.userService.findAll();
  }
}
