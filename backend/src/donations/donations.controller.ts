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
  Query,
  HttpCode,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import { DonationsService } from './donations.service';
import { CreateDonationDto, DonationType } from './dto/create-donation.dto';
import { UpdateDonationDto } from './dto/update-donation.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { User } from 'generated/prisma';

@Controller('donations')
@UseGuards(JwtAuthGuard)
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  // Only donors can create donations
  @UseGuards(RolesGuard)
  @Roles('donor')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createDonationDto: CreateDonationDto,
    @CurrentUser() user: User,
  ) {
    return this.donationsService.create(createDonationDto, user.id);
  }

  // Authenticated users can see all donations
  @Get()
  findAll() {
    return this.donationsService.findAll();
  }

  // Donor gets their sent donations (doações enviadas)
  @UseGuards(RolesGuard)
  @Roles('donor')
  @Get('sent')
  getSentDonations(
    @CurrentUser() user: User,
    @Query('type') type?: DonationType,
  ) {
    return this.donationsService.findByDonor(user.id, type);
  }

  // ONG gets their received donations (doações recebidas)
  @UseGuards(RolesGuard)
  @Roles('ong')
  @Get('received')
  getReceivedDonations(
    @CurrentUser() user: User,
    @Query('type') type?: DonationType,
  ) {
    return this.donationsService.findByOng(user.id, type);
  }

  // Get donations by donor (admin can see any, donors can see their own)
  @Get('donor/:donorId')
  findByDonor(
    @Param('donorId', ParseIntPipe) donorId: number,
    @Query('type') type?: DonationType,
    @CurrentUser() user?: User,
  ) {
    // Users can only see their own donations unless they're admin
    if (user && user.role !== 'admin' && user.id !== donorId) {
      throw new ForbiddenException('You can only view your own donations');
    }
    return this.donationsService.findByDonor(donorId, type);
  }

  // Get donations by ONG (ONGs can see their own)
  @Get('ong/:ongId')
  findByOng(
    @Param('ongId', ParseIntPipe) ongId: number,
    @Query('type') type?: DonationType,
    @CurrentUser() user?: User,
  ) {
    // ONGs can only see their own donations unless they're admin
    if (user && user.role !== 'admin' && user.id !== ongId) {
      throw new ForbiddenException('You can only view your own donations');
    }
    return this.donationsService.findByOng(ongId, type);
  }

  // Authenticated users can view specific donation
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.donationsService.findOne(id);
  }

  // Donors and ONGs can update their donations (validated in service)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDonationDto: UpdateDonationDto,
    @CurrentUser() user: User,
  ) {
    return this.donationsService.update(id, updateDonationDto, user.id);
  }

  // Donors can cancel their donations (validated in service)
  @UseGuards(RolesGuard)
  @Roles('donor')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User) {
    return this.donationsService.remove(id, user.id);
  }
}
