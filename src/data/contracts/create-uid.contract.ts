
export interface ICreateUidContract {
  create(): Promise<ICreateUidContract.Result>;
};
export namespace ICreateUidContract {
  export type Result = string;
}
