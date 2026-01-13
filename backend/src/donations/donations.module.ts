import { Module } from '@nestjs/common';
import { DonationsService } from './donations.service';
import { DonationsController } from './donations.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ImageProcessingService } from 'src/common/services/image-processing.service'; // ✅ Importar

@Module({
  imports: [PrismaModule],
  controllers: [DonationsController],
  providers: [
    DonationsService,
    ImageProcessingService, // ✅ Registrar aqui
  ],
  exports: [DonationsService],
})
export class DonationsModule {}
