import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (process.env.NODE_ENV == 'DEV') {
    const options = new DocumentBuilder().setTitle('API documentation').build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(process.env.API_PREFIX, app, document);
  }

  app.setGlobalPrefix(process.env.API_PREFIX || 'api');

  await app.listen(process.env.API_PORT || 3000);
}
bootstrap();
