interface Res {
  status: number;
  body: string | ArrayBuffer | null;
  timings: { duration: number };
}

function parse(body: string | ArrayBuffer | null): unknown {
  if (typeof body !== 'string') return null;
  try { return JSON.parse(body); } catch { return null; }
}

export const isStatus = (code: number) => (r: Res) => r.status === code;
export const isBelow  = (ms: number)   => (r: Res) => r.timings.duration < ms;
export const isArray  = (r: Res) => Array.isArray(parse(r.body));
export const isObject = (r: Res) => { const b = parse(r.body); return typeof b === 'object' && b !== null && !Array.isArray(b); };
export const hasItems = (r: Res) => { const b = parse(r.body); return Array.isArray(b) && (b as unknown[]).length > 0; };
