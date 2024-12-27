import dotenv from "dotenv";
import { describe, expect, it } from "vitest";

dotenv.config();

describe("Load Env Variables", () => {
  it("should be able to load test env variables", () => {
    expect(process.env.NODE_ENV).toBeDefined();
    expect(process.env.JWT_SECRET).toBeDefined();
  })
});