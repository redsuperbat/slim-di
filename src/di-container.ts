import { INJECTABLE_METADATA } from "./tokens";
import { hasInstantiationHook, Type } from "./types";

export interface DIContainer {
  get<T = unknown>(token: Type<T>): T;
  init(): Promise<void>;
}

export const createContainer = async <T>(
  root: Type<T>
): Promise<DIContainer> => {
  const container = new Map<Type, any>();

  const instantiateDeps = (token: Type): Promise<unknown> => {
    if (!Reflect.hasMetadata(INJECTABLE_METADATA, token)) {
      throw new Error(
        "Trying to inject a dependency which is not annotated with the @Injectable decorator"
      );
    }
    const dependencyMetadata: Type[] =
      Reflect.getMetadata(INJECTABLE_METADATA, token) ?? [];
    const instance =
      container.get(token) ??
      new token(...dependencyMetadata.map((it) => instantiateDeps(it)));
    container.set(token, instance);
    return instance;
  };

  instantiateDeps(root);

  return {
    get(token) {
      return container.get(token);
    },
    async init() {
      for (const [, instance] of container.entries()) {
        if (!hasInstantiationHook(instance)) continue;
        await instance.onInstantiation();
      }
    },
  };
};
