import { Injectable } from '@nestjs/common';
import { DonorDto } from './dto/donor.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class DonorService {
    constructor(private prisma: PrismaService) {}

    async create(data: DonorDto) {
        const donor = await this.prisma.donor.create({
            data
        });

        return donor;
    }

    async findAll() {
        return await this.prisma.donor.findMany
    }
}
