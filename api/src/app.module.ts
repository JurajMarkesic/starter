import { CacheInterceptor, CacheModule, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as redisStore from 'cache-manager-redis-store';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import configuration from './config';
import { UsersModule } from './users/users.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        // Type cast important to specify which TypeOrmModuleOptions useFactory() is returning
        type: configService.get<string>('database.provider', 'postgres') as 'postgres',
        host: configService.get<string>('database.host', 'localhost'),
        port: configService.get<number>('database.port', 5432),
        username: configService.get<string>('database.user', 'postgres'),
        password: configService.get<string>('database.password', ''),
        database: configService.get<string>('database.name'),
        synchronize: configService.get<boolean>('database.synchronize'),
        autoLoadEntities: true,
      }),
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: 'redis',
        port: configService.get<string>('cache.port'),
        ttl: configService.get<string>('cache.ttl'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
  exports: [
    CommonModule,
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: 'redis',
        port: configService.get<string>('cache.port'),
        ttl: configService.get<string>('cache.ttl'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
