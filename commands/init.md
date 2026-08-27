---
description: Scan this project and write .claude/qa-agents.config.json so the other qa-agents commands/agents stop guessing paths and conventions. Run once per project before anything else in this plugin.
---

# Initialize qa-agents for this project

**Trigger when user says** (any language/form): init qa-agents, setup qa-agents, cấu hình qa-agents, khởi tạo cho project này.

---

Run this once per target project, before using `/qa-agents:implement-requirement`, `/qa-agents:implement-script`, or `/qa-agents:implement-fix-script` for the first time — and again any time the project's test-automation conventions change materially (new POM location, new spec style rule, etc.).

You are gathering just enough project-specific fact to make the other agents config-driven instead of guessing. Do not invent an answer to any of these — if you can't find or confirm something, leave it unset in the config and note it as a follow-up for the human, rather than defaulting to this plugin's own examples (e.g. don't default `pomDir` to `src/pages/LDM` — that's this plugin's dogfood project, not the target project).

## Step 1 — Scan for existing conventions

Before asking the human anything, look for evidence yourself:

1. `Glob` for `**/*.spec.ts` (or the project's actual test file extension) to find the spec directory.
2. `Glob` for `**/*page*.ts`/`**/*Page*.ts` (or equivalent) to find where Page Object Model files live, and `Read` 1-2 of them to see:
   - Do locators live as `readonly` constructor fields, or are they created ad hoc?
   - Do methods wrap their body in a step helper (e.g. Playwright's `test.step(...)`)? Is that consistent across files, or occasional?
   - Is there a shared base/parent POM class? What's it called and where does it live?
3. `Read` 1-2 existing spec files (if any) to see:
   - Do they call low-level page-interaction methods directly, or only POM methods?
   - What test header/name format do they use, if any?
   - What do they import, and from where (a custom fixture, or the test runner directly)?
4. Look for a test-case source directory (markdown/other format describing scenarios before they become specs) — often near the spec directory or under a `cases`/`test-cases` folder.
5. Look for a lint command in `package.json` scripts (e.g. `lint`, `lint:file`).
6. Check RAG setup — the `knowledge-retriever` agent expects the standalone `rag-cli` tool (https://github.com/simonpham268/rag-cli, package `@simonpham268/rag-cli`), installed globally, not a per-project npm script:
   - Run `rag-cli --version` (or similar) to check whether it's installed on this machine. If not found, RAG is simply unavailable here — that's normal, not an error; don't tell the human to write a wrapper script.
   - If it IS installed, `Glob` for `.rag/store.sqlite` in the project root to see if anything's been indexed yet, and if so, try to determine which collection name(s) it holds (ask the human if you can't tell from a quick `rag-cli query` test).
   - Only note a custom `ragQueryCommand` override if the project demonstrably uses something other than the standard `rag-cli` binary (rare) — don't invent one.
7. Check for a project instructions file (`CLAUDE.md` or similar) that already documents test-case format rules — if found, don't duplicate its content into the config; just note its path so `test-case-writer` reads it directly.

## Step 2 — Confirm with the human

Show what you found (or didn't) and ask, in one pass — don't interrogate field by field if you already have solid evidence for most of them:

- POM directory (confirm or correct what you inferred)
- Spec directory
- Test-case source directory (or "none — TCs aren't tracked as files here")
- Fixture import path, if specs use one (e.g. for an API client)
- Spec/POM style rules — for each, "yes, enforced" / "no" / "mixed, don't enforce":
  - Locators must be `readonly` constructor fields (not created inside methods)
  - Every POM method body must be wrapped in a step helper
  - Specs must call only POM methods, never low-level page-interaction calls directly
  - A field-count threshold above which a Data Builder pattern should be used (or "not used in this project")
- Lint command (or "none")
- RAG: whether `rag-cli` was found installed, and if so which collection this project's docs live in (or "not indexed yet" / "rag-cli not installed — skip knowledge-retriever for now")
- Test header/name format, if the project has a fixed convention (e.g. a doc comment ID + tags above each test)

Use `AskUserQuestion` for anything genuinely ambiguous after Step 1; don't ask about things Step 1 already confirmed with high confidence — just state them and let the human correct if wrong.

## Step 3 — Write the config

Write `.claude/qa-agents.config.json` in the target project:

```json
{
  "pomDir": "<path>",
  "basePageFile": "<path to shared base POM class, if any>",
  "specDir": "<path>",
  "casesDir": "<path, or null if TCs aren't tracked as files>",
  "fixtureImport": "<import path, or null>",
  "lintCommand": "<command, or null>",
  "ragCollection": "<collection name rag-cli holds this project's docs under, or null if not indexed yet>",
  "ragQueryCommand": "<ONLY set if this project uses something other than the standard global `rag-cli` binary — an override command, else null (null does NOT mean 'no RAG'; it means 'use the standard rag-cli binary')>",
  "testHeaderFormat": "<short description or example, or null>",
  "caseFormatDoc": "<path to the project's own TC-format rules doc, if one exists, else null>",
  "rules": {
    "readonlyLocators": true,
    "mandatoryTestStep": true,
    "noPageDotInSpec": true,
    "enforceLoginPattern": true,
    "builderFieldThreshold": 3
  }
}
```

Every `rules.*` flag is a boolean (or number for the threshold) reflecting what Step 2 confirmed — set to `false`/`null` rather than guessing `true` for anything not actually confirmed as enforced in this project.

## Step 4 — Write the project's own framework-rules doc (optional but recommended)

If the target project doesn't already have its own `.claude/docs/framework-rules.md`, offer to write one: read this plugin's `docs/framework-rules.template.md`, adapt every `{{...}}` placeholder and bracketed TODO using what Step 1-2 gathered, and write the result to `<target>/.claude/docs/framework-rules.md`. Do the same for `docs/intent-mapping.template.md` if the human wants method-mapping guidance too. Skip anything you don't have real evidence for — leave it as an explicit `<TODO: fill in>` rather than inventing plausible-sounding content, matching the same "never invent, flag instead" discipline the other agents follow.

Copy `docs/healing-rules.md` as-is (it's app-agnostic P1/P2 troubleshooting) unless the human's answers changed which P2 rules apply — in that case, adjust its P2 checklist table to match `rules.*` from the config.

## Step 5 — Report

Tell the human:
- The config file path written.
- Any field left unset/null and why (so they know what's not yet configured, not silently assumed).
- Whether framework-rules.md / intent-mapping.md were written or skipped, and why.
- That they can re-run `/qa-agents:init` any time conventions change.
