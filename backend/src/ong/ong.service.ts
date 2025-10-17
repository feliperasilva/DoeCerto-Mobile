import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { OngDto } from './dto/ong.dto';

@Injectable()
export class OngService {
  constructor(private prisma: PrismaService) {}

  async create(data: OngDto) {
    const ong = await this.prisma.ong.create({
      data,
    });

    return ong;
  }

  async getById(id: number) {
    const ongExists = await this.prisma.ong.findUnique({
      where: {
        id,
      },
    });
    if (!ongExists) {
      throw new Error('ONG não encontrada');
    }
    return ongExists;
  }

  async findAll() {
    return await this.prisma.ong.findMany();
  }

  async update(id: number, data: OngDto) {
    const ongExists = await this.prisma.ong.findUnique({
      where: {
        id,
      },
    });

    if (!ongExists) {
      throw new Error('ONG não encontrada');
    }

    return await this.prisma.ong.update({
      data,
      where: {
        id,
      },
    });
  }

  async delete(id: number) {
    const ongExists = await this.prisma.ong.findUnique({
      where: {
        id,
      },
    });

    if (!ongExists) {
      throw new Error('ONG não encontrada');
    }

    return await this.prisma.ong.delete({
      where: {
        id,
      },
    });
  }
}
