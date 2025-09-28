import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { ErrorFilter, SuccessResponseInterceptor } from './common/middlewares';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerOptions } from './swagger/swagger.api';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
  app.use(express.json({ limit: '10mb' }));

  const adapterHost = app.get(HttpAdapterHost);
  const httpAdapter = adapterHost.httpAdapter;

  app.useGlobalInterceptors(new SuccessResponseInterceptor());
  app.useGlobalFilters(new ErrorFilter(httpAdapter));

  // ✅ Utilisation de ConfigService au lieu de AppConfigService
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');
  const frontUrl = configService.get<string>('FRONT_URL') || '*';

  app.enableCors({
    origin: frontUrl,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Server is running on port ${port}`);
  });
}
bootstrap();
