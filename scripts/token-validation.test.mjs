import test from "node:test";
import assert from "node:assert/strict";
import { resolveToken, requireColorToken } from "./token-validation.mjs";

test("semantic colors fail closed for missing, malformed and dangling values", () => {
  for (const value of [undefined, null, 123, "#abc", "red", "{missing}"]) {
    assert.throws(() => requireColorToken({}, value, "ocean/dark/background"));
  }
  assert.equal(requireColorToken({ palette: { base: "#abcdef" }, alias: "{palette.base}" }, "{alias}", "background"), "#abcdef");
});
test("cyclic aliases produce a clear validation failure rather than stack overflow", () => {
  assert.throws(() => resolveToken({ a: "{b}", b: "{a}" }, "{a}"), /Cyclic token reference/);
  assert.throws(() => resolveToken({ a: "{a}" }, "{a}"), /Cyclic token reference/);
});
