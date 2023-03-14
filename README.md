# Slim DI

Minimalistic DI library weighing in at only 695 Bytes. Built for usage with decorators.

## Installation

```
npm i slim-di
```

## Usage

`slim-di` uses typescript and classes to handle dependency injection. 
The first thing you need to do is declare your root class. By default `slim-di` creates a single instance of each class in the program.


```ts
import { Injectable, createContainer } from 'slim-di';

@Injectable()
class FishingPole {}
@Injectable()
class FishingHook {}

@Injectable()
class FishingGear {
  constructor(
    private readonly pole: FishingPole,
    private readonly hook: FishingHook
  ) {}
}

@Injectable()
class FishingBoat {}

@Injectable()
class FisherManRoot {
  constructor(
    private readonly gear: FishingGear, 
    private readonly boat: FishingBoat
  ){}
}


async function main(){
  const container = createContainer(FisherManRoot);
  // Logs true
  console.log(container.get(FishingBoat) === container.get(FishingBoat))
}
main()
```

## Lifecycle hooks

`slim-di` exposes one lifecycle hook called `onInstantiation` which triggers during instantiation and can be used to connect to databases or other init-work. To trigger the hook on your class instance you must call the `DIContainer.init` method.

```ts
import { PrismaClient } from 'prisma';
import { Injectable } from 'slim-di';

@Injectable()
export class Prisma extends Prisma implements OnInstantiation {
  async onInstantiation() {
    await this.$connect();
  }
};


async function main() {
  const container = await createContainer(Prisma).init();
  const data = await container.get(Prisma).entity.findMany();
}

```


## Examples
Here is a small example using an express server and prisma.

```ts
import { Injectable } from 'slim-di';
import express from 'express';
import { PrismaClient } from 'prisma';

@Injectable()
export class Prisma extends Prisma implements OnInstantiation {
  async onInstantiation() {
    await this.$connect();
  }
};

@Injectable()
export class ExpressClient {
  private app = express();
}


@Injectable()
export class UserRouter implements OnInstantiation {
  constructor(
    private readonly express: ExpressClient, 
    private readonly prisma: Prisma,
  ){}

  onInstantiation(){
    this.express.get("/users", async (req, res) => {
      const users = await this.prisma.users.findMany();
      res.json(users);
    });
  }
}


@Injectable()
export class MyApplication implements OnInstantiation {
  constructor(private readonly express: ExpressClient){}

  private port = 3000;

  onInstantiation() {
    this.express.app.listen(this.port, () => {
      console.log("Listening on port", this.port);
    })
  }

}


async function main(){
  const container = await createContainer().init();
}

```