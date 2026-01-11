import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRole } from '../users/dto/create-user.dto';
import { CreateOngDto } from './dto/create-ong.dto';
import { UpdateOngDto } from './dto/update-ong.dto';
import { excludePassword } from 'src/common/utils/exclude-password.util';
import { ValidationUtil } from 'src/common/utils/validation.util';

@Injectable()
export class OngsService {
  private readonly SALT_ROUNDS = 10;
  private readonly ongInclude = { user: true } as const;

  constructor(private readonly prisma: PrismaService) {}

  async create(createOngDto: CreateOngDto) {
    const { name, email, password, cnpj } = createOngDto;

    // Validate unique constraints
    await ValidationUtil.validateUniqueCnpj(this.prisma, cnpj);
    await ValidationUtil.validateUniqueEmail(this.prisma, email);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);

    // Create user and ONG in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: UserRole.ong,
        },
      });

      const ong = await tx.ong.create({
        data: {
          cnpj,
          userId: user.id,
        },
      });

      return { user, ong };
    });

    return {
      user: excludePassword(result.user),
      ong: result.ong,
    };
  }

  async findAll() {
    const ongs = await this.prisma.ong.findMany({
      include: this.ongInclude,
    });

    return ongs.map((ong) => ({
      ...ong,
      user: excludePassword(ong.user),
    }));
  }

  async findOne(id: number) {
    const ong = await this.prisma.ong.findUnique({
      where: { userId: id },
      include: this.ongInclude,
    });

    if (!ong) {
      throw new NotFoundException(`ONG with id ${id} not found`);
    }

    return {
      ...ong,
      user: excludePassword(ong.user),
    };
  }

  async update(id: number, updateOngDto: UpdateOngDto) {
    const ong = await this.prisma.ong.findUnique({ where: { userId: id } });
    if (!ong) {
      throw new NotFoundException(`ONG with id ${id} not found`);
    }

    // Validate CNPJ if being updated
    if (updateOngDto.cnpj && updateOngDto.cnpj !== ong.cnpj) {
      await ValidationUtil.validateUniqueCnpj(
        this.prisma,
        updateOngDto.cnpj,
        id,
      );
    }

    return this.prisma.ong.update({
      where: { userId: id },
      data: updateOngDto,
    });
  }

  async remove(id: number) {
    const ong = await this.prisma.ong.findUnique({ where: { userId: id } });
    if (!ong) {
      throw new NotFoundException(`ONG with id ${id} not found`);
    }

    return this.prisma.ong.delete({ where: { userId: id } });
  }
}
