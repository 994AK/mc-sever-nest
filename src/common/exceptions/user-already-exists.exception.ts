import { HttpException, HttpStatus } from '@nestjs/common';

export class UserAlreadyExistsException extends HttpException {
  constructor(message: string = 'User already exists') {
    super(message, HttpStatus.CONFLICT);
  }
}
