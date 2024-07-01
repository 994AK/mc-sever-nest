import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, Min, Max } from 'class-validator';

export class AddWhitelistDto {
  @ApiProperty({ description: '玩家名字' })
  @IsString()
  @IsNotEmpty()
  playerName: string = '';

  @ApiProperty({ description: '玩家QQ号' })
  @IsString()
  @IsNotEmpty()
  qq: string = '';

  @ApiProperty({ description: '白名单状态', example: 0 })
  @IsInt()
  @Min(0)
  @Max(2)
  status: number = 0;
}
