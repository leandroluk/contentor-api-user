import { Search, Unique } from '$/domain';
import env from '$/env';
import { EntityTarget, ObjectLiteral } from 'typeorm';
import { typeormDataSource } from './data-source';

type OperatorFn = (field: string, value: any) => [string, ObjectLiteral];

export const operatorsMapToTypeORM: Record<Search.Operators, OperatorFn> = {
  eq: (field, value) => [`(x.${field} = :${field})`, { [field]: value }],
  gt: (field, value) => [`(x.${field} > :${field})`, { [field]: value }],
  gte: (field, value) => [`(x.${field} >= :${field})`, { [field]: value }],
  lt: (field, value) => [`(x.${field} < :${field})`, { [field]: value }],
  lte: (field, value) => [`(x.${field} <= :${field})`, { [field]: value }],
  in: (field, value) => [`(x.${field} IN :${field})`, { [field]: value }],
  like: (field, value) => [`(x.${field} ILIKE :${field})`, { [field]: `%${value as string}%` }],
  neq: (field, value) => [`(NOT (x.${field} = :${field}))`, { [field]: value }],
  ngt: (field, value) => [`(NOT (x.${field} > :${field}))`, { [field]: value }],
  ngte: (field, value) => [`(NOT (x.${field} >= :${field}))`, { [field]: value }],
  nlt: (field, value) => [`(NOT (x.${field} < :${field}))`, { [field]: value }],
  nlte: (field, value) => [`(NOT (x.${field} <= :${field}))`, { [field]: value }],
  nin: (field, value) => [`(NOT (x.${field} IN :${field}))`, { [field]: value }],
  nlike: (field, value) => [`(NOT (x.${field} ILIKE :${field}))`, { [field]: `%${value as string}%` }]
};

export async function searchQueryToTypeORM<T extends Unique>(
  entity: EntityTarget<T>,
  query: Search.Query<T>,
  availableFields: Array<string & keyof T>,
  fullTextFields: Partial<Array<string & keyof T>>
): Promise<Search.Result<T>> {
  let fields: string[] = availableFields;

  if (query.fields?.select) {
    fields = query.fields.select;
  } else if (query.fields?.remove) {
    fields = availableFields.filter(field => !query.fields.remove.includes(field));
  }

  let builder = typeormDataSource
    .createQueryBuilder()
    .from(entity, 'x')
    .select(fields.map(field => `x.${field}`))
    .where('1 = 1');

  if (query.text) {
    // see: https://www.freecodecamp.org/news/fuzzy-string-matching-with-postgresql/
    const matcher = fullTextFields
      .map(field => [
        `x.${field} ILIKE :perc`,
        `SOUNDEX(x.${field}), SOUNDEX(:raw) > 4`,
        `LEVENSHTEIN(LOWER(x.${field}), LOWER(:raw)) < 4`
      ]).flatMap(inner => inner).join(' OR ');
    builder = builder.andWhere(`(${matcher})`, { raw: query.text, perc: `%${query.text}%` });
  }

  if (query.where) {
    Object.entries(query.where).forEach(([field, condition]) => {
      Object.entries(condition).forEach(([op, value]) => {
        const [text, parameter] = operatorsMapToTypeORM[op](field, value, 'x');
        builder = builder.andWhere(text, parameter);
      });
    });
  }

  if (query.sort) {
    builder = builder.orderBy('1');
    Object.entries(query.sort).forEach(([field, value]) => {
      builder = builder.addOrderBy(field, value === 1 ? 'ASC' : 'DESC');
    });
  }

  const { offset = 0, limit = env.db.limit } = query;

  const [items, total] = await builder
    .skip(offset)
    .take(limit)
    .getManyAndCount();

  return { items, total, limit, offset };
}
