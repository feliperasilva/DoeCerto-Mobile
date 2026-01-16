import { Controller, Post, UseGuards, Body, Get, Param, ParseIntPipe, Query, DefaultValuePipe } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import type { User } from 'generated/prisma';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { RatingDto } from './dto/rating.dto';

@Controller('ongs/:ongId/ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  // POST /ratings/5 -> Cria ou atualiza a nota da ONG 5
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('donor')
  async rateOng(
    @Param('ongId', ParseIntPipe) ongId: number,
    @Body() ratingDto: RatingDto, 
    @CurrentUser() user: User
  ) {
    // Garantimos que o ongId da URL seja o usado, ignorando o que vier no body se necessário
    return this.ratingsService.rateOng({ ...ratingDto, ongId }, user.id);
  } 

  // GET /ratings/5 -> Lista todas as notas da ONG 5
  // Note que removemos o Guard global do Controller ou aplicamos apenas onde precisa
  @Get()
  async getRatings(
    @Param('ongId', ParseIntPipe) ongId: number,
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip = 0,
    @Query('take', new DefaultValuePipe(20), ParseIntPipe) take = 20,
  ) {
    return this.ratingsService.getOngRatings(ongId, skip, take);
  }
}