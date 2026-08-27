export interface ApiResponse<T = unknown> {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: T | null;
  ok: boolean;
}
