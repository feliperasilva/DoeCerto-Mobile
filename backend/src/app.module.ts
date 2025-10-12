import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DonorService } from './donor/donor.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, DonorService],
})
export class AppModule {}
