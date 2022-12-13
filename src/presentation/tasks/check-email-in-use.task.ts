import { User } from '$/domain';

export interface ICheckEmailInUseTask {
  check(
    email: ICheckEmailInUseTask.Email,
    uid?: ICheckEmailInUseTask.Uid
  ): Promise<ICheckEmailInUseTask.Result>;
};
export namespace ICheckEmailInUseTask {
  export type Email = User['email'];
  export type Uid = User['_uid'];
  export type Result = void;
}
