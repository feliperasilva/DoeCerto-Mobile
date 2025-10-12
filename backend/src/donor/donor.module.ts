import { Module } from '@nestjs/common';
import { DonorService } from './donor.service';
import { DonorController } from './donor.controller';
import { PrismaService } from 'src/database/prisma.service';

@Module({
    providers: [DonorService, PrismaService],
    controllers: [DonorController]
})
export class DonorModule {}
