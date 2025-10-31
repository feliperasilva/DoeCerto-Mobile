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

    return excludePassword(admin); // UserResponseDto seguro
  }

  // Deletar admin
  async deleteAdmin(adminId: number) {
    const admin = await this.prisma.user.findUnique({ where: { id: adminId } });
    if (!admin || admin.role !== 'admin')
      throw new NotFoundException('Admin not found');

    const deletedAdmin = await this.prisma.user.delete({
      where: { id: adminId },
    });
    return excludePassword(deletedAdmin);
  }

  // Aprovar ONG
  async approveOng(ongId: number) {
    const ong = await this.prisma.ong.findUnique({
      where: { id: ongId },
      include: { user: true }, // necessário para mapear nome/email
    });
    if (!ong) throw new NotFoundException('ONG not found');

    const updatedOng = await this.prisma.ong.update({
      where: { id: ongId },
      data: { isVerified: true },
      include: { user: true },
    });

    return updatedOng;
  }

  // Reprovar ONG
  async rejectOng(ongId: number) {
    const ong = await this.prisma.ong.findUnique({
      where: { id: ongId },
      include: { user: true },
    });
    if (!ong) throw new NotFoundException('ONG not found');

    const updatedOng = await this.prisma.ong.update({
      where: { id: ongId },
      data: { isVerified: false },
      include: { user: true },
    });

    return updatedOng;
  }
}
