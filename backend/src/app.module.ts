import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { DonorsModule } from './modules/donors/donors.module';
import { OngsModule } from './modules/ongs/ongs.module';
import { AuthModule } from './modules/auth/auth.module';
import { AdminsModule } from './modules/admins/admins.module';
import { DonationsModule } from './modules/donations/donations.module';
import { WhishlistItemModule } from './modules/whishlist-items/whishlist-item.module';
import { OngProfilesModule } from './modules/ong-profile/ong-profiles.module';
import { RatingsModule } from './modules/ratings/ratings.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    DonorsModule,
    OngsModule,
    AuthModule,
    AdminsModule,
    DonationsModule, 
    WhishlistItemModule,
    OngProfilesModule,
    RatingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
