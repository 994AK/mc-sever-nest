import { ApiProperty } from '@nestjs/swagger';

export class PlayerEntities {
  @ApiProperty({ description: '玩家名字' })
  playerName: string = '';

  @ApiProperty({ description: '玩家QQ号' })
  qq: string = '';

  @ApiProperty({ description: '白名单状态', example: 0 })
  status: number = 0;
}

export class PlayersEntitiesItem {
  @ApiProperty({ description: '最大玩家数' })
  max: number = 60;

  @ApiProperty({ description: '当前在线玩家数' })
  now: number = 0;

  @ApiProperty({ description: '在线玩家列表', type: [String] })
  sample: string[] = [];
}
