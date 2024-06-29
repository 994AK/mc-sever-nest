import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RconService } from '../rcon/rcon.service';
import { PlayersData } from '../types/players';
import { UserAlreadyExistsException } from '../common/exceptions/user-already-exists.exception';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private rconService: RconService,
  ) {}

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findUsersByStatus(status: number): Promise<User[]> {
    return this.prisma.user.findMany({
      where: { status },
    });
  }

  async update(
    id: number,
    data: UpdateUserDto,
  ): Promise<{ user: User; message: string }> {
    try {
      const user = await this.prisma.user.update({
        where: { id: Number(id) },
        data,
      });

      if (data.status === 1) {
        const response = await this.rconService.send(
          `whitelistd add ${user.name}`,
        );
        console.log(`RCON response: ${response}`);
      }

      return {
        user,
        message: `${user.name} 的状态已更新为 ${user.status}！`,
      };
    } catch (error) {
      throw new HttpException(
        'Failed to update user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(data: CreateUserDto): Promise<{ user: User; message: string }> {
    const existingUser = await this.prisma.user.findFirst({
      where: { name: data.name },
    });

    if (existingUser) {
      throw new UserAlreadyExistsException(
        `${existingUser.name} ${existingUser.status === 0 ? '正在审核中,如果有问题联系管理员...' : '已经添加成功啦'}`,
      );
    }

    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        status: data.status,
      },
    });

    return {
      user,
      message: `${user.name} 提交成功待审核中！`,
    };
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
