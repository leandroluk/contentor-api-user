import { Search, Unique } from '$/domain/generics';
import env from '$/env';
import { Client } from '@elastic/elasticsearch';
import {
  QueryDslQueryContainer,
  SearchRequest,
  SortCombinations
} from '@elastic/elasticsearch/lib/api/types';
import { EntityMap } from './types';

type OpMap = (field: string, value: any) => QueryDslQueryContainer;

export const opMap: Record<Search.Operators.Match.Positive | Search.Operators.Range.Positive, OpMap> = {
  eq: (field, value) => ({ match: { [field]: value } }),
  gt: (field, value) => ({ range: { [field]: { gt: value } } }),
  gte: (field, value) => ({ range: { [field]: { gte: value } } }),
  lt: (field, value) => ({ range: { [field]: { lt: value } } }),
  lte: (field, value) => ({ range: { [field]: { lte: value } } }),
  like: (field, value) => ({ regexp: { [field]: { value, case_insensitive: true } } }),
  in: (field, value) => ({ match: { [field]: value } })
};

export const elasticsearchHelper = {
  instance: null as unknown as Client,

  async connect(): Promise<void> {
    elasticsearchHelper.instance = new Client({
      node: env.db.elasticsearch
    });

    await elasticsearchHelper.instance.ping();
  },

  parseSearch<T extends Unique>(
    search: Search.Query<T>,
    entityMap: EntityMap<T>
  ): SearchRequest {
    const request: SearchRequest = {
      query: { bool: { filter: [], must_not: [] } },
      sort: [],
      _source_includes: [],
      _source_excludes: []
    };

    if (search.text) {
      request.query.bool.must = {
        multi_match: {
          fields: entityMap.fuzzyFields,
          query: search.text,
          fuzziness: 'AUTO'
        }
      };
    }

    if (search.where) {
      for (const [field, term] of Object.entries(search.where)) {
        for (const [op, value] of Object.entries(term)) {
          if (op[0] === 'n') {
            (request.query.bool.must_not as QueryDslQueryContainer[])
              .push(opMap[op.slice(1)](field, value));
          } else {
            (request.query.bool.filter as QueryDslQueryContainer[])
              .push(opMap[op](field, value));
          }
        }
      }
    }

    if (search.fields) {
      if (search.fields.select) {
        request._source_includes = search.fields.select;
      } else if (search.fields.remove) {
        request._source_excludes = search.fields.remove;
      }
    }

    if (search.sort) {
      for (const [key, value] of Object.entries(search.sort)) {
        (request.sort as SortCombinations[]).push({
          [entityMap.sortMap[key]]: { order: value === 1 ? 'asc' : 'desc' }
        });
      }
    };

    if (search.offset) {
      request.from = search.offset;
    }

    if (search.limit) {
      request.size = search.limit;
    }

    return request;
  }
};
