import { Module } from '@nestjs/common';
import { RconService } from './rcon.service';

@Module({
  providers: [RconService],
  exports: [RconService],
})
export class RconModule {}
