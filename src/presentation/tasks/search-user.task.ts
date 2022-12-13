import { Search, User } from '$/domain';

export interface ISearchUserTask {
  search(query: ISearchUserTask.Query): Promise<ISearchUserTask.Result>;
}
export namespace ISearchUserTask {
  export type Type = Omit<User, 'password'>;
  export type Query = Search.Query<Type>;
  export type Result = Search.Result<Type>;
}
