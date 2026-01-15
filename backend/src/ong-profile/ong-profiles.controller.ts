import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  Param, 
  UseInterceptors, 
  UploadedFile, 
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { OngProfilesService } from './ong-profiles.service';
import { CreateOngProfileDto } from './dto/create-profile.dto';
import { ImageProcessingService } from '../common/services/image-processing.service';
import { multerAvatarConfig } from '../config/multer-avatar.config';

@Controller('ongs/:ongId/profile')
export class OngProfilesController {
  constructor(
    private readonly ongProfilesService: OngProfilesService,
    private readonly imageProcessingService: ImageProcessingService, // ✅ Injetar
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', multerAvatarConfig)) // ✅ Usar config centralizada
  async createOrUpdate(
    @Param('ongId', ParseIntPipe) ongId: number,
    @Body() dto: CreateOngProfileDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let avatarPath: string | undefined;

    if (file) {
      try {
        // ✅ Processar imagem: corta para 1:1, redimensiona para 512x512 e comprime
        avatarPath = await this.imageProcessingService.processAvatarImage(
          file.path,
          512,
        );
      } catch (error) {
        throw new BadRequestException('Falha ao processar imagem do avatar');
      }
    }
    
    return this.ongProfilesService.createOrUpdate(ongId, dto, avatarPath);
  }

  @Get()
  async findOne(@Param('ongId', ParseIntPipe) ongId: number) {
    return this.ongProfilesService.findOne(ongId);
  }
}