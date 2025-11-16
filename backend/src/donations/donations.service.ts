import { Injectable } from '@nestjs/common';
import { CreateDonationDto, DonationType } from './dto/create-donation.dto';
import { UpdateDonationDto } from './dto/update-donation.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'generated/prisma';

@Injectable()
export class DonationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDonationDto: CreateDonationDto, donorId: number) {
    const { ongId, materialDescription, materialQuantity, donationType, monetaryAmount, monetaryCurrency } = createDonationDto;
    
    const newDonation = await this.prisma.donation.create({
      data: {
        donorId,
        ongId,
        donationType,
        monetaryAmount,
        monetaryCurrency,
        materialDescription,
        materialQuantity,
      },
      include: { 
        ong: true, 
        donor: true, 
      }
    });

    return newDonation;
  }

  async findAll() {
    const donations = await this.prisma.donation.findMany({
      include: { 
        ong: true, 
        donor: true, 
      }
    });
    return donations;
  }

  async findOne(id: number) {
    const donations = await this.prisma.donation.findUnique({
      where: { id },
      include: { 
        ong: true, 
        donor: true, 
      }
    });
    return donations;
  }

  async findByDonor(donorId: number, type?: DonationType) {
    const where: Prisma.DonationWhereInput = { donorId: donorId };
    
    if (type) {
      where.donationType = type;
    }

    const donations = await this.prisma.donation.findMany({
      where: where,
      include: { 
        ong: true, 
        donor: true, 
      }
    });
    return donations;
  }

  async findByOng(ongId: number, type?: DonationType) {
    const where: Prisma.DonationWhereInput = { ongId: ongId };
    
    if (type) {
      where.donationType = type;
    }

    const donations = await this.prisma.donation.findMany({
      where: where,
      include: { 
        ong: true, 
        donor: true, 
      }
    });
    return donations;
  }

  update(id: number, updateDonationDto: UpdateDonationDto) {
    return `This action updates a #${id} donation`;
  }

  remove(id: number) {
    return `This action removes a #${id} donation`;
  }
}
