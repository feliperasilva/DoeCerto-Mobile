import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRole } from '../users/dto/create-user.dto';
import { CreateDonorDto } from './dto/create-donor.dto';
import { UpdateDonorDto } from './dto/update-donor.dto';
import { excludePassword } from 'src/common/utils/exclude-password.util';

@Injectable()
export class DonorsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDonorDto: CreateDonorDto) {
    const { name, email, password, cpf } = createDonorDto;

    // Verifica CPF único
    const existingCpf = await this.prisma.donor.findUnique({ where: { cpf } });
    if (existingCpf) throw new BadRequestException('CPF already in use');

    // Verifica email único
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
        role: UserRole.DONOR,
      },
    });

    // Cria o donor associado ao usuário
    const donor = await this.prisma.donor.create({
      data: {
        cpf,
        userId: user.id,
      },
    });

    // Retorna dados sem a senha
    return {
      user: excludePassword(user),
      donor,
    };
  }

  async findAll() {
    const donors = await this.prisma.donor.findMany({
      include: { user: true },
    });
    return donors.map((donor) => ({
      ...donor,
      user: excludePassword(donor.user),
    }));
  }

  async findOne(id: number) {
    const donor = await this.prisma.donor.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!donor) throw new NotFoundException(`Donor with id ${id} not found`);

    return {
      ...donor,
      user: excludePassword(donor.user),
    };
  }

  async update(id: number, updateDonorDto: UpdateDonorDto) {
    const donor = await this.prisma.donor.findUnique({ where: { id } });
    if (!donor) throw new NotFoundException(`Donor with id ${id} not found`);

    if (updateDonorDto.cpf && updateDonorDto.cpf !== donor.cpf) {
      const existingCpf = await this.prisma.donor.findUnique({
        where: { cpf: updateDonorDto.cpf },
      });
      if (existingCpf) throw new BadRequestException('CPF already in use');
    }

    return this.prisma.donor.update({ where: { id }, data: updateDonorDto });
  }

  async remove(id: number) {
    const donor = await this.prisma.donor.findUnique({ where: { id } });
    if (!donor) throw new NotFoundException(`Donor with id ${id} not found`);
    return this.prisma.donor.delete({ where: { id } });
  }
}
