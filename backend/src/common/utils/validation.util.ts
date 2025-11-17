import { BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

export class ValidationUtil {
  /**
   * Check if email is already in use
   */
  static async validateUniqueEmail(
    prisma: PrismaService,
    email: string,
    excludeId?: number,
  ): Promise<void> {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser && (!excludeId || existingUser.id !== excludeId)) {
      throw new BadRequestException('Email already in use');
    }
  }

  /**
   * Check if CPF is already in use
   */
  static async validateUniqueCpf(
    prisma: PrismaService,
    cpf: string,
    excludeUserId?: number,
  ): Promise<void> {
    const existingCpf = await prisma.donor.findUnique({ where: { cpf } });
    if (
      existingCpf &&
      (!excludeUserId || existingCpf.userId !== excludeUserId)
    ) {
      throw new BadRequestException('CPF already in use');
    }
  }

  /**
   * Check if CNPJ is already in use
   */
  static async validateUniqueCnpj(
    prisma: PrismaService,
    cnpj: string,
    excludeUserId?: number,
  ): Promise<void> {
    const existingCnpj = await prisma.ong.findUnique({ where: { cnpj } });
    if (
      existingCnpj &&
      (!excludeUserId || existingCnpj.userId !== excludeUserId)
    ) {
      throw new BadRequestException('CNPJ already in use');
    }
  }
}
