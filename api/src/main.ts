import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(process.env.APP_PREFIX || 'api');
  await app.listen(process.env.APP_PORT || 3000);
}
bootstrap();
