import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUsersDto {
  @IsString({ message: 'Email must be a String instance!' })
  @IsNotEmpty({ message: 'Email must be filled!' })
  email: string;

  @IsString({ message: 'Password must be a String instance!' })
  @IsNotEmpty({ message: 'Password must be filled!' })
  password: string;
}
