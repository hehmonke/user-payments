import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.setGlobalPrefix('api');
  app.enableShutdownHooks();
  const configService = app.get(ConfigService);

  await app.listen(configService.get('PORT') || '3000', configService.get('HOST') || '0.0.0.0', () => {
    Logger.log('Listening at http://localhost:' + configService.get('PORT'));
  });
}

bootstrap();
