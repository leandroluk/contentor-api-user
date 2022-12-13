import { ISearchUserRepo } from '$/data/repos';
import { SearchTotalHits } from '@elastic/elasticsearch/lib/api/types';
import { registry, singleton } from 'tsyringe';
import { INDEX_USER } from '../constants';
import { userSortMap } from '../entity-map';
import { elasticsearchHelper } from '../helper';

@singleton()
@registry([{ useClass: ElasticsearchSearchUserRepo, token: 'ISearchUserRepo' }])
export class ElasticsearchSearchUserRepo implements ISearchUserRepo {
  async search(query: ISearchUserRepo.Query): Promise<ISearchUserRepo.Result> {
    const parsedSearch = elasticsearchHelper.parseSearch(query, {
      fuzzyFields: ['displayName', 'email'],
      sortMap: userSortMap
    });
    const result = await elasticsearchHelper.instance
      .search<ISearchUserRepo.Type>({
        ...parsedSearch,
        index: INDEX_USER
      });

    return {
      items: result.hits.hits.map(item => item._source),
      total: (result.hits.total as SearchTotalHits).value,
      offset: query.offset,
      limit: query.limit
    };
  }
}
