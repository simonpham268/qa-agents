// TODO(init): point at this app's real API once known — kept as the public
// Swagger Petstore demo so the perf scripts run out of the box.
import http from 'k6/http';
import { BASE_URL, HEADERS } from './config';

export const SampleClient = {
  findByStatus: (status = 'available', tag = 'findByStatus') =>
    http.get(`${BASE_URL}/pet/findByStatus?status=${status}`, {
      headers: HEADERS,
      tags: { name: tag },
    }),

  getInventory: () =>
    http.get(`${BASE_URL}/store/inventory`, {
      headers: HEADERS,
      tags: { name: 'getInventory' },
    }),
};
