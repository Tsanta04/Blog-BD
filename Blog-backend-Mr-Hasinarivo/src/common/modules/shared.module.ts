import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { PrismaModule } from './prisma/prisma.module';
import { SiretVerificationService } from '../services/siret-verification.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule, AppConfigModule, PrismaModule],
  providers: [SiretVerificationService],
  exports: [SiretVerificationService],
})
export class SharedModule {}
