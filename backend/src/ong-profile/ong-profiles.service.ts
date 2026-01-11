import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOngProfileDto } from './dto/create-profile.dto';

@Injectable()
export class OngProfilesService {
  constructor(private prisma: PrismaService) {}

  async createOrUpdate(userId: number, dto: CreateOngProfileDto, avatarPath?: string) {

    const ongExists = await this.prisma.ong.findUnique({
      where: { userId },
    });

    if (!ongExists) {
      throw new NotFoundException(`ONG com userId ${userId} não encontrada.`);
    }

    const dataToUpdate = {
      ...dto,
      ...(avatarPath ? { avatarUrl: avatarPath } : {}),
    };

    return this.prisma.ongProfile.upsert({
      where: { ongId: userId },
      create: {
        ongId: userId,
        ...dto,
        avatarUrl: avatarPath || null,
      },
      update: dataToUpdate,
    });
  }

  async findOne(userId: number) {
    const profile = await this.prisma.ongProfile.findUnique({
      where: { ongId: userId },
      include: { ong: true }
    });
    
    if (!profile) throw new NotFoundException('Perfil não encontrado');
    return profile;
  }
}