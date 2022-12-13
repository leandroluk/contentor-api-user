export type RequestValidator<T = any> = {
  validate(unknown: unknown): Promise<T>;
};
