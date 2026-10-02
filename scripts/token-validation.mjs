export function resolveToken(tokens, value, seen = new Set()) {
  if (typeof value !== "string") return value;
  const match = value.match(/^\{(.+)\}$/);
  if (!match) return value;
  const path = match[1];
  if (seen.has(path)) throw new Error(`Cyclic token reference: ${path}`);
  const resolved = path.split(".").reduce((acc, key) => acc?.[key], tokens);
  if (resolved === undefined) throw new Error(`Unresolved token reference: ${value}`);
  return resolveToken(tokens, resolved, new Set([...seen, path]));
}

export function requireColorToken(tokens, value, path) {
  const resolved = resolveToken(tokens, value);
  if (typeof resolved !== "string" || !/^#[0-9a-fA-F]{6}$/.test(resolved)) {
    throw new Error(`Missing or invalid semantic color: ${path}`);
  }
  return resolved;
}
