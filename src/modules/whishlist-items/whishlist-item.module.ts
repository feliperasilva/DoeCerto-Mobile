import { Module } from '@nestjs/common';
import { WhishlistItemService } from './whishlist-item.service';
import { WishlistItemController } from './wishlist-item.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [WishlistItemController],
  providers: [WhishlistItemService],
  exports: [WhishlistItemService],
})
export class WhishlistItemModule {}
