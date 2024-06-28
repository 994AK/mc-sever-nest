import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RconService } from '../rcon/rcon.service';
import { PlayersData } from '../types/players';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private rconService: RconService,
  ) {}

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async create(data: CreateUserDto): Promise<User> {
    return await this.prisma.user.create({
      data: {
        name: data.name,
      },
    });
  }

  async update(id: number, data: UpdateUserDto): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async getPlayerList(): Promise<PlayersData> {
    try {
      const playerList = await this.rconService.getPlayerList();
      return {
        code: 200,
        data: playerList,
        message: 'Player list retrieved successfully',
      };
    } catch (error) {
      console.error('Failed to get player list from RCON:', error);
      throw new HttpException(
        {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          data: null,
          message: 'Failed to retrieve player list',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
