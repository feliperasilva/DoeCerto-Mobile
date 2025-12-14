import { Controller, Post, Body, Get, Param, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { WhishlistItemService } from './whishlist-item.service';
import { CreateWhishlistDto } from './dto/create-whishlist.dto';

@Controller('wishlist-items')
export class WishlistItemController {
  constructor(private readonly service: WhishlistItemService) {}

  @Post()
  create(@Body() dto: CreateWhishlistDto) {
    return this.service.create(dto);
  }

  @Get('ong/:ongId')
  findByOng(@Param('ongId', ParseIntPipe) ongId: number) {
    return this.service.findAllByOng(ongId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CreateWhishlistDto>) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
