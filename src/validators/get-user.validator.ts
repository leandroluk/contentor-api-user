import { IGetUserCase } from '$/domain';
import Joi from 'joi';
import { registry, singleton } from 'tsyringe';
import { AbstractValidator } from './abstract.validator';

@singleton()
@registry([{ useClass: GetUserValidator, token: 'IGetUserCase.Validator' }])
export class GetUserValidator extends AbstractValidator<IGetUserCase.Data> {
  constructor() {
    super(
      Joi.object<IGetUserCase.Data>({
        headers: Joi.object<IGetUserCase.Data['headers']>({
          from: Joi.string()
            .uuid({ version: 'uuidv4' })
            .required()
        }),
        params: Joi.object<IGetUserCase.Data['params']>({
          _uid: Joi.string()
            .uuid({ version: 'uuidv4' })
            .required()
        })
      })
    );
  }
}
