import { Module } from '@nestjs/common';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';
import { RconModule } from '../rcon/rcon.module';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [RconModule],
  controllers: [PlayerController],
  providers: [PlayerService, PrismaService],
})
export class PlayerModule {}
