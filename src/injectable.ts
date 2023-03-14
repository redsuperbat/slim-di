import { INJECTABLE_METADATA } from "./tokens";

export const Injectable = (): ClassDecorator => (target) => {
  const paramtypes = Reflect.getMetadata(
    "design:paramtypes",
    target.constructor
  );

  Reflect.defineMetadata(INJECTABLE_METADATA, paramtypes, target.prototype);
  return target;
};
