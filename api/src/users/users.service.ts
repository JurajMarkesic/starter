import { CacheStore, CACHE_MANAGER, Inject, Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import * as crypto from 'crypto';
import { Counter } from 'prom-client';
import { Repository } from 'typeorm';
import { RegisterDto } from '../auth/dto';
import { LoggerService } from './../common/LoggerService';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private logger: LoggerService,
    @Inject(CACHE_MANAGER) private readonly cacheStore: CacheStore,
    @InjectMetric('all_users_count') public counter: Counter<string>,
  ) {}

  async getAll() {
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

  async get(id: number): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  async getByEmail(email: string) {
    return await this.usersRepository
      .createQueryBuilder('users')
      .where('users.email = :email')
      .setParameter('email', email)
      .getOne();
  }

  async getByEmailAndPass(email: string, password: string): Promise<User> {
    const passHash = crypto.createHmac('sha256', password).digest('hex');
    return await this.usersRepository
      .createQueryBuilder('users')
      .where('users.email = :email and users.password = :password')
      .setParameter('email', email)
      .setParameter('password', passHash)
      .getOne();
  }

  async create(payload: RegisterDto): Promise<User> {
    const oldUser = await this.getByEmail(payload.email);

    if (oldUser) {
      throw new NotAcceptableException('User with provided email already created.');
    }

    //@ts-ignore - wrong return type interference from an overloaded function
    return await this.usersRepository.save(this.usersRepository.create(payload));
  }
}
