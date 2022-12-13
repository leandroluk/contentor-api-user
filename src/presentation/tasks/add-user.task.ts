import { Entity, User } from '$/domain';

export interface IAddUserTask {
  add(data: IAddUserTask.Data): Promise<IAddUserTask.Result>;
};
export namespace IAddUserTask {
  export type Data = Omit<User, keyof Entity>;
  export type Result = User;
}
