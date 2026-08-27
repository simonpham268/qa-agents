// TODO(init): point at this app's real API base URL once known — kept as the
// public Swagger Petstore demo so `npm run test:perf:smoke` runs out of the box.
export const BASE_URL = __ENV.PERF_BASE_URL || 'https://petstore.swagger.io/v2';

export const HEADERS: Record<string, string> = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};
