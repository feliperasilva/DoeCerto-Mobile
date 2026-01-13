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
  private readonly donorSelect = {
    userId: true,
    cpf: true,
    user: {
      select: { id: true, name: true, email: true }
    }
  } as const;

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
          role: UserRole.donor,
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

  async findAll(skip = 0, take = 20) {
    const validTake = Math.min(Math.max(take, 1), 100);
    const validSkip = Math.max(skip, 0);

    const [donors, total] = await Promise.all([
      this.prisma.donor.findMany({
        select: this.donorSelect,
        skip: validSkip,
        take: validTake,
        orderBy: { userId: 'desc' }
      }),
      this.prisma.donor.count()
    ]);

    return { data: donors, pagination: { skip: validSkip, take: validTake, total, pages: Math.ceil(total / validTake) } };
  }

  async findOne(id: number) {
    const donor = await this.prisma.donor.findUnique({
      where: { userId: id },
      select: this.donorSelect,
    });

    if (!donor) {
      throw new NotFoundException(`Donor with id ${id} not found`);
    }

    return donor;
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
      select: this.donorSelect,
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
