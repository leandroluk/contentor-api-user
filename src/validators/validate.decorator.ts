import { RequestValidator } from '$/domain';
import { container } from 'tsyringe';

export function validate(validatorPropertyName: string) {
  return function (
    target: any,
    _propertyKey: string,
    descriptor: TypedPropertyDescriptor<any>
  ) {
    const { value } = descriptor as any;
    descriptor.value = async function () {
      const validator = container.resolve<RequestValidator<any>>(validatorPropertyName);
      const validated = await validator.validate.apply(validator, arguments);
      return await Promise.resolve(value.call(this, validated));
    };
  };
}
