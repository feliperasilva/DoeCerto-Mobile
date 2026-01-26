// src/catalog/dto/catalog-response.dto.ts

export class NgoCategoryResponseDto {
  id: number;
  name: string;
}

export class NgoUserResponseDto {
  id: number;
  name: string;
  email: string;
}

export class NgoItemDto {
  id: number;
  userId: number;
  name: string;
  averageRating: number;
  numberOfRatings: number;
  createdAt: Date;
  matchCount: number; // Relevância baseada no filtro
  user: NgoUserResponseDto;
  categories: NgoCategoryResponseDto[];
}

export class CatalogSectionDto {
  title: string;
  type: string;
  data: NgoItemDto[];
}