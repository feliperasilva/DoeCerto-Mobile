import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import type { DonorDto } from './dto/donor.dto';
import { DonorService } from './donor.service';

@Controller('donor')
export class DonorController {

    constructor (private readonly donorService: DonorService) {}
    @Post()
    async create(@Body() data: DonorDto) {
        return this.donorService.create(data);
    }

    @Get()
    async findAll() {
        return this.donorService.findAll();
    }

    @Put(":id")
    async update(@Param("id") id: number, @Body() data: DonorDto) {
        return this.donorService.update(Number(id), data);
    }

    @Delete(":id")
    async delete(@Param("id") id: number) {
        return this.donorService.delete(Number(id));
    }
}
