export interface ClassDefinition<T = unknown> {
  new (...args: any): T;
}
