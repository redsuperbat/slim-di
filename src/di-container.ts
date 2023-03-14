import { INJECTABLE_METADATA } from "./tokens";
import { hasInstantiationHook, Type } from "./types";

export interface DIContainer {
  get<T = unknown>(token: Type<T>): T;
}

export const createContainer = async <T>(
  root: Type<T>
): Promise<DIContainer> => {
  const container = new Map<Type, any>();

  const instantiateDeps = async (token: Type): Promise<unknown> => {
    if (!Reflect.hasMetadata(INJECTABLE_METADATA, token)) {
      throw new Error(
        "Trying to inject a dependency which is not annotated with the @Injectable decorator"
      );
    }

    const dependencyMetadata: Type[] =
      Reflect.getMetadata(INJECTABLE_METADATA, token) ?? [];
    const dependencies = await Promise.all(
      dependencyMetadata.map((it) => instantiateDeps(it))
    );
    const instance = container.get(token) ?? new token(...dependencies);
    container.set(token, instance);
    if (hasInstantiationHook(instance)) {
      await instance.onInstantiation();
    }
    return instance;
  };

  await instantiateDeps(root);

  return {
    get(token) {
      return container.get(token);
    },
  };
};
