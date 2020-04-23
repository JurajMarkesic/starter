import { NestFactory } from '@nestjs/core';
import * as store from 'connect-redis';
import * as rateLimit from 'express-rate-limit';
import * as session from 'express-session';
import * as helmet from 'helmet';
import * as redis from 'redis';
import { AppModule } from './app.module';
import { LoggerService } from './common/LoggerService';
import { SwaggerSetup } from './common/SwaggerSetup';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: false,
  });

  app.useLogger(new LoggerService());
  app.setGlobalPrefix(process.env.API_PREFIX || 'api');
  app.use(helmet());
  app.enableCors();
  app.use(
    rateLimit({
      windowMs: process.env.APP_RATE_LIMIT_WINDOW,
      max: process.env.APP_RATE_LIMIT_REQUESTS,
    }),
  );

  const RedisStore = store(session);
  const redisClient = redis.createClient(process.env.CACHE_PORT, 'redis');
  app.use(
    session({
      store: new RedisStore({ client: redisClient, ttl: process.env.SESSION_TTL }),
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    }),
  );

  new SwaggerSetup(app);

  await app.listen(process.env.API_PORT || 3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
