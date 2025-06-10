import { IsDate, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateReservationDto {
  @IsDate({ message: 'Start date must be a Date instance' })
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Start date must be in YYYY-MM-DD format',
  })
  startDate: Date;

  @IsDate({ message: 'End date must be a Date instance' })
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'End date must be in YYYY-MM-DD format',
  })
  endDate: Date;

  @IsString()
  @IsNotEmpty()
  placeId: string;

  @IsString()
  @IsNotEmpty()
  invoiceId: string;
}
