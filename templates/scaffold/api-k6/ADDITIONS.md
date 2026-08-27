<!-- /qa-agents:init applies this only if the human opted into the API + k6
     perf layer. Source files under src/api/ and k6/ are copied as-is (with
     TODO markers where noted); this doc covers the config-file merges. -->

## 1. src/fixtures/custom.fixture.ts

This layer's `src/fixtures/custom.fixture.ts` OVERWRITES the (nonexistent, if
core-only) fixture file — it's the one that wires `apiClient` into specs via
`test.extend`. If a fixture file already exists for another reason, merge the
`apiClient` fixture into it instead of overwriting.

## 2. package.json — scripts to add

```json
{
  "perf:build": "node k6/build.js",
  "perf:report": "node k6/open-report.js",
  "test:perf": "npm run perf:build && npm run test:perf:smoke && npm run test:perf:load && npm run test:perf:stress",
  "test:perf:smoke": "npm run perf:build && k6 run k6/dist/smoke.k6.js",
  "test:perf:load": "npm run perf:build && k6 run k6/dist/load.k6.js",
  "test:perf:stress": "npm run perf:build && k6 run k6/dist/stress.k6.js",
  "test:perf:smoke:dash": "npm run perf:build && k6 run --out web-dashboard k6/dist/smoke.k6.js",
  "test:perf:load:dash": "npm run perf:build && k6 run --out web-dashboard k6/dist/load.k6.js",
  "test:perf:stress:dash": "npm run perf:build && k6 run --out web-dashboard k6/dist/stress.k6.js"
}
```

## 3. package.json — devDependencies to add

```json
{
  "@types/k6": "^2.0.0",
  "esbuild": "^0.24.0"
}
```

k6 itself (the load-test binary, e.g. `brew install k6`) is a separate system
install, not an npm package — note this to the human rather than adding it as
a dependency.

## 4. .gitignore — lines to add

```
# k6
/k6/dist/
/k6/reports/*.json
```

## 5. `k6/reports/.gitkeep`

Create an empty `k6/reports/.gitkeep` so the (gitignored-contents) directory exists.
