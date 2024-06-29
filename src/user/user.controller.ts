import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';
import { PlayersData } from '../types/players';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Post('add')
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ user: User; message: string }> {
    return this.userService.create(createUserDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<{ user: User; message: string }> {
    return this.userService.update(id, updateUserDto);
  }

  @Get('status')
  async findUsersByStatus(@Query('status') status: number): Promise<User[]> {
    return this.userService.findUsersByStatus(Number(status));
  }

  @Get('list')
  async getPlayerList(): Promise<PlayersData> {
    return this.userService.getPlayerList();
  }
}
