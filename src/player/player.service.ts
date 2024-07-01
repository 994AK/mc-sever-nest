import { Injectable, Logger } from '@nestjs/common';
import { ServerCommandDto } from './dto/server-command.dto';
import { RconService } from '../rcon/rcon.service';
import { PlayerEntities } from './entities/player.entity';
import { PrismaService } from '../prisma/prisma.service';
import { ApiResponse } from '../common/response.dto';

@Injectable()
export class PlayerService {
  private readonly logger = new Logger(PlayerService.name);

  constructor(
    private readonly rconService: RconService,
    private readonly prisma: PrismaService,
  ) {}

  // 查询在线列表
  async getOnlinePlayers(
    serverInfoDto: ServerCommandDto,
  ): Promise<{ max: number; now: number; sample: Array<{ name: string }> }> {
    const { ip, port, password } = serverInfoDto;
    try {
      const response = await this.rconService.sendCommand(
        ip,
        port,
        password,
        'list',
      );
      const playerListString = response.split(':')[1]?.trim() || '';
      const playerNames = playerListString ? playerListString.split(', ') : [];

      return {
        max: 60,
        now: playerNames.length,
        sample: playerNames.map((name) => ({ name })),
      };
    } catch (error: any) {
      this.logger.error(
        `Error fetching online players: ${error.message}`,
        error.stack,
      );
      throw new Error('Failed to fetch online players');
    }
  }

  // 指令传输
  async sendCommand(serverCommandDto: ServerCommandDto): Promise<string> {
    const { ip, port, password, command } = serverCommandDto;
    try {
      return await this.rconService.sendCommand(
        ip,
        port,
        password,
        typeof command === 'string' ? command : '',
      );
    } catch (error: any) {
      this.logger.error(`Error sending command: ${error.message}`, error.stack);
      throw new Error('Failed to send command');
    }
  }

  // 添加白名单
  async addWhitelist(
    addWhitelistDto: PlayerEntities,
  ): Promise<ApiResponse<PlayerEntities>> {
    try {
      const existingPlayer = await this.prisma.player.findFirst({
        where: {
          qq: addWhitelistDto.qq,
        },
      });

      if (existingPlayer) {
        this.logger.log(
          `Player with QQ ${addWhitelistDto.qq} already exists in whitelist.`,
        );
        return new ApiResponse(
          200,
          `玩家QQ ${addWhitelistDto.qq} 已经申请过白名单啦`,
        );
      }

      const newPlayer = await this.prisma.player.create({
        data: {
          playerName: addWhitelistDto.playerName,
          qq: addWhitelistDto.qq,
          status: addWhitelistDto.status,
        },
      });

      return new ApiResponse(
        200,
        `您的白名单：${newPlayer.playerName}已经提交审核啦`,
      );
    } catch (error: any) {
      this.logger.error(`Error adding player to whitelist: ${error.message}`);
      throw error;
    }
  }

  // 查询玩家状态
  async getPlayersByStatus(
    status: number,
  ): Promise<ApiResponse<PlayerEntities[]>> {
    try {
      const players = await this.prisma.player.findMany({
        where: {
          status: Number(status),
        },
      });

      return new ApiResponse(200, 'Request successful', players);
    } catch (error: any) {
      this.logger.error(`Error fetching players by status: ${error.message}`);
      return new ApiResponse(500, 'Internal server error');
    }
  }
}
