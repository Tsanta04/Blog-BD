import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

import { CoreModule } from './modules/core.module';
import { SharedModule } from './common/modules/shared.module';

import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis-yet';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async () => ({
        store: redisStore, // utilise Redis comme store
        host: 'localhost',
        port: 6379,
        ttl: 60, // durée de vie en secondes
      }),
    }),    
    MongooseModule.forRoot('mongodb://localhost:27017/mon_db'),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    CoreModule,
    SharedModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    AppService,
  ],
})
export class AppModule {}
