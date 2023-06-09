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
