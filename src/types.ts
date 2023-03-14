// Taken from angular types
export interface Type<T = unknown> extends Function {
  new (...args: any[]): T;
}

export interface OnInstantiation {
  onInstantiation(): void | Promise<void>;
}

export const hasInstantiationHook = (
  value: unknown
): value is OnInstantiation =>
  value !== null &&
  value !== undefined &&
  (value as OnInstantiation)?.onInstantiation !== undefined;
