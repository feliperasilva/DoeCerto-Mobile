import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DonorService } from './donor/donor.service';
import { DonorController } from './donor/donor.controller';

@Module({
  imports: [],
  controllers: [AppController, DonorController],
  providers: [AppService, DonorService],
})
export class AppModule {}
