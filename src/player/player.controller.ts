import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { PlayerService } from './player.service';
import { ServerCommandDto } from './dto/server-command.dto';
import { PlayersEntitiesItem, PlayerEntities } from './entities/player.entity';
import { PlayersItem } from '../types/players';
import {
  ApiTags,
  ApiOperation,
  ApiResponse as SwaggerApiResponse,
} from '@nestjs/swagger';
import { ApiResponse } from '../common/response.dto';

@ApiTags('players')
@Controller('players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post('online')
  @ApiOperation({ summary: '获取在线玩家' })
  @SwaggerApiResponse({
    status: 200,
    description: '成功返回在线玩家列表。',
    type: PlayersEntitiesItem,
  })
  async getOnlinePlayers(
    @Body() serverInfoDto: ServerCommandDto,
  ): Promise<PlayersItem> {
    return this.playerService.getOnlinePlayers(serverInfoDto);
  }

  @Post('send-command')
  @ApiOperation({ summary: '发送RCON命令' })
  @SwaggerApiResponse({
    status: 200,
    description: '成功发送RCON命令。',
    type: String,
  })
  async sendCommand(
    @Body() serverCommandDto: ServerCommandDto,
  ): Promise<string> {
    if (!serverCommandDto.command) {
      throw new Error('Command is required');
    }
    return this.playerService.sendCommand(serverCommandDto);
  }

  @Post('whitelist')
  @ApiOperation({ summary: '添加玩家到白名单' })
  @SwaggerApiResponse({
    status: 200,
    description: '成功添加玩家到白名单。',
    type: PlayerEntities,
  })
  async addWhitelist(
    @Body() addWhitelistDto: PlayerEntities,
  ): Promise<ApiResponse<PlayerEntities>> {
    return this.playerService.addWhitelist(addWhitelistDto);
  }

  @Get('players-by-status')
  @ApiOperation({ summary: '根据状态获取玩家列表' })
  @SwaggerApiResponse({
    status: 200,
    description: '成功返回指定状态的玩家列表。',
    type: [PlayerEntities],
  })
  async getPlayersByStatus(
    @Query('status') status: number,
  ): Promise<ApiResponse<PlayerEntities[]>> {
    return this.playerService.getPlayersByStatus(status);
  }
}
