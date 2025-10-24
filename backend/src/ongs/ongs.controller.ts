import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OngsService } from './ongs.service';
import { CreateOngDto } from './dto/create-ong.dto';
import { UpdateOngDto } from './dto/update-ong.dto';

@Controller('ongs')
export class OngsController {
  constructor(private readonly ongsService: OngsService) {}

  @Post()
  create(@Body() createOngDto: CreateOngDto) {
    return this.ongsService.create(createOngDto);
  }

  @Get()
  findAll() {
    return this.ongsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ongsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOngDto: UpdateOngDto) {
    return this.ongsService.update(+id, updateOngDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ongsService.remove(+id);
  }
}
