import { ApiProperty } from '@nestjs/swagger';

export class ApiResponse<T> {
  @ApiProperty({ description: '响应代码' })
  code: number;

  @ApiProperty({ description: '响应消息' })
  message: string;

  @ApiProperty({ description: '响应数据', required: false })
  data?: T;

  constructor(code: number, message: string, data?: T) {
    this.code = code;
    this.message = message;
    this.data = data;
  }
}
