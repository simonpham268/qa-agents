// TODO(init): rename/replace with this app's real request/response shapes.
export interface CreateSampleRequest {
  name: string;
}

export interface Sample {
  id: number;
  name: string;
}

export interface ListSamplesResponse {
  items: Sample[];
}
