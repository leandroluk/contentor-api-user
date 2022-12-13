import { User } from '$/domain';

export interface IHashPasswordContract {
  hash(password: IHashPasswordContract.Password): Promise<IHashPasswordContract.Result>;
};
export namespace IHashPasswordContract {
  export type Password = User['password'];
  export type Result = User['password'];
}
