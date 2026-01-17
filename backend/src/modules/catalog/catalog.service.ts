import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetCatalogDto } from './dto/get-catalog.dto';
import { CatalogSectionDto, NgoItemDto } from './dto/catalog-response.dto';
import { sortCatalogItems } from 'src/common/utils/sorting.util';

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Método principal que orquestra as diferentes seções do catálogo
   */
  async getCatalog(filters: GetCatalogDto): Promise<CatalogSectionDto[]> {
    // Executa todas as queries em paralelo para não bloquear o event loop
    const [topRated, newest, topFavored, oldest] = await Promise.all([
      this.getTopRated(filters),
      this.getNewest(filters),
      this.getTopFavored(filters),
      this.getOldest(filters),
    ]);

    return [
      { title: 'Melhor Avaliadas', type: 'topRated', data: topRated },
      { title: 'Mais Recentes', type: 'newest', data: newest },
      { title: 'Mais Favoritas', type: 'topFavored', data: topFavored },
      { title: 'Mais Antigas', type: 'oldest', data: oldest },
    ];
  }

  // --- MÉTODOS DE ACESSO PÚBLICO PARA SEÇÕES ESPECÍFICAS ---

  private async getTopRated(filters: GetCatalogDto) {
    return this.findWithPriority(filters, 'averageRating', 'desc');
  }

  private async getNewest(filters: GetCatalogDto) {
    return this.findWithPriority(filters, 'createdAt', 'desc');
  }

  private async getTopFavored(filters: GetCatalogDto) {
    return this.findWithPriority(filters, 'numberOfRatings', 'desc');
  }

  private async getOldest(filters: GetCatalogDto) {
    return this.findWithPriority(filters, 'createdAt', 'asc');
  }

  /**
   * Lógica central de busca com ranking de prioridade por causas/categorias
   */
  private async findWithPriority(
    filters: GetCatalogDto,
    orderByField: string,
    orderByDirection: 'asc' | 'desc',
  ): Promise<NgoItemDto[]> {
    const { categoryIds } = filters;
    const take = filters.limit || 10;
    const skip = filters.offset || 0;

    // 1. Construção do Filtro
    const whereClause: any = {
      verificationStatus: 'verified',
    };

    if (categoryIds && categoryIds.length > 0) {
      whereClause.profile = {
        categories: {
          some: { id: { in: categoryIds } },
        },
      };
    }

    // 2. Busca no Prisma
    // Se houver filtros de categorias, buscamos amostra maior para re-ranquear no código
    const shouldFetchMore = categoryIds && categoryIds.length > 0;
    const fetchLimit = shouldFetchMore ? Math.max(take * 5, 50) : take;

    const ongs = await this.prisma.ong.findMany({
      where: whereClause,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        profile: {
          include: { categories: true },
        },
      },
      orderBy: [
        { [orderByField]: orderByDirection },
        { userId: 'asc' }, // Desempate determinístico usando PK
      ],
      // Paginação no DB apenas se não houver ranking de match
      skip: shouldFetchMore ? 0 : skip,
      take: fetchLimit,
    });

    // 3. Mapeamento para DTO
    let mappedResults = ongs.map((ong) => this.mapToDto(ong, categoryIds));

    // 4. Re-ordenação por Prioridade + Paginação Manual (Se houver filtro)
    if (shouldFetchMore) {
      mappedResults = sortCatalogItems(mappedResults, orderByField, orderByDirection);
      mappedResults = mappedResults.slice(skip, skip + take);
    }

    return mappedResults;
  }

  /**
   * Transforma a entidade do Prisma para o DTO de Resposta
   */
  private mapToDto(ong: any, filterCategoryIds?: number[]): NgoItemDto {
    const categories = ong.profile?.categories || [];
    
    // Calcula quantos IDs batem com o filtro para o ranking
    const matchCount = filterCategoryIds?.length
      ? categories.filter((c) => filterCategoryIds.includes(c.id)).length
      : 0;

    return {
      id: ong.userId,
      userId: ong.userId,
      name: ong.user?.name || 'ONG sem nome',
      averageRating: ong.averageRating || 0,
      numberOfRatings: ong.numberOfRatings || 0,
      createdAt: ong.createdAt,
      matchCount,
      user: {
        id: ong.user.id,
        name: ong.user.name,
        email: ong.user.email,
      },
      categories: categories.map((c) => ({
        id: c.id,
        name: c.name,
      })),
    };
  }
}