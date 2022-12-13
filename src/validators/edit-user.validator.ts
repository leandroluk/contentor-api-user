import { IEditUserCase } from '$/domain';
import Joi from 'joi';
import { registry, singleton } from 'tsyringe';
import { AbstractValidator } from './abstract.validator';
import { PASSWORD_MESSAGE, PASSWORD_REGEX } from './constants';

@singleton()
@registry([{ useClass: EditUserValidator, token: 'IEditUserCase.Validator' }])
export class EditUserValidator extends AbstractValidator<IEditUserCase.Data> {
  constructor() {
    super(
      Joi.object<IEditUserCase.Data>({
        headers: Joi.object<IEditUserCase.Data['headers']>({
          from: Joi.string()
            .uuid({ version: 'uuidv4' })
            .required()
        }),
        params: Joi.object<IEditUserCase.Data['params']>({
          _uid: Joi.string()
            .uuid({ version: 'uuidv4' })
            .required()
        }),
        body: Joi.object<IEditUserCase.Data['body']>({
          displayName: Joi.string()
            .max(100),
          email: Joi.string()
            .email()
            .max(100),
          password: Joi.string()
            .min(8)
            .max(50)
            .regex(PASSWORD_REGEX)
            .message(PASSWORD_MESSAGE)
        }).min(1)
      })
    );
  }
}
