import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRole } from '../users/dto/create-user.dto';
import { CreateOngDto } from './dto/create-ong.dto';
import { UpdateOngDto } from './dto/update-ong.dto';
import { excludePassword } from 'src/common/utils/exclude-password.util';

@Injectable()
export class OngsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createOngDto: CreateOngDto) {
    const { name, email, password, cnpj } = createOngDto;

    // Verifica se o CNPJ já existe
    const existingCnpj = await this.prisma.ong.findUnique({ where: { cnpj } });
    if (existingCnpj) throw new BadRequestException('CNPJ already in use');

    // Verifica se o email já existe
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) throw new BadRequestException('Email already in use');

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria o usuário
    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: UserRole.ONG,
      },
    });

    // Cria a ONG associada ao usuário
    const ong = await this.prisma.ong.create({
      data: {
        cnpj,
        userId: user.id,
      },
    });

    // Retorna dados sem a senha
    return {
      user: excludePassword(user),
      ong,
    };
  }

  async findAll() {
    const ongs = await this.prisma.ong.findMany({
      include: { user: true },
    });

    return ongs.map((ong) => ({
      ...ong,
      user: excludePassword(ong.user),
    }));
  }

  async findOne(id: number) {
    const ong = await this.prisma.ong.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!ong) throw new NotFoundException(`Ong with id ${id} not found`);

    return {
      ...ong,
      user: excludePassword(ong.user),
    };
  }

  async update(id: number, updateOngDto: UpdateOngDto) {
    const ong = await this.prisma.ong.findUnique({ where: { id } });
    if (!ong) throw new NotFoundException(`Ong with id ${id} not found`);

    if (updateOngDto.cnpj && updateOngDto.cnpj !== ong.cnpj) {
      const existingCnpj = await this.prisma.ong.findUnique({
        where: { cnpj: updateOngDto.cnpj },
      });
      if (existingCnpj) throw new BadRequestException('CNPJ already in use');
    }

    return this.prisma.ong.update({ where: { id }, data: updateOngDto });
  }

  async remove(id: number) {
    const ong = await this.prisma.ong.findUnique({ where: { id } });
    if (!ong) throw new NotFoundException(`Ong with id ${id} not found`);
    return this.prisma.ong.delete({ where: { id } });
  }
}
