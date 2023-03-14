import { INJECT_METADATA } from "./tokens";
import { Type } from "./types";

export const Inject =
  (token: Type): ParameterDecorator =>
  (target) => {
    const dependencyMetadata: Type[] =
      Reflect.getMetadata(INJECT_METADATA, target) ?? [];

    dependencyMetadata.unshift(token);

    Reflect.defineMetadata(INJECT_METADATA, dependencyMetadata, target);
  };
