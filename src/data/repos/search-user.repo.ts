import { Search, User } from '$/domain';

export interface ISearchUserRepo {
  search(query: ISearchUserRepo.Query): Promise<ISearchUserRepo.Result>;
}
export namespace ISearchUserRepo {
  export type Type = User;
  export type Query = Search.Query<Type>;
  export type Result = Search.Result<Type>;
}
