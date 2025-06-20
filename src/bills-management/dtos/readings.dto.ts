import {
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  IsDateString,
} from 'class-validator';

export class CreateReadingDto {
  @IsMongoId()
  roomId: string;

  @IsNumber()
  value: number;

  @IsDateString()
  reading_date: string;

  @IsOptional()
  @IsString()
  screenshot?: string;

  @IsOptional()
  @IsString()
  note: string;
}

export class RoomReportQueryDto {
  @IsMongoId()
  roomId: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}

export class FilterReadingDto {
  @IsMongoId()
  @IsOptional()
  roomId: string;

  @IsDateString()
  @IsOptional()
  startDate: string;

  @IsDateString()
  @IsOptional()
  endDate: string;
}
