@AGENTS.md

## Claude Code specifics

- Topic rules in `.claude/rules/` load automatically when you work on matching files
  (generated from `docs/ai/` — don't edit them directly). If you're about to work in an area whose
  rule hasn't loaded yet, read the guide from `docs/ai/` first.
- MCP servers for this repo are declared in `.mcp.json` (`nx-mcp`, `angular-cli`). Prefer them for
  workspace and Angular API questions over web searches.
- Before finishing, run `npx nx affected -t lint test build` and report the result.
