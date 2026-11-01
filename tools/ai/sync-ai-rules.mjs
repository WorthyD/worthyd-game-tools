#!/usr/bin/env node
/**
 * Generates tool-specific agent instruction files from the single source of truth:
 *
 *   AGENTS.md                -> .github/copilot-instructions.md
 *   docs/ai/<topic>.md       -> .github/instructions/<topic>.instructions.md   (Copilot, `applyTo`)
 *                            -> .claude/rules/<topic>.md                      (Claude Code, `paths`)
 *   docs/decisions/NNNN-*.md -> index block inside AGENTS.md                  (accepted ADRs, always loaded)
 *                            -> index block inside docs/decisions/README.md   (all ADRs)
 *                            -> .github/instructions/adr-NNNN-*.instructions.md and
 *                               .claude/rules/adr-NNNN-*.md                   (accepted ADRs with globs)
 *
 * Each docs/ai/*.md file starts with frontmatter:
 *   ---
 *   description: one line
 *   globs: ["**\/*.spec.ts", ...]   # [] = always applies
 *   ---
 *
 * Each ADR starts with frontmatter (see docs/decisions/README.md):
 *   ---
 *   status: accepted                 # proposed | accepted | deprecated | superseded
 *   date: 2026-11-01
 *   decision-makers: Daniel
 *   summary: One-line statement of the rule agents must follow.
 *   globs: ["libs/craft-cart/**"]    # [] = everywhere (index only, no path-scoped rule)
 *   enforced-by: review              # or a lint rule / test
 *   superseded-by:                   # required when status is superseded, e.g. 0012
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
const ADR_DIR = join(root, 'docs', 'decisions');
const ADR_README = join(ADR_DIR, 'README.md');
const AGENTS_FILE = join(root, 'AGENTS.md');
const COPILOT_DIR = join(root, '.github', 'instructions');
const CLAUDE_DIR = join(root, '.claude', 'rules');
const COPILOT_REPO_FILE = join(root, '.github', 'copilot-instructions.md');
const check = process.argv.includes('--check');

const ADR_FILE = /^(\d{4})-([\w-]+)\.md$/;
const ADR_STATUSES = ['proposed', 'accepted', 'deprecated', 'superseded'];
const INDEX_START = '<!-- adr-index:start';
const INDEX_END = '<!-- adr-index:end -->';

const banner = (src) =>
  `<!-- GENERATED from ${src} by tools/ai/sync-ai-rules.mjs — edit the source, then run \`npm run ai:sync\`. -->\n`;

const errors = [];

function parse(file) {
  const raw = readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) throw new Error(`${relative(root, file)}: missing frontmatter`);
  const meta = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([\w-]+):\s*(.*)$/);
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
  return { meta, description: meta.description ?? '', globs, body: m[2].trimStart() };
}

// Docs link to siblings as `foo.md`; make links valid from the generated locations.
const relinkFrom = (body, outDir, srcDir = SRC_DIR) =>
  body.replace(/\(([\w-]+\.md)\)/g, (_, f) => `(${relative(outDir, join(srcDir, f)).replace(/\\/g, '/')})`);

// Replace (or check) the generated block between the index markers in a hand-written file.
function withIndexBlock(file, block) {
  const text = readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  const start = text.indexOf(INDEX_START);
  const end = text.indexOf(INDEX_END);
  if (start === -1 || end === -1 || end < start) {
    errors.push(`${relative(root, file)}: missing "${INDEX_START} … -->" / "${INDEX_END}" markers`);
    return text;
  }
  const startLineEnd = text.indexOf('\n', start) + 1;
  return text.slice(0, startLineEnd) + block + text.slice(end);
}

const outputs = new Map(); // abs path -> content

// ---------------------------------------------------------------------------------------------
// Topic guides (docs/ai)
// ---------------------------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------------------------
// Architecture decision records (docs/decisions)
// ---------------------------------------------------------------------------------------------
const adrs = [];
if (existsSync(ADR_DIR)) {
  for (const name of readdirSync(ADR_DIR).filter((f) => ADR_FILE.test(f)).sort()) {
    const [, num, slug] = name.match(ADR_FILE);
    const src = `docs/decisions/${name}`;
    const { meta, globs, body } = parse(join(ADR_DIR, name));
    const title = (body.match(/^# (.+)$/m) ?? [])[1]?.trim() ?? slug;
    const status = (meta.status ?? '').toLowerCase();
    const adr = { num, slug, name, src, title, status, globs, body, meta };

    if (!ADR_STATUSES.includes(status)) errors.push(`${src}: status must be one of ${ADR_STATUSES.join(', ')}`);
    if (status === 'accepted' && !meta.summary) errors.push(`${src}: accepted ADRs need a one-line "summary"`);
    if (status === 'superseded' && !/^\d{4}$/.test(meta['superseded-by'] ?? ''))
      errors.push(`${src}: superseded ADRs need "superseded-by: NNNN"`);
    if (adrs.some((a) => a.num === num)) errors.push(`${src}: duplicate ADR number ${num}`);
    adrs.push(adr);
  }
}
for (const a of adrs.filter((x) => x.status === 'superseded' && /^\d{4}$/.test(x.meta['superseded-by'] ?? ''))) {
  if (!adrs.some((x) => x.num === a.meta['superseded-by']))
    errors.push(`${a.src}: superseded-by ${a.meta['superseded-by']} does not exist`);
}

const accepted = adrs.filter((a) => a.status === 'accepted');
const scope = (globs) => (globs.length ? globs.map((g) => `\`${g}\``).join(', ') : 'everywhere');
const cell = (s) => String(s ?? '').replace(/\|/g, '\\|');

// Pull "## Decision Outcome" (with its ### subsections) out of an ADR body.
function decisionSection(body) {
  const m = body.match(/^## Decision Outcome[^\n]*\n([\s\S]*?)(?=^## |(?![\s\S]))/m);
  return m ? m[1].trim() : '';
}

// Index block for AGENTS.md: accepted ADRs only, one line each (always in agents' context).
const agentsIndex = accepted.length
  ? '| ADR | Decision | Applies to |\n|---|---|---|\n' +
    accepted
      .map((a) => `| [${a.num}](docs/decisions/${a.name}) | ${cell(a.meta.summary)} | ${scope(a.globs)} |`)
      .join('\n') +
    '\n'
  : '_No accepted ADRs yet._\n';

// Index block for docs/decisions/README.md: every ADR, any status.
const readmeIndex = adrs.length
  ? '| ADR | Title | Status | Date |\n|---|---|---|---|\n' +
    adrs
      .map((a) => {
        const status = a.status === 'superseded' ? `superseded by ${a.meta['superseded-by']}` : a.status;
        return `| ${a.num} | [${cell(a.title)}](${a.name}) | ${status} | ${a.meta.date ?? ''} |`;
      })
      .join('\n') +
    '\n'
  : '_No ADRs yet._\n';

if (existsSync(ADR_README)) outputs.set(ADR_README, withIndexBlock(ADR_README, readmeIndex));

// Path-scoped rules: accepted ADRs with globs load their decision when matching files are edited.
for (const a of accepted.filter((x) => x.globs.length)) {
  const base = `adr-${a.num}-${a.slug}`;
  const description = `ADR ${a.num} (binding): ${a.meta.summary}`;
  const content = (outDir) =>
    banner(a.src) +
    `\n# ADR ${a.num}: ${a.title}\n\n` +
    `**Status: accepted — binding.** ${a.meta.summary}\n\n` +
    `If your task conflicts with this decision, stop and say so instead of working around it. ` +
    `Full record: [${a.name}](${relative(outDir, join(ADR_DIR, a.name)).replace(/\\/g, '/')}).\n\n` +
    relinkFrom(decisionSection(a.body), outDir, ADR_DIR).replace(/^###? /gm, '## ') +
    '\n';

  outputs.set(
    join(COPILOT_DIR, `${base}.instructions.md`),
    `---\ndescription: ${JSON.stringify(description)}\napplyTo: ${JSON.stringify(a.globs.join(','))}\n---\n` +
      content(COPILOT_DIR),
  );
  outputs.set(
    join(CLAUDE_DIR, `${base}.md`),
    `---\ndescription: ${JSON.stringify(description)}\npaths:\n${a.globs.map((g) => `  - ${JSON.stringify(g)}`).join('\n')}\n---\n` +
      content(CLAUDE_DIR),
  );
}

// ---------------------------------------------------------------------------------------------
// AGENTS.md (with the ADR index) -> copilot-instructions.md
// ---------------------------------------------------------------------------------------------
const agentsText = withIndexBlock(AGENTS_FILE, agentsIndex);
outputs.set(AGENTS_FILE, agentsText);
outputs.set(COPILOT_REPO_FILE, banner('AGENTS.md') + '\n' + agentsText.replace(/\]\((docs\/[^)]+)\)/g, '](../$1)'));

if (errors.length) {
  for (const e of errors) console.error(`error: ${e}`);
  process.exit(1);
}

// Remove stale generated files (only ones carrying our banner).
const stale = [];
for (const dir of [COPILOT_DIR, CLAUDE_DIR]) {
  if (!existsSync(dir)) continue;
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (!outputs.has(p) && /GENERATED from docs\/(ai|decisions)\//.test(readFileSync(p, 'utf8'))) stale.push(p);
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
