import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { WhishlistItemService } from './whishlist-item.service';
import { CreateWhishlistDto } from './dto/create-whishlist.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { User } from 'generated/prisma';

@Controller('ongs/:ongId/wishlist-items')
export class WishlistItemController {
  constructor(private readonly service: WhishlistItemService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ong')
  create(
    @Param('ongId', ParseIntPipe) ongId: number,
    @Body() dto: CreateWhishlistDto,
    @CurrentUser() user: User,
  ) {
    if (ongId !== user.id) {
      throw new ForbiddenException('You can only create items for your own ONG');
    }
    const { description, quantity } = dto;
    return this.service.create({ ongId: user.id, description, quantity });
  }

  @Get()
  findByOng(@Param('ongId', ParseIntPipe) ongId: number) {
    return this.service.findAllByOng(ongId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ong')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CreateWhishlistDto>,
    @CurrentUser() user: User,
  ) {
    const item = await this.service.findOne(id);
    if (item.ongId !== user.id) {
      throw new ForbiddenException('You can only update your own wishlist items');
    }
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ong')
  async remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User) {
    const item = await this.service.findOne(id);
    if (item.ongId !== user.id) {
      throw new ForbiddenException('You can only remove your own wishlist items');
    }
    return this.service.remove(id);
  }
}
