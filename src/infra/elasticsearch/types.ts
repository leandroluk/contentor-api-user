export type SortMap<T extends {}> = Record<keyof T, string>;
export type EntityMap<T extends {}> = {
  fuzzyFields: Array<string & keyof Partial<T>>;
  sortMap: SortMap<T>;
};
