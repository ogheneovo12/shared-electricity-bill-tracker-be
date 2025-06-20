import { IsOptional, IsInt, IsString } from 'class-validator';
import { IsValidSort } from '../decorators/is-valid-sort.decorator';
import { Type } from 'class-transformer';

export class PaginationDto {
  static allowedSortFields: string[] = [];

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  page: number = 1;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  limit: number = 10;

  @IsOptional()
  @IsString()
  @IsValidSort()
  sort?: string;
}
