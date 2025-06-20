import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ContributionDto {
  @IsNotEmpty()
  @IsString()
  room: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsString()
  @IsOptional()
  note?: string;
}

export class CreatePurchaseDto {
  @IsNotEmpty()
  date_purchased: Date;

  @IsNotEmpty()
  @IsNumber()
  total_amount: number;

  @IsNotEmpty()
  @IsNumber()
  total_units: number;

  @IsOptional()
  @IsString()
  receipt_url?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContributionDto)
  contributions: ContributionDto[];

  @IsString()
  @IsOptional()
  note?: string;
}

export class FilterPurchaseDto {
  @IsDateString()
  @IsOptional()
  startDate: string;

  @IsDateString()
  @IsOptional()
  endDate: string;
}
