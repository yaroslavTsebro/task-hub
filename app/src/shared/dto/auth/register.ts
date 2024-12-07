import { IsEmail, IsString, IsStrongPassword, Length } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(2, 50)
  name: string;

  @IsStrongPassword({minLength: 8})
  password: string
}