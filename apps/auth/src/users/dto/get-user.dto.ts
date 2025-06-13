import { IsNotEmpty, IsString } from 'class-validator';

export class GetUserDto {
  @IsString({ message: 'Id must be a String instance!' })
  @IsNotEmpty({ message: 'Id must be filled!' })
  _id: string;
}
