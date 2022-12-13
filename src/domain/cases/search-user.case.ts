import { RequestValidator, Search } from '../generics';
import { IdentifiedHeader } from '../generics/identified-header';
import { User } from '../models';

export interface ISearchUserCase {
  search(data: ISearchUserCase.Data): Promise<ISearchUserCase.Result>;
}
export namespace ISearchUserCase {
  export type Type = Omit<User, 'password'>;
  export type Data = {
    headers: IdentifiedHeader;
    body: Search.Query<Type>;
  };
  export type Result = Search.Result<Type>;
  export type Validator = RequestValidator<Data>;
}
