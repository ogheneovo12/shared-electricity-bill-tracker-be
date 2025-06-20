import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import dayjsUtc from 'src/common/utils/dayjsUtc';

@ValidatorConstraint({ name: 'isNotBefore', async: false })
export class IsNotBeforeConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [referenceField] = args.constraints;
    const relatedValue = referenceField
      ? (args.object as any)[referenceField]
      : undefined;

    // Ensure the value to be validated is a valid date
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      return false;
    }

    // If referenceField is provided, ensure it's a valid date
    if (
      referenceField &&
      (!(relatedValue instanceof Date) || isNaN(relatedValue.getTime()))
    ) {
      return false;
    }

    const dayjsValue = dayjsUtc(value);
    const dayjsRelatedValue = dayjsUtc(relatedValue ?? new Date());

    // When referenceField is not provided, ensure the date is not in the past
    if (!referenceField) {
      return !dayjsValue.isBefore(dayjsRelatedValue, 'date');
    }

    return dayjsValue.isBefore(dayjsRelatedValue, 'date');
  }

  defaultMessage(args: ValidationArguments) {
    const [constraintName] = args.constraints;
    const propertyName = args.property;
    if (constraintName) {
      return `${propertyName} must be before ${constraintName} `;
    }
    return `${propertyName} must not be in the past`;
  }
}

export function IsBefore(
  referenceField?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [referenceField],
      validator: IsNotBeforeConstraint,
    });
  };
}
