// Taken from angular types
export interface Type<T = unknown> extends Function {
  new (...args: any[]): T;
}
