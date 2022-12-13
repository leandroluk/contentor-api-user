import '$/infra';
import { IPublishUserTask } from '$/presentation';
import { inject, registry, singleton } from 'tsyringe';
import { IPublishUserRepo } from '../repos';

@singleton()
@registry([{ useClass: PublishUserTask, token: 'IPublishUserTask' }])
export class PublishUserTask implements IPublishUserTask {
  constructor(
    @inject('IPublishUserRepo')
    private readonly publishUserRepo: IPublishUserRepo
  ) { }

  async publish(data: IPublishUserTask.Data): Promise<IPublishUserTask.Result> {
    await this.publishUserRepo.publish(data);
  }
}
