import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import dayjsUtc from 'src/common/utils/dayjsUtc';

/**
 * Custom decorator to validate that a date is not in the future
 * @param validationOptions Additional validation options
 */
export function IsNotFutureDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsNotFutureDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!value) return false; // Ensure value is provided
          const date = dayjsUtc(value);
          return date.isValid() && date.isBefore(dayjsUtc(), 'date');
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} should not be a future date.`;
        },
      },
    });
  };
}
