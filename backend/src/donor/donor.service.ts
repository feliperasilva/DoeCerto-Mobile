import { Injectable } from '@nestjs/common';
import { DonorDto } from './dto/donor.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class DonorService {
    constructor(private prisma: PrismaService) {}

    create(data: DonorDto) {

    }
}
