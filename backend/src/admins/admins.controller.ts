import { Controller, Post, Delete, Param, Body } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { UserResponseDto } from 'src/users/dto/user-response.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { OngResponseDto } from 'src/ongs/dto/ong-response.dto';
import { mapOng } from 'src/common/utils/map-ong.util';

@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Post()
  async createAdmin(
    @Body() createAdminDto: CreateAdminDto,
  ): Promise<UserResponseDto> {
    return this.adminsService.createAdmin(createAdminDto);
  }

  @Delete(':id')
  async deleteAdmin(@Param('id') id: string): Promise<UserResponseDto> {
    return this.adminsService.deleteAdmin(Number(id));
  }

  @Post('approve-ong/:id')
  async approveOng(@Param('id') id: string): Promise<OngResponseDto> {
    const ong = await this.adminsService.approveOng(Number(id));
    return mapOng(ong); // mapOng precisa acessar ong.user
  }

  @Post('reject-ong/:id')
  async rejectOng(@Param('id') id: string): Promise<OngResponseDto> {
    const ong = await this.adminsService.rejectOng(Number(id));
    return mapOng(ong);
  }

  
}
