import { User } from '$/domain';

export type IPublishUserTask = {
  publish(data: IPublishUserTask.Data): Promise<IPublishUserTask.Result>;
};
export namespace IPublishUserTask {
  export type Data = User;
  export type Result = void;
}
