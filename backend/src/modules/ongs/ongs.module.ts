import { Module } from '@nestjs/common';
import { OngsService } from './ongs.service';
import { OngsController } from './ongs.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [OngsController],
  providers: [OngsService],
  exports: [OngsService],
})
export class OngsModule {}
