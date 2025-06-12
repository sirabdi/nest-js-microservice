import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUsersDto } from './dto/create-users.dto';
import { UpdateUsersDto } from './dto/update-users.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUsersDto: CreateUsersDto) {
    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(createUsersDto.password, saltRounds);

    return this.usersRepository.create({
      ...createUsersDto,
      password: hashPassword,
    });
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
