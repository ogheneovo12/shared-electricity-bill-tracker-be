import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsRecordOfStringArray(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isRecordOfStringArray',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (
            typeof value !== 'object' ||
            value === null ||
            Array.isArray(value)
          )
            return false;
          return Object.values(value).every(
            (arr) =>
              Array.isArray(arr) &&
              arr.every((item) => typeof item === 'string'),
          );
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a record of string arrays`;
        },
      },
    });
  };
}
