import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export const IsRealDate = (validationOptions?: ValidationOptions) => {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'isRealDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') {
            return false;
          }

          const [month, day, year] = value.split('-').map(Number);

          if (isNaN(month) || isNaN(day) || isNaN(year)) {
            return false;
          }

          const date = new Date(year, month - 1, day);

          return (
            date.getFullYear() == year &&
            date.getMonth() == month - 1 &&
            date.getDate() == day
          );
        },

        defaultMessage(args: ValidationArguments) {
          return `${args.property} n'est pas une date valide.`;
        },
      },
    });
  };
};
