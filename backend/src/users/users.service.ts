import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { excludePassword } from 'src/common/utils/exclude-password.util';
import { ValidationUtil } from 'src/common/utils/validation.util';

@Injectable()
export class UsersService {
  private readonly SALT_ROUNDS = 10;

  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const { email, password, ...rest } = createUserDto;

    // Validate unique email
    await ValidationUtil.validateUniqueEmail(this.prisma, email);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);

    const user = await this.prisma.user.create({
      data: { ...rest, email, password: hashedPassword },
    });

    return excludePassword(user);
  }

  async findAll(skip = 0, take = 20) {
    const validTake = Math.min(Math.max(take, 1), 100);
    const validSkip = Math.max(skip, 0);

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip: validSkip,
        take: validTake,
        orderBy: { id: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.user.count(),
    ]);

    return {
      data: users,
      pagination: { skip: validSkip, take: validTake, total, pages: Math.ceil(total / validTake) },
    };
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id: Number(id) } });
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    // Validate email if being updated
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      await ValidationUtil.validateUniqueEmail(
        this.prisma,
        updateUserDto.email,
        id,
      );
    }

    const updateData: Partial<UpdateUserDto> = { ...updateUserDto };

    // Hash password if being updated
    if (updateUserDto.password) {
      updateData.password = await bcrypt.hash(
        updateUserDto.password,
        this.SALT_ROUNDS,
      );
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateData,
    });
    return excludePassword(updatedUser) as UserResponseDto;
  }

  async remove(id: number): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const deletedUser = await this.prisma.user.delete({ where: { id } });
    return excludePassword(deletedUser);
  }
}
