import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';
import { SampleClient } from '../lib/sample.client';
import { isStatus, isBelow, isArray, hasItems } from '../lib/checks';
import { makeSummary } from '../lib/summary';

const errorRate            = new Rate('errors');
const findByStatusDuration = new Trend('find_by_status_duration_ms', true);

export const options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m', target: 50 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'],
    http_req_failed:   ['rate<0.05'],
    errors:             ['rate<0.05'],
  },
};

export default function (): void {
  const res = SampleClient.findByStatus();

  const ok = check(res, {
    'status 200':    isStatus(200),
    'body is array': isArray,
    'has at least 1 item': hasItems,
    'response < 2000 ms': isBelow(2000),
  });

  errorRate.add(!ok);
  findByStatusDuration.add(res.timings.duration);
  sleep(0.2);
}

export const handleSummary = (data: unknown) => makeSummary('stress', data);
