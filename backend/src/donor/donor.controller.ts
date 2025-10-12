import { Body, Controller, Post } from '@nestjs/common';
import type { DonorDto } from './dto/donor.dto';
import { DonorService } from './donor.service';

@Controller('donor')
export class DonorController {

    constructor (private readonly donorService: DonorService) {}
    @Post()

    async create(@Body() data: DonorDto) {
        return this.donorService.create(data);
    }
}
