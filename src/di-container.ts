import { INJECTABLE_METADATA } from "./tokens";
import { Type } from "./types";

export interface DIContainer {
  get<T = unknown>(token: Type<T>): T;
}

export const createContainer = <T>(root: Type<T>): DIContainer => {
  const container = new Map<Type, any>();

  const instantiateDeps = (token: Type): unknown => {
    if (!Reflect.hasMetadata(INJECTABLE_METADATA, token)) {
      throw new Error(
        "Trying to inject a dependency which is not annotated with the @Injectable decorator"
      );
    }

    const dependencyMetadata: Type[] = Reflect.getMetadata(
      INJECTABLE_METADATA,
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
