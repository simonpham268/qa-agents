// Transpile k6 TypeScript files → k6/dist/*.js using esbuild.
// k6 imports (k6, k6/*) are kept as external so the k6 runtime resolves them.
const { build } = require('esbuild');

const entries = [
  'k6/sample/smoke.k6.ts',
  'k6/sample/load.k6.ts',
  'k6/sample/stress.k6.ts',
];

Promise.all(
  entries.map(entry =>
    build({
      entryPoints: [entry],
      bundle: true,
      target: 'es2015',
      format: 'esm',
      external: ['k6', 'k6/*'],
      outdir: 'k6/dist',
      logLevel: 'warning',
    })
  )
)
  .then(() => console.log('✓  k6 build complete  →  k6/dist/'))
  .catch(err => { console.error(err); process.exit(1); });
