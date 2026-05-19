import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

const config: Config = {
  testEnvironment: "node",
  coverageProvider: "v8",
  collectCoverageFrom: ["lib/**/*.ts", "!lib/**/*.d.ts"],
};

export default createJestConfig(config);
