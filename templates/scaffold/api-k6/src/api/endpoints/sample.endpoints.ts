// TODO(init): rename/replace with this app's real endpoints once known.
// Kept as a runnable example of the endpoint-constants layering pattern.
export const SAMPLE_ENDPOINTS = {
  CREATE: '/api/samples/',
  LIST: '/api/samples/',
  GET: (id: string | number) => `/api/samples/${id}`,
  DELETE: (id: string | number) => `/api/samples/${id}`,
} as const;
