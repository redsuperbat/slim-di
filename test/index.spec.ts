import { createContainer, DIContainer } from "../src/di-container";
import { Injectable } from "../src/injectable";
import { OnInit } from "../src/types";

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
class Dog implements OnInit {
  constructor(public readonly food: DogFood) {}
  public counter = 0;
  onInit() {
    this.counter += 1;
  }
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

@Injectable()
class SelfReferencingRoot {
  constructor(private readonly root: SelfReferencingRoot) {}
}

describe("slim-di", () => {
  let container: DIContainer;

  beforeEach(async () => {
    container = createContainer(Root);
  });

  it("Instantiates the classes correctly", () => {
    expect(container.get(Root)).toBeDefined();
    expect(container.get(DogFood)).toBeInstanceOf(DogFood);
  });

  it("Should only create singletons", () => {
    expect(container.get(Root)).toEqual(container.get(Root));
  });

  it("Should not be able to create circular references", async () => {
    expect(() => createContainer(SelfReferencingRoot)).toThrowError(RangeError);
  });

  it("Should trigger the onInit hook", async () => {
    const dog = container.get(Dog);
    expect(dog.counter).toBe(0);
    await container.init();
    expect(dog.counter).toBe(1);
  });
});
