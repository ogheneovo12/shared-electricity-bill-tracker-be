import { GenericError } from 'src/errors';
import dayjsUtc from './dayjsUtc';
import { Dayjs } from 'dayjs';

export function parseDate(date: Dayjs | Date | string) {
  return dayjsUtc(date);
}

export function hasDateChanged(
  newDate: Date | undefined,
  originalDate: Date | string,
): boolean {
  return (
    !!newDate && !parseDate(newDate).isSame(parseDate(originalDate), 'date')
  );
}

export function ensureFutureDate(date: Date, dateType: string) {
  if (parseDate(date).isSameOrBefore(parseDate(new Date()), 'date')) {
    throw new GenericError(`${dateType} can't be in the past`);
  }
}
