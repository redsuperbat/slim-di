import { createContainer } from "../src/di-container";
import { Injectable } from "../src/injectable";

@Injectable()
class ScratchPole {}
@Injectable()
class Fish {}

@Injectable()
class Cat {
  constructor(
    private readonly food: Fish,
    private readonly pole: ScratchPole
  ) {}
}

@Injectable()
class DogFood {
  type = "Meat!";
}

@Injectable()
class Dog {
  constructor(public readonly food: DogFood) {}
}

@Injectable()
class Root {
  constructor(private readonly cat: Cat, private readonly dog: Dog) {}

  setDogFood(type: string) {
    this.dog.food.type = type;
  }

  logDogFood() {
    console.log(this.dog.food);
  }
}

describe("test", () => {
  it("Should be working", () => {
    const container = createContainer(Root);

    const root = container.get(Root);
    root.logDogFood();
    root.setDogFood("Fishyfish!");

    container.get(Root).logDogFood();

    expect(container.get(Root)).toBeDefined();
    expect(container.get(DogFood)).toBeInstanceOf(DogFood);
  });
});
