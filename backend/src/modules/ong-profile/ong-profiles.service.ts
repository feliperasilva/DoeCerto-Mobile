import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOngProfileDto } from './dto/create-profile.dto';

@Injectable()
export class OngProfilesService {
  // Centralizamos o select para garantir consistência em todos os métodos de busca
  private readonly profileSelect = {
    id: true,
    ongId: true,
    bio: true,
    avatarUrl: true,
    contactNumber: true,
    websiteUrl: true,
    address: true,
    ong: {
      select: {
        userId: true,
        cnpj: true,
        // Campos de rating adicionados para aparecerem no perfil
        averageRating: true,
        numberOfRatings: true,
        user: {
          select: { 
            id: true, 
            name: true, 
            email: true 
          }
        }
      }
    }
  } as const;

  constructor(private prisma: PrismaService) {}

  async createOrUpdate(userId: number, dto: CreateOngProfileDto, avatarPath?: string) {
    // 1. Validamos se a ONG (entidade principal) existe antes de criar um perfil
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

    // 2. Usamos upsert para criar se não existir ou atualizar se já existir
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
      select: this.profileSelect
    });
    
    if (!profile) {
      throw new NotFoundException('Perfil da ONG não encontrado');
    }

    return profile;
  }
}