import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import configuration from './config';
import { UsersModule } from './users/users.module';

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
    UsersModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [CommonModule],
})
export class AppModule {}
