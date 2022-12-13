import { IHistoryUserCase } from '$/domain';
import Joi from 'joi';
import { registry, singleton } from 'tsyringe';
import { AbstractValidator } from './abstract.validator';

@singleton()
@registry([{ useClass: HistoryUserValidator, token: 'IHistoryUserCase.Validator' }])
export class HistoryUserValidator extends AbstractValidator<IHistoryUserCase.Data> {
  constructor() {
    super(
      Joi.object<IHistoryUserCase.Data>({
        headers: Joi.object<IHistoryUserCase.Data['headers']>({
          from: Joi.string()
            .uuid({ version: 'uuidv4' })
            .required()
        }),
        params: Joi.object<IHistoryUserCase.Data['params']>({
          _uid: Joi.string()
            .uuid({ version: 'uuidv4' })
            .required()
        })
      })
    );
  }
}
