import { Module } from '@nestjs/common';
import { RconService } from './rcon.service';
import { RconManager } from './rcon.manager';

@Module({
  providers: [RconService, RconManager],
  exports: [RconService],
})
export class RconModule {}
