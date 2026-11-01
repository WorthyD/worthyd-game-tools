---
status: accepted
date: 2026-11-01
decision-makers: Daniel
summary: Record architectural decisions as MADR files in docs/decisions/; a new architectural choice ships with a proposed ADR.
globs: []
enforced-by: review; ai-instructions.yml checks the generated files
superseded-by:
---

# Record architecture decisions as MADR files in docs/decisions

## Context and Problem Statement

The repo is worked on by a person and by AI agents (Claude Code and GitHub Copilot). Agents don't
remember earlier conversations, so decisions that only live in chat, PR threads or someone's head get
silently undone. Decisions need to live in the repo, in a form agents load automatically.

## Considered Options

- MADR files in `docs/decisions/`, fed to agents by `npm run ai:sync`
- Nygard-style ADRs with adr-tools or log4brains
- Keep decisions as prose in `AGENTS.md`
- A wiki outside the repo

## Decision Outcome

Chosen option: "MADR files in `docs/decisions/`, fed to agents by `npm run ai:sync`", because it keeps
decisions next to the code, reuses the existing instruction generator and CI check, and needs no new
dependencies.

- ADRs are `docs/decisions/NNNN-kebab-title.md`, created with `npm run adr:new -- "Title"`.
- Accepted ADRs are binding for agents. Proposed ADRs are context. Deprecated and superseded ADRs are history.
- A change that makes a new architectural choice (state management approach, runtime dependency,
  lib type or tag, test tooling, change detection, module system) adds a proposed ADR in the same change.
- Only a human sets `status: accepted`. Decisions change by superseding, not by rewriting.

### Consequences

- Good: agents see every binding decision in `AGENTS.md`, and the detail when they edit matching files.
- Good: the reasoning survives, so a decision can be revisited deliberately.
- Bad: one more step when making an architectural change.

### Confirmation

Code review. `npm run ai:check` (the `ai-instructions.yml` workflow) fails if the generated
instruction files are out of date.

## More Information

See [README.md](README.md) for the process and frontmatter fields.
