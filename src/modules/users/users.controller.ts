import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  ForbiddenException,
  Query,
  DefaultValuePipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import type { User } from 'generated/prisma';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Admin only - Create user directly (not through registration)
  @Roles('admin')
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // Admin only - List all users
  @Roles('admin')
  @Get()
  findAll(
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
    @Query('take', new DefaultValuePipe(20), ParseIntPipe) take: number,
  ) {
    return this.usersService.findAll(skip, take);
  }

  // Users can view their own profile
  @Get('me')
  findMe(@CurrentUser() user: User) {
    return this.usersService.findOne(user.id);
  }

  // Admin can view any user profile
  @Roles('admin')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  // Users can update their own profile
  @Patch('me')
  updateMe(
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: User,
  ) {
    return this.usersService.update(user.id, updateUserDto);
  }

  // Admin can update any user profile
  @Roles('admin')
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  // Admin only - Delete user
  @Roles('admin')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
