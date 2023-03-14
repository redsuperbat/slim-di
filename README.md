# Slim DI

Minimalistic DI library weighing in at <1 kB. Built for usage with decorators and `reflect-metadata`.

## Installation

```
npm i slim-di
```

## Usage

`slim-di` uses typescript and classes to handle dependency injection. 
The first thing you need to do is declare your root class. By default `slim-di` creates a single instance of each class in the program.


```ts
import "reflect-metadata";

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

`slim-di` exposes one lifecycle hook called `onInit` which triggers during instantiation and can be used to connect to databases or other init-work. To trigger the hook on your class instance you must call the `DIContainer.init` method.

```ts
import { PrismaClient } from "@prisma/client";
import { Injectable, createContainer } from 'slim-di';

@Injectable()
export class Prisma extends PrismaClient implements OnInit {
  async onInit() {
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
import "reflect-metadata";

import { PrismaClient } from "@prisma/client";
import express from "express";
import { createContainer, Injectable } from "slim-di";
import { OnInit } from "slim-di/types";

@Injectable()
export class Prisma extends PrismaClient implements OnInit {
  async onInit() {
    console.log("Connecting to prisma...");
    await this.$connect();
    console.log("Connected!");
  }
}

@Injectable()
export class ExpressClient {
  public app = express();
}

@Injectable()
export class UserRouter {
  constructor(
    private readonly express: ExpressClient,
    private readonly prisma: Prisma
  ) {}

  register() {
    this.express.app.get("/users", async (_, res) => {
      const users = await this.prisma.user.findMany();
      res.json(users);
    });
  }
}

@Injectable()
export class MyApplication implements OnInit {
  constructor(
    private readonly express: ExpressClient,
    private readonly userRouter: UserRouter
  ) {}

  private port = 3000;

  onInit() {
    this.userRouter.register();
    this.express.app.listen(this.port, () => {
      console.log("Listening on port", this.port);
    });
  }
}

async function main() {
  await createContainer(MyApplication).init();
}

main();
```