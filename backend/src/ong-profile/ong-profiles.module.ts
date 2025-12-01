import { Module } from '@nestjs/common';
import { OngProfilesService } from './ong-profiles.service';
import { OngProfilesController } from './ong-profiles.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule, 
  ],
  controllers: [OngProfilesController],
  providers: [OngProfilesService],
})
export class OngProfilesModule {}