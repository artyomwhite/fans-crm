import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../model/user.model';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../dto/create-user.dto';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly userRepository: typeof User,
  ) {}

  async hashPassword(password) {
    return bcrypt.hash(password, 10);
  }

  async publicUser(email: string) {
    return this.userRepository.findOne({ where: { email }, attributes: { exclude: ['password'] } });
  }
  async findUserByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async create(user: CreateUserDto): Promise<CreateUserDto> {
    user.password = await this.hashPassword(user.password);
    await this.userRepository.create({
      email: user.email,
      name: user.name,
      phone: user.phone,
      password: user.password,
    });
    return user;
  }

  async findOne(id: number) {
    console.log('in findOne', id);
    return this.userRepository.findOne({ where: { id } });

    return `This action returns a #${id} user`;
  }

  async findAll() {
    return this.userRepository.findAll();
  }
}
