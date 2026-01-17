import { ConflictException, Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '../../../generated/prisma';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria uma nova categoria capturando erros de duplicidade do banco de dados
   */
  async create(createCategoryDto: CreateCategoryDto) {
    try {
      return await this.prisma.category.create({
        data: {
          name: createCategoryDto.name,
        },
      });
    } catch (error) {
      // P2002 é o código do Prisma para falha em restrição de unicidade (@unique)
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException(`Category with name "${createCategoryDto.name}" already exists.`);
      }
      throw new InternalServerErrorException('An unexpected error occurred while creating the category.');
    }
  }

  /**
   * Retorna categorias paginadas e ordenadas alfabeticamente
   */
  async findAll(skip = 0, take = 10) {
    const validTake = Math.min(Math.max(take, 1), 100);
    const validSkip = Math.max(skip, 0);

    const [data, total] = await Promise.all([
      this.prisma.category.findMany({
        skip: validSkip,
        take: validTake,
        orderBy: { name: 'asc' }, // Ordenação alfabética para facilitar a busca do usuário
      }),
      this.prisma.category.count(),
    ]);

    return {
      data,
      pagination: {
        skip: validSkip,
        take: validTake,
        total,
        pages: Math.ceil(total / validTake),
      },
    };
  }

  async findOne(id: number) {
    return await this.verifyCategoryExists(id);
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    await this.verifyCategoryExists(id);

    try {
      return await this.prisma.category.update({
        where: { id },
        data: {
          name: updateCategoryDto.name,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException(`Category with name "${updateCategoryDto.name}" already exists.`);
      }
      throw new InternalServerErrorException('An unexpected error occurred while updating the category.');
    }
  }

  async remove(id: number) {
    await this.verifyCategoryExists(id);

    return this.prisma.category.delete({
      where: { id },
    });
  }

  /**
   * Método privado para validação de existência com exceção 404
   */
  private async verifyCategoryExists(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found.`);
    }

    return category;
  }
}