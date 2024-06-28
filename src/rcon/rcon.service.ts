import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Rcon } from 'rcon-client';
import { ConfigService } from '@nestjs/config';
import { PlayersData, PlayersItem } from '../types/players';

@Injectable()
export class RconService implements OnModuleInit, OnModuleDestroy {
  private rcon: Rcon;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const host = this.configService.get<string>('RCON_HOST');
    const port = this.configService.get<number>('RCON_PORT');
    const password = this.configService.get<string>('RCON_PASSWORD');

    this.rcon = new Rcon({
      host,
      port,
      password,
    });
    await this.rcon.connect();
  }

  async onModuleDestroy() {
    await this.rcon.end();
  }

  async getPlayerList(): Promise<{ players: PlayersItem }> {
    try {
      const response = await this.rcon.send('list');
      const playerListString = response.split(':')[1]?.trim() || '';
      const playerNames = playerListString ? playerListString.split(', ') : [];

      return {
        players: {
          max: 60, // 假设最大玩家数是60，根据实际情况修改
          now: playerNames.length,
          sample: playerNames.map((name) => ({ name })),
        },
      };
    } catch (error) {
      console.error('Error fetching player list:', error);
      throw new Error('Failed to fetch player list');
    }
  }
}
