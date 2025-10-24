import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DonorsService } from './donors.service';
import { CreateDonorDto } from './dto/create-donor.dto';
import { UpdateDonorDto } from './dto/update-donor.dto';

@Controller('donors')
export class DonorsController {
  constructor(private readonly donorsService: DonorsService) {}

  @Post()
  create(@Body() createDonorDto: CreateDonorDto) {
    return this.donorsService.create(createDonorDto);
  }

  @Get()
  findAll() {
    return this.donorsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.donorsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDonorDto: UpdateDonorDto) {
    return this.donorsService.update(+id, updateDonorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.donorsService.remove(+id);
  }
}
