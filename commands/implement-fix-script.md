---
description: Diagnose and heal a failing Playwright spec, then re-run the compliance and quality-scorecard checks (requires /qa-agents:init to have run first).
---

# Fix Playwright Script

**Trigger when user says** (any language/form): fix/sửa/heal script/spec/test, fix this, fix chô này, debug test, test bị lỗi, test đang fail.

---

You orchestrate test healing. Delegate execution + DOM inspection + audit to agents. Your job: classify, apply the right fix per priority, confirm.

## Step 1 — Load healing rules

Read [`.claude/docs/healing-rules.md`](../docs/healing-rules.md). The Golden Rules apply throughout: **execution before compliance, forward healing only, verify consequence not absence of error**.

## Step 2 — Capture failure via `spec-runner` agent

```
Run <spec-path> and return failure analysis.
```

Returns: failure type (P1.1 / P1.2 / P1.3 / P1.4 / P2), file:line, error wording, error-context.md highlights, likely root cause.

If PASS → tell user the test already passes. Skip to Step 5 for a compliance sweep anyway (catches latent P2 issues).

## Step 3 — Apply priority-matched fix via `code-fixer`

For P1.1/P1.3: if you don't know which POM owns the failing locator, spawn
`pom-discoverer` first to see the catalog. Then spawn `dom-inspector` for the
failing element — `code-fixer` has no browser tools and never guesses a
locator itself.

```
Classification: <P1.1 | P1.2 | P1.3 | P1.4>
Report snippet: <spec-runner's failure report>
Target file(s): <spec/POM path(s)>
Fresh locator: <from dom-inspector, required for P1.1/P1.3>
```

`code-fixer` reads `.claude/docs/healing-rules.md` itself for the fix
procedure — no need to restate the priority table here. It touches only the
failure point, never refactors passing code.

## Step 4 — Confirm execution via `spec-runner` re-run

```
Run <spec-path> and report pass/fail.
```

- FAIL → re-classify and loop Step 3.
- PASS → proceed to Step 5.

**Retry caps** (per [healing-rules.md](../docs/healing-rules.md#escalation-format)):
3 consecutive fails with the same classification, OR 5 total Step 3→4 cycles
regardless of classification (catches oscillating failures where the
classification keeps changing) → stop, surface using the Escalation Format
instead of looping forever.

## Step 5 — Compliance sweep via `compliance-checker` + `code-fixer`

```
Audit <spec-path> (POMs auto-discovered).
```

For each `✗` violation, spawn `code-fixer` with the classification
(`P2.<n>`) + violation row, then re-spawn `compliance-checker` to confirm. Loop
until `Verdict: clean`, capped at **5 iterations** — if still not clean, stop
and surface using the [Escalation Format](../docs/healing-rules.md#escalation-format).

**Do not stop until both `spec-runner` reports PASS AND `compliance-checker` reports clean.**

## Step 6 — Quality scorecard via `spec-evaluator` agent

```
Evaluate <spec-path> (3-run stability included).
```

Heal isn't done until quality is restored, not just execution. The agent returns scorecard + Verdict.

| Verdict | Action |
|---|---|
| `ship it.` (≥ 95) | Done. Surface scorecard to user. |
| `good, minor improvements possible.` (85–94) | Surface to user — ask if they want to apply top suggestions. |
| `needs attention.` (70–84) | Apply top 2 fixes, re-run `spec-evaluator`. Loop until ≥ 85. |
| `do NOT commit.` (< 70) | Stop, surface using the [Escalation Format](../docs/healing-rules.md#escalation-format) — likely deeper issue surfaced by healing. |

If stability < 100% (intermittent pass): the fix may have masked a race condition. Re-examine timing per `healing-rules §P1.2`.

## Step 7 — Stale-cache check (if a correct-looking fix doesn't take effect)

See [§Stale-cache](../docs/healing-rules.md#stale-cache-troubleshooting).
