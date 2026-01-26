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
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DonorProfilesService } from './donor-profiles.service';
import { UpdateDonorProfileDto } from './dto/update-donor-profile.dto';
import { ImageProcessingService } from '../../common/services/image-processing.service';
import { multerAvatarConfig } from '../../config/multer-avatar.config';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { User } from 'generated/prisma';

@Controller('donors')
export class DonorProfilesController {
  constructor(
    private readonly donorProfilesService: DonorProfilesService,
    private readonly imageProcessingService: ImageProcessingService,
  ) {}

  @Post('me/profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('donor')
  @UseInterceptors(FileInterceptor('file', multerAvatarConfig))
  async createOrUpdate(
    @Body() dto: UpdateDonorProfileDto,
    @CurrentUser() user: User,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let avatarPath: string | undefined;

    if (file) {
      try {
        avatarPath = await this.imageProcessingService.processAvatarImage(
          file.path,
          512,
        );
      } catch (error) {
        throw new BadRequestException('Falha ao processar imagem do avatar');
      }
    }

    return this.donorProfilesService.createOrUpdate(user.id, dto, avatarPath);
  }

  @Get('me/profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('donor')
  async getCurrentDonorProfile(@CurrentUser() user: User) {
    return this.donorProfilesService.findOne(user.id);
  }

  @Get(':donorId/profile')
  async findOne(@Param('donorId', ParseIntPipe) donorId: number) {
    return this.donorProfilesService.findOne(donorId);
  }
}
