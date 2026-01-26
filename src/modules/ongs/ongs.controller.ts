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
  Query,
  DefaultValuePipe,
} from '@nestjs/common';
import { OngsService } from './ongs.service';
import { CreateOngDto } from './dto/create-ong.dto';
import { UpdateOngDto } from './dto/update-ong.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import type { User } from 'generated/prisma';

@Controller('ongs')
export class OngsController {
  constructor(private readonly ongsService: OngsService) {}

  // Public - Only used via auth/register/ong
  @Post()
  create(@Body() createOngDto: CreateOngDto) {
    return this.ongsService.create(createOngDto);
  }

  // Public - List all ONGs (for donors to browse)
  @Get()
  findAll(
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip = 0,
    @Query('take', new DefaultValuePipe(20), ParseIntPipe) take = 20,
  ) {
    return this.ongsService.findAll(skip, take);
  }

  // Public - View ONG profile (for donors to see details)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ongsService.findOne(id);
  }

  // ONG can only update their own profile
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ong')
  @Patch('me')
  update(
    @Body() updateOngDto: UpdateOngDto,
    @CurrentUser() user: User,
  ) {
    return this.ongsService.update(user.id, updateOngDto);
  }

  // Admin only - Delete ONG
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ongsService.remove(id);
  }
}
