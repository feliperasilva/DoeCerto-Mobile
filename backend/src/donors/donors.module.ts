import { Module } from '@nestjs/common';
import { DonorsService } from './donors.service';
import { DonorsController } from './donors.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DonorsController],
  providers: [DonorsService],
})
export class DonorsModule {}
