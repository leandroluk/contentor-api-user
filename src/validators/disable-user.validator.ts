import { IDisableUserCase } from '$/domain';
import Joi from 'joi';
import { registry, singleton } from 'tsyringe';
import { AbstractValidator } from './abstract.validator';

@singleton()
@registry([{ useClass: DisableUserValidator, token: 'IDisableUserCase.Validator' }])
export class DisableUserValidator extends AbstractValidator<IDisableUserCase.Data> {
  constructor() {
    super(
      Joi.object<IDisableUserCase.Data>({
        headers: Joi.object<IDisableUserCase.Data['headers']>({
          from: Joi.string()
            .uuid({ version: 'uuidv4' })
            .required()
        }),
        params: Joi.object<IDisableUserCase.Data['params']>({
          _uid: Joi.string()
            .uuid({ version: 'uuidv4' })
            .required()
        })
      })
    );
  }
}
