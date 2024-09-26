import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsEmail({}, { message: 'Invalid email' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password is too short' })
  password: string;
}
