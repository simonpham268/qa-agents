# Framework Rules — Playwright Automation

> Conventions all specs + POMs must follow in **this project**. Written by
> `/qa-agents:init` from `{{PROJECT_NAME}}`'s actual code — every section below
> should be adapted or confirmed against real evidence (existing specs/POMs),
> never invented. Cross-references:
> - Intent → method translation: [`intent-mapping.md`](./intent-mapping.md)
> - When to apply which fix: [`healing-rules.md`](./healing-rules.md)

---

## 1. Spec Discipline (what specs MUST and MUST NOT contain)

<!-- /qa-agents:init: fill this table from the confirmed rules.* flags in
     .claude/qa-agents.config.json. Only include a MUST/MUST NOT row for a
     rule that's actually enforced (flag = true) — omit rows for flags that
     are false/unset instead of stating a fake rule. -->

**Spec files (`{{SPEC_DIR}}/*.spec.ts`) are orchestration only** *(only if `rules.noPageDotInSpec` is true — otherwise state the project's actual spec-body convention instead)*.

| MUST | MUST NOT |
|---|---|
| {{fill from confirmed rules}} | {{fill from confirmed rules}} |

```typescript
// {{init: paste one REAL example spec snippet from this project here, not an invented one}}
```

### No inline literals as method arguments

<!-- Keep this section only if confirmed as an actual project convention;
     otherwise delete it rather than presenting it as a rule. -->

---

## 2. Page Object Model

**One POM per page.** Place in `{{POM_DIR}}/<page-name>.page.ts` (confirm the
actual naming/extension convention from existing files — don't assume
kebab-case + `.page.ts` if the project uses something else).

### Structure

```typescript
// {{init: paste a REAL, minimal POM example from this project (e.g. its
// login page or simplest page) here — extending its actual base class,
// using its actual locator style. Do not invent a fictional class.}}
```

### POM rules

| Rule | Detail |
|---|---|
| **Extend `{{BASE_PAGE_CLASS}}`** | {{list what the base class actually provides, read from `{{basePageFile}}`}} |
| **Locators as `readonly`** in constructor | *(only if `rules.readonlyLocators` is true)* |
| **Method bodies wrap in a step helper** | *(only if `rules.mandatoryTestStep` is true — name the actual helper, e.g. `test.step(...)`)* |
| **Context ownership** | Method belongs to the page that contains/displays the element |

---

## 3. Locator Strategy

**Priority order** (try in this sequence, fall back when previous unavailable) — this order is Playwright-general and rarely needs project-specific changes:

1. `getByRole('button|link|textbox|combobox|checkbox|...', { name: '<exact>' })` — most stable
2. `getByPlaceholder('<exact>')` — only when a real placeholder exists
3. `getByLabel('<exact>')` — only when label is linked via `for`/`aria-labelledby`
4. `locator('[data-testid="..."]')` — verify it exists in DOM first
5. `locator('#id')` / other stable attribute selector
6. `getByText('<exact>')` — last resort

**Inspect live DOM before guessing.** Use the `dom-inspector` agent or `browser_snapshot` MCP tool.

### Project-specific gotchas

<!-- /qa-agents:init: this section starts EMPTY. Do not invent gotchas —
     they accumulate over time as dom-inspector/spec-runner/code-fixer
     discover real quirks in this project's app (e.g. a component library
     rendering selects as non-<input> elements, unlinked form labels, async
     races after a selection). Leave a single placeholder row until the
     first real one is found. -->

| Where | Gotcha |
|---|---|
| *(none recorded yet)* | *(agents should add a row here when they discover a real, reusable quirk)* |

---

## 4. Login Patterns

<!-- /qa-agents:init: describe how THIS project actually authenticates test
     sessions — reused storage state? Fresh login per test? Multiple roles?
     Do not copy this plugin's own example verbatim; confirm against the
     project's actual global setup file (if any). -->

{{TODO: fill in from the project's actual auth setup}}

---

## 5. API Services (for preconditions + cleanup)

<!-- /qa-agents:init: list what API service helpers actually exist in this
     project, if any (path, methods). If the project doesn't have this
     layer, delete this section rather than inventing one. -->

{{TODO: fill in, or delete section if not applicable}}

---

## 6. Data Builders

Use when an entity has more than `{{builderFieldThreshold}}` configurable
fields and is used with many variants across specs *(only include this
section if `rules.builderFieldThreshold` is set)*.

---

## 7. Live DOM Inspection (mandatory)

**Never guess selectors from TC text alone.** Inspect the live page before writing or fixing any locator.

Tools:
- `dom-inspector` agent — preferred, returns structured locator recommendations
- `browser_snapshot` MCP tool — direct call when iterating
- `test_debug` MCP tool — for healing context, if the Playwright MCP server is available in this environment

---

## 8. Test Header + Naming

<!-- /qa-agents:init: fill from testHeaderFormat in the config, with a real
     example pulled from an existing spec if one exists. -->

{{TODO: fill in the project's actual test header/name format, or delete
this section if the project has no fixed convention}}

---

## 9. Code Style

<!-- /qa-agents:init: point to the project's actual lint config instead of
     restating rules here — e.g. "run `{{lintCommand}}` to check/fix style;
     see <path to eslint/prettier config> for the exact rules." -->

{{TODO: fill in}}

---

## 10. Project Structure Reference

<!-- /qa-agents:init: fill with the REAL directory layout discovered in
     Step 1 of the init command — pomDir, specDir, casesDir, base POM
     class location. Never hardcode a literal app URL here; reference the
     env var name the project uses instead. -->

```
{{TODO: real project structure}}
```
