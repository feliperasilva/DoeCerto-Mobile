import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { OngService } from './ong.service';
import type { OngDto } from './dto/ong.dto';

@Controller('ong')
export class OngController {
  constructor(private readonly ongService: OngService) {}

  @Post()
  async create(@Body() data: OngDto) {
    return this.ongService.create(data);
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.ongService.getById(id);
  }

  @Get()
  async findAll() {
    return this.ongService.findAll();
  }

  @Put(':id')
  async updateById(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: OngDto,
  ) {
    return this.ongService.update(id, data);
  }

  @Delete(':id')
  async deleteById(@Param('id', ParseIntPipe) id: number) {
    return this.ongService.delete(id);
  }
}
