import { IAddUserCase } from '$/domain';
import Joi from 'joi';
import { registry, singleton } from 'tsyringe';
import { AbstractValidator } from './abstract.validator';
import { PASSWORD_MESSAGE, PASSWORD_REGEX } from './constants';

@singleton()
@registry([{ useClass: AddUserValidator, token: 'IAddUserCase.Validator' }])
export class AddUserValidator extends AbstractValidator<IAddUserCase.Data> {
  constructor() {
    super(
      Joi.object<IAddUserCase.Data>({
        headers: Joi.object<IAddUserCase.Data['headers']>({
          from: Joi.string()
            .uuid({ version: 'uuidv4' })
            .required()
        }),
        body: Joi.object<IAddUserCase.Data['body']>({
          displayName: Joi.string()
            .required()
            .max(100),
          email: Joi.string()
            .required()
            .email()
            .max(100),
          password: Joi.string()
            .required()
            .min(8)
            .max(50)
            .regex(PASSWORD_REGEX)
            .message(PASSWORD_MESSAGE)
        })
      })
    );
  }
}
