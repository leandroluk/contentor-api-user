import { SearchResponseBody } from '@elastic/elasticsearch/lib/api/types';

export const throwFn = (): any => { throw new Error(); };

export const makeCreateQueryBuilder = <T = any>(): Record<string, jest.Mock> => ({
  createQueryBuilder: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  into: jest.fn().mockReturnThis(),
  values: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  addOrderBy: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  take: jest.fn().mockReturnThis(),
  execute: jest.fn(async () => { }),
  getOne: jest.fn(async () => ({} as unknown as T)),
  getManyAndCount: jest.fn(async () => [[], 0] as [any[], number])
} as any);


export const importModules = async (): Promise<void> => {
  await import('$/infra');
  await import('$/data');
  await import('$/presentation');
};

export const makeElasticsearchSearch = <T>(sources: T[]): SearchResponseBody<T> => {
  return {
    hits: {
      total: { relation: 'eq', value: sources.length },
      hits: sources.map((_source, id) => ({ _index: `${id}`, _id: `${id}`, _source }))
    },
    _shards: { failed: 0, successful: 0, total: 0 },
    took: 0,
    timed_out: false
  };
};
