import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("../../db/repositories/oauth-sessions.repo", () => ({
  oauthSessionsRepository: {},
}));

import { resolveEnvVariables } from "./utils";

const TEST_VARIABLE = "METAMCP_TEST_UPSTREAM_HEADER";

afterEach(() => {
  delete process.env[TEST_VARIABLE];
});

describe("resolveEnvVariables", () => {
  it("resolves an exact environment placeholder for upstream headers", () => {
    process.env[TEST_VARIABLE] = "private-value";

    expect(
      resolveEnvVariables({ "x-api-key": `\${${TEST_VARIABLE}}` }),
    ).toEqual({ "x-api-key": "private-value" });
  });

  it("preserves literals and unresolved placeholders", () => {
    expect(
      resolveEnvVariables({
        Accept: "application/json",
        "x-api-key": `\${${TEST_VARIABLE}}`,
      }),
    ).toEqual({
      Accept: "application/json",
      "x-api-key": `\${${TEST_VARIABLE}}`,
    });
  });
});
