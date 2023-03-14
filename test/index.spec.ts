import { describe, expect, it } from "vitest";
import { mod } from "../src";

describe("test", () => {
  it("Should be working", () => {
    expect(mod).toEqual("hello world");
  });
});
