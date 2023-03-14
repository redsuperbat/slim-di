import { INJECT_METADATA } from "./tokens";
import { ClassDefinition } from "./types";

export const Inject =
  (token: ClassDefinition): ParameterDecorator =>
  (target) => {
    const dependencyMetadata: ClassDefinition[] =
      Reflect.getMetadata(INJECT_METADATA, target) ?? [];

    dependencyMetadata.unshift(token);

    Reflect.defineMetadata(INJECT_METADATA, dependencyMetadata, target);
  };
