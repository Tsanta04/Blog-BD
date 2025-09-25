import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { AppConfigService } from './common/modules/config/config.service';
import * as express from 'express';
import { ErrorFilter, SuccessResponseInterceptor } from './common/middlewares';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerOptions } from './swagger/swagger.api';
async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const appConfig = app.get(AppConfigService);
  app.setGlobalPrefix('api');
  app.use(express.json({ limit: '10mb' }));
  const adapterHost = app.get(HttpAdapterHost);
  const httpAdapter = adapterHost.httpAdapter;

  app.useGlobalInterceptors(new SuccessResponseInterceptor());
  app.useGlobalFilters(new ErrorFilter(httpAdapter));

  app.enableCors({
    origin: appConfig.frontUrl,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('api-docs', app, document);
  await app.listen(appConfig.port, '0.0.0.0', () => {
    console.log('server is running on port', appConfig.port);
  });
}
bootstrap();
