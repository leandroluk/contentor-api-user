import { RequestValidator } from '$/domain';
import { Schema } from 'joi';

export abstract class AbstractValidator<T> implements RequestValidator<T> {
  constructor(private readonly schema: Schema<T>) { }

  async validate(unknown: unknown): Promise<T> {
    const { headers, body, params, query } = unknown as any;
    const value = await this.schema
      .options({ allowUnknown: true, abortEarly: false })
      .validateAsync({ headers, body, params, query });
    return value;
  }
}
