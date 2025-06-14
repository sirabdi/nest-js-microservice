import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CreateUsersDto } from './dto/create-users.dto';
import { UpdateUsersDto } from './dto/update-users.dto';
import { UsersDocument } from './model/users.schema';
import { UsersService } from './users.service';
import { CurrentUser } from '../../../../libs/common/src/decorators/current-user.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth-guards';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUsersDto: CreateUsersDto): Promise<UsersDocument> {
    return this.usersService.create(createUsersDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getUser(@CurrentUser() user: UsersDocument) {
    return user;
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsersDto: UpdateUsersDto) {
    return this.usersService.update(id, updateUsersDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
