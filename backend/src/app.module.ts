import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DonorModule } from './donor/donor.module';
import { OngModule } from './ong/ong.module';

@Module({
  imports: [DonorModule, OngModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
