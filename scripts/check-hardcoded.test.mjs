import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
const script = fileURLToPath(new URL('./check-hardcoded.mjs', import.meta.url));
function fixture(fn) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'design-check-'));
  try { fn(root); } finally { fs.rmSync(root, { recursive: true, force: true }); }
}
const run = (...paths) => spawnSync(process.execPath, [script, ...paths], { encoding: 'utf8' });
test('missing and mixed-validity input paths fail without printing a successful scan', () => fixture(root => {
  fs.writeFileSync(path.join(root, 'clean.css'), 'color: var(--text);');
  for (const paths of [[path.join(root, 'missing')], [root, path.join(root, 'missing')]]) {
    const result = run(...paths);
    assert.equal(result.status, 2);
    assert.match(result.stderr, /paths do not exist/);
    assert.doesNotMatch(result.stdout, /No hard-coded/);
  }
}));
test('authored violations still fail and clean input passes', () => fixture(root => {
  const source = path.join(root, 'theme.css');
  fs.writeFileSync(source, 'color: var(--text);');
  assert.equal(run(root).status, 0);
  fs.writeFileSync(source, 'color: #ff0000;');
  assert.equal(run(root).status, 1);
}));
test('generated token sources remain excluded', () => fixture(root => {
  const generated = path.join(root, 'generated');fs.mkdirSync(generated);
  fs.writeFileSync(path.join(generated, 'tokens.css'), 'color: #ff0000;');
  assert.equal(run(root).status, 0);
}));
