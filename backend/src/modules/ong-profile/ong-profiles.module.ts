import { Module } from '@nestjs/common';
import { OngProfilesService } from './ong-profiles.service';
import { OngProfilesController } from './ong-profiles.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { ImageProcessingService } from '../../common/services/image-processing.service'; // ✅ Importar

@Module({
  imports: [PrismaModule],
  controllers: [OngProfilesController],
  providers: [
    OngProfilesService,
    ImageProcessingService, // ✅ Registrar aqui
  ],
})
export class OngProfilesModule {}