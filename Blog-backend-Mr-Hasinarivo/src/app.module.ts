// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

import { CoreModule } from './modules/core.module';
import { RedisModule } from './common/modules/redis.module';
import { MongoModule } from './common/modules/mongo.module';

@Module({
  imports: [
    // Chargement du .env globalement
    ConfigModule.forRoot({ isGlobal: true }),

    // Limitation du nombre de requêtes (rate limiting)
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),

    // Modules principaux
    MongoModule,
    RedisModule,   
    CoreModule,   
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard, 
    },
  ],
})
export class AppModule {}
