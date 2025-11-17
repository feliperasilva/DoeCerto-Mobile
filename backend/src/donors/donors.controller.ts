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
  ForbiddenException,
} from '@nestjs/common';
import { DonorsService } from './donors.service';
import { CreateDonorDto } from './dto/create-donor.dto';
import { UpdateDonorDto } from './dto/update-donor.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { User } from 'generated/prisma';

@Controller('donors')
export class DonorsController {
  constructor(private readonly donorsService: DonorsService) {}

  // Public - Only used via auth/register/donor
  @Post()
  create(@Body() createDonorDto: CreateDonorDto) {
    return this.donorsService.create(createDonorDto);
  }

  // Admin only - List all donors
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  findAll() {
    return this.donorsService.findAll();
  }

  // Authenticated - Can view any donor profile (public info)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.donorsService.findOne(id);
  }

  // Donor can only update their own profile
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('donor')
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDonorDto: UpdateDonorDto,
    @CurrentUser() user: User,
  ) {
    // Verify user is updating their own profile
    if (user.id !== id) {
      throw new ForbiddenException('You can only update your own profile');
    }
    return this.donorsService.update(id, updateDonorDto);
  }

  // Admin only - Delete donor
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.donorsService.remove(id);
  }
}
