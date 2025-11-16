import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { DonorsModule } from './donors/donors.module';
import { OngsModule } from './ongs/ongs.module';
import { AuthModule } from './auth/auth.module';
import { AdminsModule } from './admins/admins.module';
import { DonationsModule } from './donations/donations.module';

@Module({
  imports: [PrismaModule, UsersModule, DonorsModule, OngsModule, AuthModule, AdminsModule, DonationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
