import { CreateChargeDto } from '@app/common';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNotEmpty,
  IsNotEmptyObject,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';

export class CreateReservationDto {
  @IsNotEmpty({ message: 'Start date must be filled!' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Start date must be in YYYY-MM-DD format!',
  })
  startDate: Date;

  @IsNotEmpty({ message: 'End date must be filled!' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'End date must be in YYYY-MM-DD format!',
  })
  endDate: Date;

  @IsString({ message: 'Place must be a String instance!' })
  @IsNotEmpty({ message: 'Place must be filled!' })
  placeId: string;

  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateChargeDto)
  charge: CreateChargeDto;
}
