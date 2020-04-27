import { CacheInterceptor, Controller, Get, Session, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
@UseInterceptors(CacheInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@Session() session: { id: string }) {
    console.log('Session ID: ', session.id);
    return this.usersService.getAll();
  }
}
