import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateWhishlistDto } from './dto/create-whishlist.dto';

@Injectable()
export class WhishlistItemService {
  constructor(private readonly prisma: PrismaService) {}

  async create(ongId: number, dto: CreateWhishlistDto) {
    return this.prisma.wishlistItem.create({ data: { ongId, ...dto } });
  }

  async findAllByOng(ongId: number) {
    return this.prisma.wishlistItem.findMany({ where: { ongId } });
  }

  async findOne(id: number) {
    const item = await this.prisma.wishlistItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Wishlist item not found');
    return item;
  }

  async update(id: number, dto: Partial<CreateWhishlistDto>) {
    await this.findOne(id);
    return this.prisma.wishlistItem.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.wishlistItem.delete({ where: { id } });
  }
}
