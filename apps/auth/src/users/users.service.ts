import * as bcrypt from 'bcrypt';
import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUsersDto } from './dto/create-users.dto';
import { UpdateUsersDto } from './dto/update-users.dto';
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUsersDto: CreateUsersDto) {
    await this.validateCreateUserDto(createUsersDto);

    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(createUsersDto.password, saltRounds);

    return this.usersRepository.create({
      ...createUsersDto,
      password: hashPassword,
    });
  }

  private async validateCreateUserDto(createUsersDto: CreateUsersDto) {
    try {
      await this.usersRepository.findOne({ email: createUsersDto.email });
    } catch (err) {
      return;
    }

    throw new UnprocessableEntityException('Email already taken!');
  }

  async verifyUser(email: string, password: string) {
    const user = await this.usersRepository.findOneWithPassword({ email });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials (user not found).');
    }

    if (!user.password) {
      throw new UnauthorizedException(
        'Internal error: User password not found in database record.',
      );
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid!');
    }

    return user;
  }

  async getUser(getUserDto: GetUserDto) {
    return this.usersRepository.findOne(getUserDto);
  }

  findAll() {
    return this.usersRepository.find({});
  }

  findOne(_id: string) {
    return this.usersRepository.findOne({ _id });
  }

  update(_id: string, updateUsersDto: UpdateUsersDto) {
    return this.usersRepository.findOneAndUpdate(
      { _id },
      { $set: updateUsersDto },
    );
  }

  remove(_id: string) {
    return this.usersRepository.findOneAndDelete({ _id });
  }
}
