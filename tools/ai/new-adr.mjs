#!/usr/bin/env node
/**
 * Creates the next architecture decision record from docs/decisions/adr-template.md.
 *
 * Usage:
 *   npm run adr:new -- "Use SignalStore for new Craft Cart state"
 *
 * The new ADR starts as `status: proposed`. Fill it in, have a human accept it, then run
 * `npm run ai:sync` so agents pick it up.
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const ADR_DIR = join(root, 'docs', 'decisions');
const TEMPLATE = join(ADR_DIR, 'adr-template.md');

const title = process.argv.slice(2).join(' ').trim();
if (!title) {
  console.error('Usage: npm run adr:new -- "Short decision title"');
  process.exit(1);
}

const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .slice(0, 60)
  .replace(/-+$/, '');
if (!slug) {
  console.error('The title needs at least one letter or digit.');
  process.exit(1);
}

const numbers = readdirSync(ADR_DIR)
  .map((f) => f.match(/^(\d{4})-/))
  .filter(Boolean)
  .map((m) => Number(m[1]));
const num = String((numbers.length ? Math.max(...numbers) : 0) + 1).padStart(4, '0');

const file = join(ADR_DIR, `${num}-${slug}.md`);
if (existsSync(file)) {
  console.error(`${relative(root, file)} already exists.`);
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
const content = readFileSync(TEMPLATE, 'utf8')
  .replace(/\r\n/g, '\n')
  .replace(/^status: .*$/m, 'status: proposed')
  .replace(/^date: .*$/m, `date: ${today}`)
  .replace(/^# .*$/m, `# ${title}`);

writeFileSync(file, content);
console.log(`created ${relative(root, file).replace(/\\/g, '/')}`);
console.log('Fill it in, then run `npm run ai:sync`. Only a human changes the status to accepted.');
