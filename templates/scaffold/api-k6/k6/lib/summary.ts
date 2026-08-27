export function makeSummary(
  name: string,
  data: unknown,
  stdout?: string,
): Record<string, string> {
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  return {
    stdout: stdout ?? `\n[${name}] Summary → k6/reports/${name}-summary-${ts}.json\n`,
    [`k6/reports/${name}-summary-${ts}.json`]: JSON.stringify(data, null, 2),
  };
}
