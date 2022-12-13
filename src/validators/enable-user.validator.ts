import { IEnableUserCase } from '$/domain';
import Joi from 'joi';
import { registry, singleton } from 'tsyringe';
import { AbstractValidator } from './abstract.validator';

@singleton()
@registry([{ useClass: EnableUserValidator, token: 'IEnableUserCase.Validator' }])
export class EnableUserValidator extends AbstractValidator<IEnableUserCase.Data> {
  constructor() {
    super(
      Joi.object<IEnableUserCase.Data>({
        headers: Joi.object<IEnableUserCase.Data['headers']>({
          from: Joi.string()
            .uuid({ version: 'uuidv4' })
            .required()
        }),
        params: Joi.object<IEnableUserCase.Data['params']>({
          _uid: Joi.string()
            .uuid({ version: 'uuidv4' })
            .required()
        })
      })
    );
  }
}
