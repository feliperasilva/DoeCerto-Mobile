import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { User } from 'generated/prisma';

@Controller('admins')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin') // Todas as rotas são protegidas e só admins podem acessar
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  // Criar novo admin (só admin pode criar outros admins)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminsService.createAdmin(createAdminDto);
  }

  // Deletar admin
  @Delete(':adminId')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('adminId', ParseIntPipe) adminId: number) {
    return this.adminsService.deleteAdmin(adminId);
  }

  // Listar ONGs pendentes de verificação
  @Get('ongs/pending')
  getPendingOngs() {
    return this.adminsService.pendentOngs();
  }

  // Listar ONGs verificadas/aprovadas
  @Get('ongs/verified')
  getVerifiedOngs() {
    return this.adminsService.verifiedOngs();
  }

  // Listar ONGs rejeitadas
  @Get('ongs/rejected')
  getRejectedOngs() {
    return this.adminsService.rejectedOngs();
  }

  // Aprovar ONG
  @Patch('ongs/:ongId/approve')
  @HttpCode(HttpStatus.OK)
  approveOng(
    @Param('ongId', ParseIntPipe) ongId: number,
    @CurrentUser() user: User,
  ) {
    return this.adminsService.approveOng(ongId, user.id);
  }

  // Reprovar ONG
  @Patch('ongs/:ongId/reject')
  @HttpCode(HttpStatus.OK)
  rejectOng(
    @Param('ongId', ParseIntPipe) ongId: number,
    @Body('reason') reason: string,
    @CurrentUser() user: User,
  ) {
    return this.adminsService.rejectOng(ongId, user.id, reason);
  }

  // Ver estatísticas do próprio admin
  @Get('stats/me')
  getMyStats(@CurrentUser() user: User) {
    return this.adminsService.getAdminStats(user.id);
  }

  // Ver estatísticas de outro admin (admin pode ver de qualquer admin)
  @Get('stats/:adminId')
  getAdminStats(@Param('adminId', ParseIntPipe) adminId: number) {
    return this.adminsService.getAdminStats(adminId);
  }
}