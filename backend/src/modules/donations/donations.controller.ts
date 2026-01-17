import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Query,
  ForbiddenException,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  DefaultValuePipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { User, DonationType } from 'generated/prisma';
import { DonationsService } from './donations.service';
import { CreateDonationDto } from './dto/create-donation.dto';
import { UpdateDonationDto } from './dto/update-donation.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { multerPaymentProofConfig } from 'src/config/multer-payment-proof.config';
import { ImageProcessingService } from 'src/common/services/image-processing.service';

@Controller('donations')
@UseGuards(JwtAuthGuard, RolesGuard) // Mantém guard para rotas que exigem autenticação
export class DonationsController {
  constructor(
    private readonly donationsService: DonationsService,
    private readonly imageProcessingService: ImageProcessingService,
  ) {}

  // ✅ DOADOR: Criar doação
  @Roles('donor') // Só o decorator @Roles
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('proofFile', multerPaymentProofConfig))
  async create(
    @Body() createDonationDto: CreateDonationDto,
    @CurrentUser() user: User,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let proofPath: string | undefined;

    if (file) {
      try {
        proofPath = await this.imageProcessingService.processPaymentProof(
          file.path,
        );
      } catch (error) {
        throw new BadRequestException('Falha ao processar comprovante de pagamento');
      }
    }

    return this.donationsService.create(createDonationDto, user.id, proofPath);
  }

  // ✅ PÚBLICO: Listar todas as doações (sem role)
  @Get()
  findAll(
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip = 0,
    @Query('take', new DefaultValuePipe(20), ParseIntPipe) take = 20,
  ) {
    return this.donationsService.findAll(skip, take);
  }

  // ✅ DOADOR: Visualizar minhas doações enviadas
  @Roles('donor')
  @Get('me/sent')
  getSentDonations(
    @CurrentUser() user: User,
    @Query('type') type?: DonationType,
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip = 0,
    @Query('take', new DefaultValuePipe(20), ParseIntPipe) take = 20,
  ) {
    return this.donationsService.findByDonor(user.id, type, skip, take);
  }

  // ✅ ONG: Visualizar doações recebidas
  @Roles('ong')
  @Get('me/received')
  async getReceivedDonations(
    @CurrentUser() user: User,
    @Query('type') type?: DonationType,
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip = 0,
    @Query('take', new DefaultValuePipe(20), ParseIntPipe) take = 20,
  ) {
    return this.donationsService.findByOng(user.id, type, skip, take);
  }

  // ✅ PÚBLICO: Visualizar doações de um doador (sem role)
  @Get('/donors/:donorId')
  findByDonor(
    @Param('donorId', ParseIntPipe) donorId: number,
    @Query('type') type?: DonationType,
    @CurrentUser() user?: User,
  ) {
    if (user && user.role !== 'admin' && user.id !== donorId) {
      throw new ForbiddenException('You can only view your own donations');
    }
    return this.donationsService.findByDonor(donorId, type);
  }

  // ✅ PÚBLICO: Visualizar doações de uma ONG (sem role)
  @Get('/ongs/:ongId')
  findByOng(
    @Param('ongId', ParseIntPipe) ongId: number,
    @Query('type') type?: DonationType,
    @CurrentUser() user?: User,
  ) {
    if (user && user.role !== 'admin' && user.id !== ongId) {
      throw new ForbiddenException('You can only view your own donations');
    }
    return this.donationsService.findByOng(ongId, type);
  }

  // ✅ PÚBLICO: Visualizar uma doação específica (sem role)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.donationsService.findOne(id);
  }

  // ✅ DOADOR/ONG: Atualizar doação
  @Roles('donor', 'ong')
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDonationDto: UpdateDonationDto,
    @CurrentUser() user: User,
  ) {
    return this.donationsService.update(id, updateDonationDto, user.id);
  }

  // ✅ ONG: ACEITAR doação
  @Roles('ong')
  @Patch(':id/accept')
  @HttpCode(HttpStatus.OK)
  async acceptDonation(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return this.donationsService.update(
      id,
      { donationStatus: 'completed' },
      user.id,
    );
  }

  // ✅ ONG: REJEITAR doação
  @Roles('ong')
  @Patch(':id/reject')
  @HttpCode(HttpStatus.OK)
  async rejectDonation(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return this.donationsService.update(
      id,
      { donationStatus: 'canceled' },
      user.id,
    );
  }

  // ✅ DOADOR: Cancelar doação
  @Roles('donor')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User) {
    return this.donationsService.remove(id, user.id);
  }
}
