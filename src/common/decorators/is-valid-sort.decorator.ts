import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsValidSort(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidSort',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') return false;
          const [field, order] = value.split(':');
          const allowedSortFields =
            (args.object as any).constructor.allowedSortFields || [];
          const isValidField = allowedSortFields.includes(field);
          const isValidOrder =
            !order || ['asc', 'desc'].includes(order.toLowerCase());
          return isValidField && isValidOrder;
        },
        defaultMessage(args: ValidationArguments) {
          const allowedSortFields =
            (args.object as any).constructor.allowedSortFields || [];
          return `Sort must be in format "field:asc|desc" where field is one of: ${allowedSortFields.join(', ')}`;
        },
      },
    });
  };
}
