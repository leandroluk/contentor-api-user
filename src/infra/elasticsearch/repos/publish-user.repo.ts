import { IPublishUserRepo } from '$/data';
import { registry, singleton } from 'tsyringe';
import { INDEX_USER } from '../constants';
import { elasticsearchHelper } from '../helper';

@singleton()
@registry([{ useClass: ElasticSearchPublishUserRepo, token: 'IPublishUserRepo' }])
export class ElasticSearchPublishUserRepo implements IPublishUserRepo {
  async publish(data: IPublishUserRepo.Data): Promise<IPublishUserRepo.Result> {
    await elasticsearchHelper.instance
      .index({
        index: INDEX_USER,
        id: data._uid,
        document: data
      });
  }
}
