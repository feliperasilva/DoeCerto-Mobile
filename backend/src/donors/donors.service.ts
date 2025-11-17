import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRole } from '../users/dto/create-user.dto';
import { CreateDonorDto } from './dto/create-donor.dto';
import { UpdateDonorDto } from './dto/update-donor.dto';
import { excludePassword } from 'src/common/utils/exclude-password.util';
import { ValidationUtil } from 'src/common/utils/validation.util';

@Injectable()
export class DonorsService {
  private readonly SALT_ROUNDS = 10;
  private readonly donorInclude = { user: true } as const;

  constructor(private readonly prisma: PrismaService) {}

  async create(createDonorDto: CreateDonorDto) {
    const { name, email, password, cpf } = createDonorDto;

    // Validate unique constraints
    await ValidationUtil.validateUniqueCpf(this.prisma, cpf);
    await ValidationUtil.validateUniqueEmail(this.prisma, email);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);

    // Create user and donor in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: UserRole.DONOR,
        },
      });

      const donor = await tx.donor.create({
        data: {
          cpf,
          userId: user.id,
        },
      });

      return { user, donor };
    });

    return {
      user: excludePassword(result.user),
      donor: result.donor,
    };
  }

  async findAll() {
    const donors = await this.prisma.donor.findMany({
      include: this.donorInclude,
    });

    return donors.map((donor) => ({
      ...donor,
      user: excludePassword(donor.user),
    }));
  }

  async findOne(id: number) {
    const donor = await this.prisma.donor.findUnique({
      where: { userId: id },
      include: this.donorInclude,
    });

    if (!donor) {
      throw new NotFoundException(`Donor with id ${id} not found`);
    }

    return {
      ...donor,
      user: excludePassword(donor.user),
    };
  }

  async update(id: number, updateDonorDto: UpdateDonorDto) {
    const donor = await this.prisma.donor.findUnique({ where: { userId: id } });
    if (!donor) {
      throw new NotFoundException(`Donor with id ${id} not found`);
    }

    // Validate CPF if being updated
    if (updateDonorDto.cpf && updateDonorDto.cpf !== donor.cpf) {
      await ValidationUtil.validateUniqueCpf(
        this.prisma,
        updateDonorDto.cpf,
        id,
      );
    }

    return this.prisma.donor.update({
      where: { userId: id },
      data: updateDonorDto,
    });
  }

  async remove(id: number) {
    const donor = await this.prisma.donor.findUnique({ where: { userId: id } });
    if (!donor) {
      throw new NotFoundException(`Donor with id ${id} not found`);
    }

    return this.prisma.donor.delete({ where: { userId: id } });
  }
}
