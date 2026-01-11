import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { excludePassword } from 'src/common/utils/exclude-password.util';
import { CreateAdminDto } from './dto/create-admin.dto';

@Injectable()
export class AdminsService {
  constructor(private readonly prisma: PrismaService) {}

  // Criar admin
  async createAdmin(data: CreateAdminDto) {
    const { name, email, password } = data;
    
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    
    if (existingUser) throw new BadRequestException('Email already in use');
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await this.prisma.user.create({
      data: { name, email, password: hashedPassword, role: 'admin' },
    });
    
    const admin = await this.prisma.admin.create({
      data: {
        userId: user.id,
      },
    });
    
    return excludePassword(admin);
  }

  // Deletar admin
  async deleteAdmin(adminId: number) {
    const admin = await this.prisma.admin.findUnique({ 
      where: { userId: adminId },
      include: { user: true }
    });
    
    if (!admin) throw new NotFoundException('Admin not found');
    
    // Deleta o User (cascade deletará o Admin automaticamente)
    const deletedUser = await this.prisma.user.delete({
      where: { id: adminId },
    });
    
    return excludePassword(deletedUser);
  }

  // Aprovar ONG
  async approveOng(ongId: number, adminId: number, reason?: string) {
    // Validar se admin existe
    const admin = await this.prisma.admin.findUnique({
      where: { userId: adminId },
    });
    
    if (!admin) throw new BadRequestException('Invalid admin');

    const ong = await this.prisma.ong.findUnique({
      where: { userId: ongId },
      include: { user: true },
    });
    
    if (!ong) throw new NotFoundException('ONG not found');

    const updatedOng = await this.prisma.ong.update({
      where: { userId: ongId },
      data: {
        verificationStatus: 'verified',
        verifiedAt: new Date(),
        verifiedById: adminId,
        rejectionReason: null, // Limpa motivo de rejeição anterior
      },
      include: { 
        user: true,
        verifiedBy: {
          include: { user: true }
        }
      },
    });
    
    return updatedOng;
  }

  // Reprovar ONG
  async rejectOng(ongId: number, adminId: number, reason?: string) {
    // Validar se admin existe
    const admin = await this.prisma.admin.findUnique({
      where: { userId: adminId },
    });
    
    if (!admin) throw new BadRequestException('Invalid admin');

    const ong = await this.prisma.ong.findUnique({
      where: { userId: ongId },
      include: { user: true },
    });
    
    if (!ong) throw new NotFoundException('ONG not found');

    const updatedOng = await this.prisma.ong.update({
      where: { userId: ongId },
      data: {
        verificationStatus: 'rejected',
        verifiedAt: new Date(),
        verifiedById: adminId,
        rejectionReason: reason,
      },
      include: { 
        user: true,
        verifiedBy: {
          include: { user: true }
        }
      },
    });
    
    return updatedOng;
  }

  // ONGs pendentes
  async pendentOngs() {
    const ongs = await this.prisma.ong.findMany({
      where: { verificationStatus: 'pending' },
      include: { 
        user: true,
        verifiedBy: {
          include: { user: true }
        }
      },
      orderBy: { user: { createdAt: 'desc' } }, // Mais recentes primeiro
    });
    
    return ongs;
  }

  // ONGs verificadas/aprovadas
  async verifiedOngs() {
    const ongs = await this.prisma.ong.findMany({
      where: { verificationStatus: 'verified' },
      include: { 
        user: true,
        verifiedBy: {
          include: { user: true }
        }
      },
      orderBy: { verifiedAt: 'desc' }, // Mais recentemente verificadas primeiro
    });
    
    return ongs;
  }

  // ONGs rejeitadas
  async rejectedOngs() {
    const ongs = await this.prisma.ong.findMany({
      where: { verificationStatus: 'rejected' },
      include: { 
        user: true,
        verifiedBy: {
          include: { user: true }
        }
      },
      orderBy: { verifiedAt: 'desc' }, // Mais recentemente rejeitadas primeiro
    });
    
    return ongs;
  }

  // Estatísticas de um admin (BONUS)
  async getAdminStats(adminId: number) {
    const admin = await this.prisma.admin.findUnique({
      where: { userId: adminId },
      include: {
        verificationsPerformed: {
          select: {
            verificationStatus: true,
          }
        },
        user: true,
      }
    });

    if (!admin) throw new NotFoundException('Admin not found');

    const approved = admin.verificationsPerformed.filter(
      o => o.verificationStatus === 'verified'
    ).length;

    const rejected = admin.verificationsPerformed.filter(
      o => o.verificationStatus === 'rejected'
    ).length;

    return {
      adminId: admin.userId,
      adminName: admin.user.name,
      totalVerifications: approved + rejected,
      approved,
      rejected,
    };
  }
}