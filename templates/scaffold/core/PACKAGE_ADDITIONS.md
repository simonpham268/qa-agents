<!-- /qa-agents:init reads this to know what to merge into the target project's
     package.json. Merge, never overwrite — if a script/dep already exists
     with a different value, keep the project's existing value and flag the
     conflict to the human instead of clobbering it. -->

## Scripts to add

```json
{
  "test": "npx playwright test --project=chromium",
  "test:uat": "cross-env ENVIRONMENT=uat npx playwright test --project=chromium",
  "test:prod": "cross-env ENVIRONMENT=prod npx playwright test --project=chromium",
  "install:browsers": "npx playwright install --with-deps",
  "lint": "eslint src --ext .ts",
  "lint:fix": "eslint src --ext .ts --fix",
  "lint:file": "eslint --ext .ts",
  "lint:file:fix": "eslint --ext .ts --fix"
}
```

## devDependencies to add (latest at time of writing — re-resolve to current latest when installing)

```json
{
  "@eslint/js": "^10.0.1",
  "@playwright/test": "^1.57.0",
  "@types/node": "^25.0.9",
  "@typescript-eslint/eslint-plugin": "^8.57.2",
  "@typescript-eslint/parser": "^8.57.2",
  "cross-env": "^10.1.0",
  "eslint": "^10.1.0",
  "eslint-config-prettier": "^10.1.8",
  "eslint-plugin-playwright": "^2.10.1",
  "prettier": "3.8.0",
  "typescript": "^5.0.0",
  "typescript-eslint": "^8.57.2"
}
```

## dependencies to add

```json
{
  "dotenv": "^17.2.3"
}
```

## If no package.json exists yet

Run `npm init -y` first, then apply the merges above, then set `"type"` is
NOT set to `"module"` (this template uses CommonJS-style tooling configs
alongside ESM-friendly TS — don't force one globally).
