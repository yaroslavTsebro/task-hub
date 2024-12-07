import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsStrongPassword, Length } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John Doe', minLength: 2, maxLength: 50 })
  @IsString()
  @Length(2, 50)
  name: string;

  @ApiProperty({ minLength: 8 })
  @IsStrongPassword({ minLength: 8 })
  password: string;
}