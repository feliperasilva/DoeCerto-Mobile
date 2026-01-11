import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  Param, 
  UseInterceptors, 
  UploadedFile, 
  ParseIntPipe, 
  ForbiddenException, 
  Req,
  UseGuards
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { OngProfilesService } from './ong-profiles.service';
import { CreateOngProfileDto } from './dto/create-profile.dto';

@Controller('ong-profiles')
export class OngProfilesController {
  constructor(private readonly ongProfilesService: OngProfilesService) {}

  /**
   * * @param req - Objeto de requisição contendo o usuário logado (userId e role).
   * @param dto
   * @param file
   */
  
  @Post(':userId') 
  @UseInterceptors(FileInterceptor('file', {

    storage: diskStorage({
      destination: './uploads/profiles', // Pasta de destino
      filename: (req, file, callback) => {

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = extname(file.originalname);
        const filename = `ong-${uniqueSuffix}${ext}`;
        callback(null, filename);
      },
    }),
    
    // 2. Filtro de Arquivos
    fileFilter: (req, file, callback) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        return callback(new Error('Apenas arquivos de imagem são permitidos!'), false);
      }
      callback(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 } // Limite de 5MB
  }))
  async createOrUpdate(

    @Param('userId', ParseIntPipe) userId: number,
    @Body() dto: CreateOngProfileDto,
    
    @UploadedFile() file?: Express.File, 
  ) {

    const avatarPath = file ? `/uploads/profiles/${file.filename}` : undefined;
    
    return this.ongProfilesService.createOrUpdate(userId, dto, avatarPath);
  }

  @Get(':userId')
  async findOne(@Param('userId', ParseIntPipe) userId: number) {
    return this.ongProfilesService.findOne(userId);
  }
}