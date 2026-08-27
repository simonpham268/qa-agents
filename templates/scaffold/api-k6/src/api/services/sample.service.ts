// TODO(init): rename/replace with this app's real service — this shows the
// layering pattern: endpoints (constants) + model (types) + service (uses ApiClient).
import type { ApiClient } from '../base/api.client';
import { SAMPLE_ENDPOINTS } from '../endpoints/sample.endpoints';
import type { CreateSampleRequest, ListSamplesResponse, Sample } from '../models/sample.model';

export class SampleService {
  constructor(private readonly client: ApiClient) {}

  async create(payload: CreateSampleRequest) {
    return this.client.post<Sample>(SAMPLE_ENDPOINTS.CREATE, { data: payload });
  }

  async list() {
    return this.client.get<ListSamplesResponse>(SAMPLE_ENDPOINTS.LIST);
  }

  async delete(id: string | number) {
    return this.client.delete<void>(SAMPLE_ENDPOINTS.DELETE(id));
  }
}
