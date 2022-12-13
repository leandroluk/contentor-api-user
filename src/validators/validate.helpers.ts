import { Search, Unique } from '$/domain';
import env from '$/env';
import Joi, { Schema } from 'joi';

export type MapSchema<T> = Record<keyof T, Schema>;

const matchOps: Search.Operators.Match[] = [
  /* positive */ 'eq', 'gt', 'gte', 'like', 'lt', 'lte',
  /* negative */ 'neq', 'ngt', 'ngte', 'nlike', 'nlt', 'nlte'
];

const rangeOps: Search.Operators.Range[] = [
  /* positive */ 'in',
  /* negative */ 'nin'
];


export const makeSearchQuery = <T extends Unique>(map: MapSchema<T>): Schema<Search.Query<T>> => {
  const where = {};
  const fields = {};
  const sort = {};

  for (const [key, schema] of Object.entries(map)) {
    const whereKey = {};
    for (const op of matchOps) {
      whereKey[op] = schema;
    }
    for (const op of rangeOps) {
      whereKey[op] = Joi.array().items(schema).min(1);
    }
    where[key] = Joi.object(whereKey);
    fields[key] = Joi.number().valid(0, 1).default(1);
    sort[key] = Joi.number().valid(-1, 1);
  }

  return Joi
    .object<Search.Query<T>>({
      where: Joi.object(where),
      fields: Joi.object(fields),
      sort: Joi.object(sort),
      offset: Joi.number().min(0).integer().default(0),
      limit: Joi.number().positive().integer().default(env.db.limit)
    });
};
