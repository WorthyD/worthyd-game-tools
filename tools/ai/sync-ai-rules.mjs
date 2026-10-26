#!/usr/bin/env node
/**
 * Generates tool-specific agent instruction files from the single source of truth:
 *
 *   AGENTS.md            -> .github/copilot-instructions.md
 *   docs/ai/<topic>.md   -> .github/instructions/<topic>.instructions.md   (Copilot, `applyTo`)
 *                        -> .claude/rules/<topic>.md                      (Claude Code, `paths`)
 *
 * Each docs/ai/*.md file starts with frontmatter:
 *   ---
 *   description: one line
 *   globs: ["**\/*.spec.ts", ...]   # [] = always applies
 *   ---
 *
 * Usage:
 *   node tools/ai/sync-ai-rules.mjs          # write files
 *   node tools/ai/sync-ai-rules.mjs --check  # exit 1 if generated files are out of date (CI)
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SRC_DIR = join(root, 'docs', 'ai');
const COPILOT_DIR = join(root, '.github', 'instructions');
const CLAUDE_DIR = join(root, '.claude', 'rules');
const COPILOT_REPO_FILE = join(root, '.github', 'copilot-instructions.md');
const check = process.argv.includes('--check');

const banner = (src) =>
  `<!-- GENERATED from ${src} by tools/ai/sync-ai-rules.mjs — edit the source, then run \`npm run ai:sync\`. -->\n`;

function parse(file) {
  const raw = readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) throw new Error(`${relative(root, file)}: missing frontmatter`);
  const meta = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) meta[kv[1]] = kv[2].trim();
  }
  let globs = [];
  if (meta.globs) {
    try {
      globs = JSON.parse(meta.globs);
    } catch {
      throw new Error(`${relative(root, file)}: globs must be a JSON array, e.g. ["**/*.ts"]`);
    }
  }
  return { description: meta.description ?? '', globs, body: m[2].trimStart() };
}

// Topic docs link to each other as `foo.md`; make links valid from the generated locations.
const relinkFrom = (body, outDir) =>
  body.replace(/\(([\w-]+\.md)\)/g, (_, f) => `(${relative(outDir, join(SRC_DIR, f)).replace(/\\/g, '/')})`);

const outputs = new Map(); // abs path -> content

for (const name of readdirSync(SRC_DIR).filter((f) => f.endsWith('.md') && f !== 'README.md').sort()) {
  const topic = name.replace(/\.md$/, '');
  const src = `docs/ai/${name}`;
  const { description, globs, body } = parse(join(SRC_DIR, name));

  const applyTo = globs.length ? globs.join(',') : '**';
  outputs.set(
    join(COPILOT_DIR, `${topic}.instructions.md`),
    `---\ndescription: ${JSON.stringify(description)}\napplyTo: ${JSON.stringify(applyTo)}\n---\n` +
      banner(src) + '\n' + relinkFrom(body, COPILOT_DIR),
  );

  const paths = globs.length ? `paths:\n${globs.map((g) => `  - ${JSON.stringify(g)}`).join('\n')}\n` : '';
  outputs.set(
    join(CLAUDE_DIR, `${topic}.md`),
    `---\ndescription: ${JSON.stringify(description)}\n${paths}---\n` + banner(src) + '\n' + relinkFrom(body, CLAUDE_DIR),
  );
}

const agents = readFileSync(join(root, 'AGENTS.md'), 'utf8')
  .replace(/\]\((docs\/[^)]+)\)/g, '](../$1)');
outputs.set(COPILOT_REPO_FILE, banner('AGENTS.md') + '\n' + agents);

// Remove stale generated files (only ones carrying our banner).
const stale = [];
for (const dir of [COPILOT_DIR, CLAUDE_DIR]) {
  if (!existsSync(dir)) continue;
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (!outputs.has(p) && readFileSync(p, 'utf8').includes('GENERATED from docs/ai/')) stale.push(p);
  }
}

const changed = [...outputs].filter(([p, c]) => !existsSync(p) || readFileSync(p, 'utf8') !== c);

if (check) {
  if (changed.length || stale.length) {
    for (const [p] of changed) console.error(`out of date: ${relative(root, p)}`);
    for (const p of stale) console.error(`stale:       ${relative(root, p)}`);
    console.error('\nRun `npm run ai:sync` and commit the result.');
    process.exit(1);
  }
  console.log('AI instruction files are up to date.');
} else {
  for (const [p, c] of changed) {
    mkdirSync(dirname(p), { recursive: true });
    writeFileSync(p, c);
    console.log(`wrote   ${relative(root, p)}`);
  }
  for (const p of stale) {
    rmSync(p);
    console.log(`removed ${relative(root, p)}`);
  }
  if (!changed.length && !stale.length) console.log('Nothing to do — already in sync.');
}
