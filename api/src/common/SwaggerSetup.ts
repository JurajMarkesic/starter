import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export class SwaggerSetup {
  constructor(app: INestApplication) {
    if (process.env.NODE_ENV == 'DEV') {
      const options = new DocumentBuilder().setTitle('API documentation').build();
      const document = SwaggerModule.createDocument(app, options);
      SwaggerModule.setup(process.env.API_PREFIX, app, document);
    }
  }
}
