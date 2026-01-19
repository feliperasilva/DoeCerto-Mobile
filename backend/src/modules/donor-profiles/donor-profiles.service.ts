import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateDonorProfileDto } from './dto/update-donor-profile.dto';

@Injectable()
export class DonorProfilesService {
  private readonly profileSelect = {
    id: true,
    donorId: true,
    bio: true,
    avatarUrl: true,
    contactNumber: true,
    address: true,
    createdAt: true,
    updatedAt: true,
    donor: {
      select: {
        userId: true,
        cpf: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    },
  } as const;

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria ou atualiza o perfil do doador (Upsert).
   * @param userId ID do usuário extraído do JWT (segurança contra IDOR)
   * @param dto Dados de atualização vindos do Body
   * @param avatarPath Caminho da imagem já processada pelo ImageProcessingService
   */
  async createOrUpdate(userId: number, dto: UpdateDonorProfileDto, avatarPath?: string) {
    // 1. Validar se o doador (entidade principal) existe
    const donorExists = await this.prisma.donor.findUnique({
      where: { userId },
    });

    if (!donorExists) {
      throw new NotFoundException(`Donor com userId ${userId} não encontrado.`);
    }

    // 2. Preparar objeto de dados para atualização (Update)
    const updateData = {
      ...dto,
      // Só sobrescreve a URL do avatar se uma nova imagem foi enviada
      ...(avatarPath && { avatarUrl: avatarPath }),
    };

    // 3. Preparar objeto de dados para criação (Create)
    const createData = {
      donorId: userId,
      ...dto,
      avatarUrl: avatarPath || null,
    };

    try {
      // 4. Executa a operação de Upsert (Update or Insert)
      return await this.prisma.donorProfile.upsert({
        where: { donorId: userId },
        create: createData,
        update: updateData,
        select: this.profileSelect,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao processar a atualização do perfil. Verifique se os dados estão corretos.',
      );
    }
  }

  /**
   * Busca os detalhes completos de um perfil
   * @param userId ID do doador/usuário
   */
  async findOne(userId: number) {
    const profile = await this.prisma.donorProfile.findUnique({
      where: { donorId: userId },
      select: this.profileSelect,
    });

    if (!profile) {
      throw new NotFoundException('Perfil do doador não encontrado.');
    }

    return profile;
  }
}
