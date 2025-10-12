import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DonorService } from './donor/donor.service';
import { DonorController } from './donor/donor.controller';
import { DonorModule } from './donor/donor.module';

@Module({
  imports: [DonorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
