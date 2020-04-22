import { Module } from '@nestjs/common';
import { LoggerService } from './LoggerService';

@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class CommonModule {}
