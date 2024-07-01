import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, IsOptional } from 'class-validator';

export class ServerCommandDto {
  @ApiProperty({ description: '服务器IP地址' })
  @IsString()
  @IsNotEmpty()
  ip: string = '';

  @ApiProperty({ description: '服务器端口' })
  @IsInt()
  @IsNotEmpty()
  port: number = 25565;

  @ApiProperty({ description: '服务器密码' })
  @IsString()
  @IsNotEmpty()
  password: string = '';

  @ApiProperty({ description: 'RCON命令', required: false })
  @IsString()
  @IsOptional()
  command?: string = '';
}
