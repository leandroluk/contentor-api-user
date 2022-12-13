import { ISearchUserCase } from '$/domain';
import Joi from 'joi';
import { registry, singleton } from 'tsyringe';
import { AbstractValidator } from './abstract.validator';
import { makeSearchQuery } from './validate.helpers';

@singleton()
@registry([{ useClass: SearchUserValidator, token: 'ISearchUserCase.Validator' }])
export class SearchUserValidator extends AbstractValidator<ISearchUserCase.Data> {
  constructor() {
    super(
      Joi.object<ISearchUserCase.Data>({
        headers: Joi.object<ISearchUserCase.Data['headers']>({
          from: Joi.string()
            .uuid({ version: 'uuidv4' })
            .required()
        }),
        body: makeSearchQuery<ISearchUserCase.Type>({
          _uid: Joi.string(),
          _created: Joi.date(),
          _updated: Joi.date(),
          _disabled: Joi.date(),
          displayName: Joi.string(),
          email: Joi.string()
        })
      })
    );
  }
}
