import { Entity, Search } from '$/domain/generics';
import { elasticsearchHelper, opMap } from '$/infra/elasticsearch';
import { EntityMap } from '$/infra/elasticsearch/types';
import elasticsearch from '@elastic/elasticsearch';

describe('infra/elasticsearch/helpers', () => {
  describe('opMap', () => {
    const listOfExpected = [
      ['eq', { match: { a: 1 } }],
      ['gt', { range: { a: { gt: 1 } } }],
      ['gte', { range: { a: { gte: 1 } } }],
      ['lt', { range: { a: { lt: 1 } } }],
      ['lte', { range: { a: { lte: 1 } } }],
      ['like', { regexp: { a: { value: 1, case_insensitive: true } } }],
      ['in', { match: { a: 1 } }]
    ];

    it.each(listOfExpected)('should return mapped structure to %p operator', (op: string, expected: any) => {
      expect(opMap[op]('a', 1)).toEqual(expected);
    });
  });

  describe('elasticsearchHelper.connect', () => {
    it('should throw if ping throws', async () => {
      ((elasticsearch as any).mock.ping as jest.Mock)
        .mockRejectedValueOnce(new Error());
      await expect(elasticsearchHelper.connect()).rejects.toThrow();
    });

    it('should create indices when request to create', async () => {
      await expect(elasticsearchHelper.connect()).resolves.toBeUndefined();
    });
  });

  describe('elasticsearchHelper.parseSearch', () => {
    const entityMap: EntityMap<Entity> = {
      fuzzyFields: ['_uid'],
      sortMap: {
        _uid: '_uid',
        _created: '_created',
        _disabled: '_disabled',
        _updated: '_updated'
      }
    };

    it('should parse search.fuzzy', () => {
      const search: Search.Query<Entity> = { text: 'a' };
      const result: any = elasticsearchHelper.parseSearch(search, entityMap);
      const expected = {
        query: {
          bool: {
            must: { multi_match: { query: 'a' } }
          }
        }
      };
      expect(result).toMatchObject(expected);
    });

    it('should parse search.where', () => {
      const search: Search.Query<Entity> = { where: { _uid: { eq: 'eq', neq: 'neq' } } };
      const result: any = elasticsearchHelper.parseSearch(search, entityMap);
      const expected = {
        query: {
          bool: {
            must_not: [{ match: { _uid: 'neq' } }],
            filter: [{ match: { _uid: 'eq' } }]
          }
        }
      };
      expect(result).toMatchObject(expected);
    });

    it('should parse search.fields', () => {
      const selectSearch: Search.Query<Entity> = { fields: { select: ['_uid'] } };
      const selectExpected = { _source_includes: ['_uid'] };
      expect(elasticsearchHelper.parseSearch(selectSearch, entityMap)).toMatchObject(selectExpected);

      const excludeSearch: Search.Query<Entity> = { fields: { remove: ['_created'] } };
      const excludeExpected = { _source_excludes: ['_created'] };
      expect(elasticsearchHelper.parseSearch(excludeSearch, entityMap)).toMatchObject(excludeExpected);
    });

    it('should parse search.sort', () => {
      const search: Search.Query<Entity> = { sort: { _uid: 1, _created: -1 } };
      expect(elasticsearchHelper.parseSearch(search, entityMap))
        .toMatchObject({
          sort: [
            { _uid: { order: 'asc' } },
            { _created: { order: 'desc' } }
          ]
        });
    });

    it('should parse search.offset and search.limit', () => {
      expect(elasticsearchHelper.parseSearch({ offset: 1, limit: 50 }, entityMap))
        .toMatchObject({
          from: 1,
          size: 50
        });
    });
  });
});
