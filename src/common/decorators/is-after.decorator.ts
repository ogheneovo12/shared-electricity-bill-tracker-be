import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import dayjsUtc from 'src/common/utils/dayjsUtc';

type ConstraintOption = {
  referenceField?: string;
  getAltName?: (object: object) => string | undefined;
  allowSame?: boolean;
};

@ValidatorConstraint({ name: 'isAfter', async: false })
export class IsAfterConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [options = {}] = args.constraints;
    const { referenceField, allowSame } = options as ConstraintOption;
    const relatedValue = referenceField
      ? (args.object as any)[referenceField]
      : undefined;

    // Ensure both value and relatedValue are valid dates
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

    const dayjsRelatedValue = dayjsUtc(relatedValue ?? dayjsUtc());

    if (allowSame) {
      return dayjsValue.isSameOrAfter(dayjsRelatedValue, 'date');
    }
    return dayjsValue.isAfter(dayjsRelatedValue, 'date');
  }

  defaultMessage(args: ValidationArguments) {
    const [options] = args.constraints;
    const { referenceField: constraintName, getAltName = () => {} } =
      options as ConstraintOption;
    const alt_name = getAltName(args.object);

    const propertyName = args.property;
    if (constraintName) {
      return `${alt_name || propertyName} must be after ${constraintName} `;
    }
    return `${alt_name || propertyName} must not be in the past`;
  }
}

export function IsAfter(
  options: ConstraintOption,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [options],
      validator: IsAfterConstraint,
    });
  };
}
