import { Query } from 'mongoose';
import { PaginationDto } from '../dto/base-pagination.dto';

export interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function applyPagination<T>(
  query: Query<T[], T>,
  dto: PaginationDto,
  options?: { execute: false },
): Promise<Query<T[], T>>;

export function applyPagination<T>(
  query: Query<T[], T>,
  dto: PaginationDto,
  options: { execute: true },
): Promise<PaginationResult<T>>;

export async function applyPagination<T>(
  query: Query<T[], T>,
  dto: PaginationDto,
  options = { execute: false },
): Promise<PaginationResult<T> | Query<T[], T>> {
  const { limit = 10, page = 1 } = dto;
  const skip = (page - 1) * limit;

  // Apply sorting
  let sortObj = {};
  if (dto.sort) {
    const [field, order] = dto.sort.split(':');
    sortObj = { [field]: order?.toLowerCase() === 'desc' ? -1 : 1 };
  }

  // Clone query for count before applying pagination
  const countQuery = query.clone();

  // Apply pagination to original query
  query.skip(skip).limit(limit).sort(sortObj);

  if (options.execute) {
    const [data, total] = await Promise.all([
      query.exec(),
      countQuery.countDocuments(),
    ]);
    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  return query;
}
