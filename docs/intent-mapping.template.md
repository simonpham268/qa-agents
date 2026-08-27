# Intent Mapping — Natural Language → POM Method

> Translates TC step phrasing into POM method calls, for **this project**.
> Written by `/qa-agents:init` — Section 1 below is generic and rarely needs
> editing; Section 2 onward should reflect this project's REAL pages/methods,
> not invented examples. Companion files:
> - Framework conventions: [`framework-rules.md`](./framework-rules.md)
> - Healing/troubleshooting: [`healing-rules.md`](./healing-rules.md)

---

## 1. Global Keyword Recognition

Same keywords across all pages — do not repeat per page. This section is
app-agnostic and should not need project-specific edits.

| Action | Keywords (any tense/form) | Method Pattern |
|--------|---------------------------|----------------|
| Text Input | fill, enter, type, input, set, write, put | `fill*(value)` |
| Dropdown | select, choose, pick, set…to, change…to | `select*(value)` |
| Checkbox ON | check, tick, enable, turn on, activate | `set*(true)` |
| Checkbox OFF | uncheck, untick, disable, turn off, deactivate | `set*(false)` |
| Click | click, press, hit, tap, push | `click*()` |
| Toggle | toggle, switch, flip | `toggle*()` |
| Navigate | go to, navigate to, open, access, visit | `navigateTo*()` / `goTo*()` |
| Search | search, find, look up, query, filter | `search(value)` |
| Verify | verify, assert, check, confirm, validate, ensure, expect | `assert*()` |
| Get | get, retrieve, read, obtain, fetch | `get*()` |
| Save | save, submit, confirm, create | `save()` / `clickSave()` |
| Cancel | cancel, discard, abort, go back | `cancel()` / `clickCancel()` |

**Example**: TC writes "enter username 'admin'" → match "enter" → Text Input → `fillUsername('admin')`.

---

## 2. Project Method Patterns

<!-- /qa-agents:init: fill this from REAL POMs discovered in Step 1 (via
     pom-discoverer or a direct Glob+Read). Do not invent page names or
     methods — if the project has no POMs yet, leave this section as a
     single TODO row and let it grow as pom-author creates real ones. -->

| TC intent | Method |
|---|---|
| *(none recorded yet — populate from real POMs, or leave empty for a brand-new project)* | |

### URL Patterns

<!-- /qa-agents:init: list only routes actually confirmed (via dom-inspector
     or reading the app's router config), never guessed from a feature name. -->

| Page | URL |
|---|---|
| *(none confirmed yet)* | |

---

## 3. Reusable Method Templates

These naming patterns are common across most POM-based Playwright projects
and can usually be kept as-is, but confirm against what this project's real
methods actually look like:

### Form page

| Intent | Method |
|---|---|
| open form | `goTo{Form}()` / `navigateTo{Form}()` |
| fill all fields with data | `fill{Entity}Form(data)` |
| submit | `save()` / `clickSubmit()` |
| cancel | `cancel()` / `clickCancel()` |
| high-level create | `create{Entity}(data)` — fill + submit |
| verify error "X" | `assertValidationError('X')` |
| verify success | `assertSubmittedSuccessfully()` |

### List page

| Intent | Method |
|---|---|
| open page | `navigateTo{Section}()` |
| verify entity "X" displayed | `assert{Entity}Displayed('X', ...)` |
| click entity by name | `click{Entity}ByName('X')` |
| click row N | `clickRowByIndex(N-1)` |
| get all visible entities | `getAllVisible{Entities}()` |

---

## 4. Multi-step Collapse Rule

Two triggers. Both produce the same shape: one composite POM method call in
the spec, even though the **TC file itself stays atomic** (one action + one
Expected per TC step — collapsing happens at the POM/spec layer, not by
rewriting the TC).

### Trigger A — TC already groups sub-steps under one numbered step

Form fills, multi-click sequences, modal workflows written as a single
parent step with numbered sub-actions collapse to one composite method call
taking a data object, instead of one call per sub-action.

### Trigger B — Consecutive TC steps hit sibling fields in the same section

Each step is written separately (satisfies the "one action + one Expected"
TC rule) but they act on sibling fields of the same form/section, and each
step's Expected is a local, trivial check (value entered, no validation
error). Same collapse applies — one composite method covering fill + per-
field validation.

**Do NOT delete the atomic per-field methods** when adding a composite —
negative/targeted TCs still need to call one field in isolation. Author the
composite ALONGSIDE the atomics, not instead of them.

**If method doesn't exist**: write `// TODO: implement {methodName}(data)` and flag to user. Do NOT invent sub-calls.

---

## 5. Page Object Discovery

Per-page method lists are **not maintained here** — they drift. Discover from source (or delegate to the `pom-discoverer` agent):

### Discovery procedure

1. Read `.claude/qa-agents.config.json` for `pomDir`.
2. `Glob <pomDir>/*.page.ts` (or the matching extension), skipping the configured base/parent POM class.
3. `Read` the matching file(s).
4. Extract `async` method signatures — these are the only callable methods.
5. **Use exact method names** in the spec — never invent.

If a needed method does not exist → add `// TODO: implement {methodName}(...)` in the spec and tell the user. Do NOT create the method during spec generation.
