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
        return await this.prisma.donor.findMany();
    }

    async update(id: number, data: DonorDto) {
        const donorExists = await this.prisma.donor.findUnique({
            where: {
                id,
            }
        });

        if (!donorExists) {
            throw new Error('Doador não encontrado')
        }

        return await this.prisma.donor.update({
            data,
            where: {
                id,
            }
        });
    }

    async delete(id: number) {
        const donorExists = await this.prisma.donor.findUnique({
            where: {
                id,
            }
        });

        if (!donorExists) {
            throw new Error('Doador não encontrado')
        }

        return await this.prisma.donor.delete({
            where: {
                id,
            }
        });
    }
}
