import { Module } from '@nestjs/common';
import { OngService } from './ong.service';
import { OngController } from './ong.controller';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  providers: [OngService, PrismaService],
  controllers: [OngController],
})
export class OngModule {}
