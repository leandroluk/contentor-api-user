import { IdentifiedHeader, RequestValidator, Snapshot } from '../generics';
import { User } from '../models';

export interface IHistoryUserCase {
  history(data: IHistoryUserCase.Data): Promise<IHistoryUserCase.Result>;
}
export namespace IHistoryUserCase {
  export type Type = Snapshot<User>;
  export type Data = {
    headers: IdentifiedHeader;
    params: Pick<User, '_uid'>;
  };
  export type Result = Array<Snapshot<User>>;
  export type Validator = RequestValidator<Data>;
}
