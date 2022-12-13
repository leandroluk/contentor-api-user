import { Unique } from './unique';

export namespace Search {
  export interface FullText {
    text?: string;
  }
  export namespace Operators {
    export namespace Match {
      export type Positive = 'eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like';
      export type Negative = `n${Positive}`;
    }
    export namespace Range {
      export type Positive = 'in';
      export type Negative = `n${Positive}`;
    }
    export type Match = Match.Positive | Match.Negative;
    export type Range = Range.Positive | Range.Negative;
  }
  export type Operators = Operators.Match | Operators.Range;
  export interface Pagination {
    offset?: number;
    limit?: number;
  }
  export namespace Query {
    export type Where<T extends Unique> =
      | { [K in keyof T]?: { [O in Operators.Match]?: T[K] } }
      | { [K in keyof T]?: { [O in Operators.Range]?: Array<T[K]> } };
    export namespace Fields {
      export type Select<T> = { select: Array<string & keyof T>; };
      export type Remove<T> = { remove: Array<string & keyof T>; };
    }
    export type Fields<T extends Unique> = XOR<Fields.Select<T>, Fields.Remove<T>>;
    export type Sort<T extends Unique> = { [K in keyof T]?: -1 | 1; };
  }
  export type Query<T extends Unique> = FullText & Pagination & {
    where?: Query.Where<T>;
    fields?: Query.Fields<T>;
    sort?: Query.Sort<T>;
  };
  export type Result<T extends Unique> = Required<Pagination> & {
    items: Array<T | Partial<T>>;
    total: number;
  };
}
