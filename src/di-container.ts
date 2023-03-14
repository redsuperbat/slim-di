import { INJECTABLE_METADATA, INJECT_METADATA } from "./tokens";
import { ClassDefinition } from "./types";

export interface DIContainer {
  get<T = unknown>(token: ClassDefinition<T>): T;
}

export const createContainer = <T>(root: ClassDefinition<T>): DIContainer => {
  const container = new Map<ClassDefinition, any>();

  const instantiateDeps = (token: ClassDefinition): any => {
    if (!Reflect.hasMetadata(INJECTABLE_METADATA, token.prototype)) {
      throw new Error(
        "Trying to inject a dependency which is not annotated with the @Injectable decorator"
      );
    }

    const dependencyMetadata: ClassDefinition[] = Reflect.getMetadata(
      INJECT_METADATA,
      token
    );

    if (!dependencyMetadata) {
      const instance = new token();
      container.set(token, instance);
      return instance;
    }
    const instance = new token(
      ...dependencyMetadata.map((it) => instantiateDeps(it))
    );
    container.set(token, instance);
    return instance;
  };

  instantiateDeps(root);

  return {
    get(token) {
      return container.get(token);
    },
  };
};
