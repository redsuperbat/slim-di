// Taken from angular types
export interface Type<T = unknown> extends Function {
  new (...args: any[]): T;
}

export interface OnInit {
  onInit(): void | Promise<void>;
}

export const hasInstantiationHook = (value: unknown): value is OnInit =>
  value !== null &&
  value !== undefined &&
  (value as OnInit)?.onInit !== undefined;
