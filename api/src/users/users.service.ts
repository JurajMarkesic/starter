import { CacheStore, CACHE_MANAGER, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { validate } from 'class-validator';
import { Counter } from 'prom-client';
import { Repository } from 'typeorm';
import { LoggerService } from './../common/LoggerService';
import { CreateUserDto } from './dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private logger: LoggerService,
    @Inject(CACHE_MANAGER) private readonly cacheStore: CacheStore,
    @InjectMetric('all_users_count') public counter: Counter<string>,
  ) {}

  async findAll() {
    this.counter.inc();
    let users = await this.cacheStore.get('all_users');

    if (users) {
      this.logger.log('Getting all users from cache.');
      return users;
    }

    users = await this.usersRepository.find();
    this.cacheStore.set('all_users', users, { ttl: 20 });
    this.logger.log('Querying all users!');
    return users;
  }

  findOne(id: string): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  async create(dto: CreateUserDto): Promise<User> {
    const { firstName, lastName, email } = dto;

    // Check if email is unique
    const existingUser = await this.usersRepository.findOne({ email });
    if (existingUser) {
      const errors = { email: 'Email must be unique.' };
      throw new HttpException({ message: 'Input data validation failed', errors }, HttpStatus.BAD_REQUEST);
    }

    const newUser = new User();
    newUser.firstName = firstName;
    newUser.lastName = lastName;
    newUser.email = email;
    newUser.isActive = true;

    // Validate input
    const validationErrors = await validate(newUser);
    if (validationErrors.length > 0) {
      const errors = { msg: 'User input is not valid.' };
      throw new HttpException({ message: 'Input data validation failed', errors }, HttpStatus.BAD_REQUEST);
    } else {
      return this.usersRepository.save(newUser);
    }
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
