import { Module } from '@nestjs/common';
import { DonorProfilesService } from './donor-profiles.service';
import { DonorProfilesController } from './donor-profiles.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { ImageProcessingService } from '../../common/services/image-processing.service';

@Module({
  imports: [PrismaModule],
  controllers: [DonorProfilesController],
  providers: [DonorProfilesService, ImageProcessingService],
  exports: [DonorProfilesService],
})
export class DonorProfileModule {}
