import { Body, Controller, Get, Post, Session } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@Session() session: { aaaa?: number; id: string }) {
    console.log('aaaaaaaaaaaaaaaaaaa', session.id);
    return this.usersService.findAll();
  }

  @Post()
  create(@Body() dto: CreateUserDto): Promise<User> {
    return this.usersService.create(dto);
  }
}
