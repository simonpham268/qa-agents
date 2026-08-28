<!-- /qa-agents:init applies this only if the human opted into the Allure
     reporting layer. Pure config additions on top of the core layer — no
     new source files. -->

## 1. playwright.config.ts — reporter array

Replace the `reporter: [['list']]` line (with its `// TODO(allure layer)` comment)
with:

```typescript
reporter: [
  ['list'],
  ['allure-playwright', {
    outputFolder: 'allure-results',
    detail: true,
    suiteTitle: false,
    environmentInfo: {
      framework: 'playwright',
      browser: 'chromium',
    },
  }],
],
```

## 2. package.json — scripts to add

```json
{
  "allure:generate": "npx allure generate allure-results --clean -o allure-report",
  "allure:open": "npx allure open allure-report",
  "allure": "npm run allure:generate && npm run allure:open"
}
```

## 3. package.json — devDependencies to add

```json
{
  "allure-commandline": "^2.41.0",
  "allure-playwright": "^3.4.5"
}
```

## 4. .gitignore — lines to add

```
# Test Reports
/allure-results/
/allure-report/
```

## 5. eslint.config.mjs — ignores

Add `'allure-*/'` to the `ignores` array (already present in the core template — no change needed if scaffolding both layers together).
