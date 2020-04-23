import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService } from './common/LoggerService';
import { SwaggerSetup } from './common/SwaggerSetup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: false,
  });

  app.useLogger(new LoggerService());
  app.setGlobalPrefix(process.env.API_PREFIX || 'api');

  new SwaggerSetup(app);

  await app.listen(process.env.API_PORT || 3000);
}
bootstrap();
