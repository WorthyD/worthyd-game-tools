# AI agent configuration

One set of docs, consumed by both **Claude Code** and **GitHub Copilot**.

```
AGENTS.md                         ← source: repo overview, commands, golden rules
docs/ai/<topic>.md                ← source: Nx, Angular, Material, Tailwind, NgRx, Jest, Cypress guides
tools/ai/sync-ai-rules.mjs        ← generator

CLAUDE.md                         → imports AGENTS.md (hand-written, tiny)
.claude/rules/<topic>.md          → GENERATED, path-scoped via `paths:` frontmatter
.claude/settings.json             → permissions for nx/npm/git read commands; enables the MCP servers
.mcp.json                         → MCP servers for Claude Code (nx-mcp, Angular CLI)

.github/copilot-instructions.md   → GENERATED copy of AGENTS.md
.github/instructions/<topic>.instructions.md → GENERATED, path-scoped via `applyTo:`
.vscode/mcp.json                  → MCP servers for Copilot in VS Code
.github/workflows/ai-instructions.yml → fails a PR if generated files are stale
```

Copilot's coding agent also reads `AGENTS.md` directly.

Nx Console separately generates `.github/instructions/nx.instructions.md` (gitignored, because
`nxConsole.generateAiAgentRules` is on). Our Nx guide is named `nx-workspace` so the two never
collide, and the sync script never touches files it didn't generate.

## Editing

1. Edit `AGENTS.md` or a file in `docs/ai/`. Each topic file's frontmatter controls where it applies:

   ```yaml
   ---
   description: One-line summary
   globs: ["**/*.spec.ts"]     # [] means "always"
   ---
   ```

2. `npm run ai:sync` to regenerate.
3. Commit sources and generated files together. `npm run ai:check` (also run in CI) catches drift.

## Adding a topic

Create `docs/ai/<topic>.md` with frontmatter, add a row to the table in `AGENTS.md`, run the sync.

## Keeping it lean

Agents load these files into context. Keep guides to rules and short examples this repo actually
needs, and update them when the repo changes (e.g. after a migration to zoneless or Vitest).
