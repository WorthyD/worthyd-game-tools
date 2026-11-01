---
status: proposed
date: YYYY-MM-DD
decision-makers: Daniel
summary: One sentence an agent can follow without reading the rest, e.g. "New Craft Cart state uses NgRx SignalStore."
globs: []
enforced-by: review
superseded-by:
---

# Short title of the decision, phrased as the choice made

## Context and Problem Statement

Two or three sentences: what forced a decision, and any constraint that matters.

## Considered Options

- Option A
- Option B

## Decision Outcome

Chosen option: "Option A", because the deciding reason.

Write the decision as rules an agent can apply directly. Keep it short: this section is what gets
loaded into agents' context when they edit files matching `globs`.

### Consequences

- Good: ...
- Bad: ...

### Confirmation

How compliance is checked: the lint rule or test that enforces it, or "code review" if nothing can.

## More Information

Optional: links, related ADRs, when to revisit this decision.
