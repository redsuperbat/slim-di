import { describe, expect, it } from "vitest";
import { Inject } from "../src";
import { createContainer } from "../src/di-container";
import { Injectable } from "../src/injectable";

@Injectable()
class ScratchPole {}
@Injectable()
class Fish {}

@Injectable()
class Cat {
  constructor(
    @Inject(Fish)
    private readonly food: Fish,
    @Inject(ScratchPole)
    private readonly pole: ScratchPole
  ) {}
}

@Injectable()
class DogFood {}

@Injectable()
class Dog {
  constructor(
    @Inject(DogFood)
    private readonly food: DogFood
  ) {}
}

@Injectable()
class Root {
  constructor(
    @Inject(Cat)
    private readonly cat: Cat,
    @Inject(Dog)
    private readonly dog: Dog
  ) {}
}

describe("test", () => {
  it("Should be working", () => {
    const container = createContainer(Root);

    expect(container.get(Root)).toBeDefined();
    expect(container.get(DogFood)).toBeInstanceOf(DogFood);
  });
});
