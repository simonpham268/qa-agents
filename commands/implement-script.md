---
description: Convert an existing test-case markdown file into a passing, compliant Playwright spec (requires /qa-agents:init to have run first).
---

# Implement Playwright Script from TC

**Trigger when user says** (any language/form): implement script, gen/write/code/automate script/spec/TC, convert TC to code, viết script, viết playwright, tạo script, code TC này.

---

You orchestrate spec generation from a TC markdown file. Delegate heavy work to agents — your job is to compose the spec and confirm it works.

## Step 0 — Prerequisite check

Check for `.claude/qa-agents.config.json` in this project. If it's missing, stop and tell the user to run `/qa-agents:init` first — `pom-discoverer`, `pom-author`, and `compliance-checker` all depend on it.

## Step 1 — Load context

Read in this order:
1. The TC file — `<casesDir>/<feature>.md` (from config)
2. `.claude/docs/framework-rules.md` (if the project has one) — conventions the spec MUST follow
3. `.claude/docs/intent-mapping.md` (if the project has one) — TC phrasing → method names

From the TC, extract:
- **Feature area**: matches a `<casesDir>/<feature>` area
- **Step sequence** + expected outcomes
- **Test data + intents needed** (list method names you'll call)

## Step 2 — Inspect live DOM via `dom-inspector` agent

Spawn with URL(s) + target elements. Skip only if app unreachable — then flag locators `// TODO: verify`.

## Step 3 — Discover existing POMs via `pom-discoverer` agent

```
Discover <pomDir>. Intents needed: <list from Step 1>.
```

The agent returns: available class+method catalog + which intents are missing + suggested new POM file paths.

## Step 4 — Author missing POMs via `pom-author` agent (if needed)

For each missing POM in Step 3's output, spawn `pom-author`:

```
Create <pomDir>/<file>.page.ts:
- className: <Name>Page
- locators: <table from dom-inspector Step 2>
- methods: [
    { name: '<methodName>', signature: '(): Promise<void>', description: '...', body: '...' },
    ...
  ]
```

Agent writes the file. Returns summary. Repeat for each missing POM.

## Step 5 — Compose the spec directly

Using the TC (Step 1) and the method catalog (Step 3/4), write
`<specDir>/<feature>.spec.ts` yourself — no agent spawn for this step:

1. Map each TC step to one method call from the catalog — but check
   `intent-mapping.md` §4 (if the project has one) FIRST: a contiguous run of
   steps hitting sibling fields in the same section, each with only a
   trivial per-field Expected, collapses to ONE composite method call, not
   one call per step (Trigger B). If a step's (or group's) intent has no
   matching method, STOP mapping it — do NOT invent one. Go back to Step 3/4
   to fill the missing POM method, then resume here.
2. Compose the spec per `.claude/docs/framework-rules.md` (if present) and
   the `rules.*` flags in the config:
   - Import from `fixtureImport` (config) if the spec uses a fixture (e.g.
     an API client), else the plain test-runner import.
   - Test header/name format per config's `testHeaderFormat`, if set.
   - If `rules.noPageDotInSpec` — body is POM method calls + assertions
     only, no direct low-level interaction calls.
   - If `rules.mandatoryTestStep` — no step-wrapper calls at the spec level
     (POM methods wrap internally) and no step comments.
   - Every value passed as a POM method argument is a named `const` declared
     at the top of the test, never a raw literal typed at the call site
     — *(only if this convention is confirmed for the project; check
     framework-rules.md first)*.
3. `Write` the file to the output spec path.

## Step 6 — Confirm execution via `spec-runner` + `code-fixer` (fix loop)

Execution before compliance (healing-rules Golden Rule) — this runs BEFORE Step 7.

```
Run <specDir>/<feature>.spec.ts and report pass/fail.
```

- **PASS** → Step 7.
- **FAIL** → spawn `code-fixer` with `spec-runner`'s classification + report
  (for P1.1/P1.3, first spawn `dom-inspector` for the failing element and pass
  its fresh locator — `code-fixer` never guesses one itself), then
  re-spawn `spec-runner` to confirm. Loop until PASS.

See `.claude/docs/healing-rules.md` for the full P1.1–P1.4 priority
playbook (`code-fixer` reads it directly) and the retry caps: **3
consecutive fails with the same classification, or 5 total fix-cycles** →
stop, surface using the Escalation Format.

## Step 7 — Audit via `compliance-checker` + `code-fixer` (fix loop)

Only reached once Step 6 confirms PASS.

```
Audit <specDir>/<feature>.spec.ts (POMs auto-discovered from imports).
```

Agent walks its config-gated P2 checklist. For each `✗` violation, spawn
`code-fixer` with the classification (`P2.<n>`) + violation row, then
re-spawn `compliance-checker` to confirm. Loop until `Verdict: clean`,
capped at **5 iterations** — if still not clean, stop and surface using the
Escalation Format.

## Step 8 — Quality scorecard via `spec-evaluator` agent

```
Evaluate <specDir>/<feature>.spec.ts against <casesDir>/<feature>.md (3-run stability).
```

The agent runs the spec 3 times (stability check), measures code metrics + coverage + lint, and returns a multi-dimensional scorecard with `Verdict`.

| Verdict | Action |
|---|---|
| `ship it.` (≥ 95) | Done. Show user the scorecard + spec path. |
| `good, minor improvements possible.` (85–94) | Show user. Ask if they want to apply suggestions or commit as-is. |
| `needs attention.` (70–84) | Apply top 2 fixes from the report, re-run `spec-evaluator`. Loop until ≥ 85. |
| `do NOT commit.` (< 70) | Stop, surface using the Escalation Format — likely model output drifted from rules, needs human review. |

For unstable specs (stability < 100% in 3 runs): consider adding a settle wait before assertion, or extending element-wait timeouts. See `healing-rules §P1.2`.
