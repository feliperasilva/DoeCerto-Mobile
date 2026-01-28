import { Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { GetCatalogDto } from './dto/get-catalog.dto';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get()
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      whitelist: true,
    }),
  )
  async getCatalog(@Query() filters: GetCatalogDto) {
    return this.catalogService.getCatalog(filters);
  }
}
