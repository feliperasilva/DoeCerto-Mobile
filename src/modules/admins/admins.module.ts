import { Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';
import { OngsModule } from 'src/modules/ongs/ongs.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [OngsModule, PrismaModule],
  providers: [AdminsService],
  controllers: [AdminsController],
})
export class AdminsModule {}
