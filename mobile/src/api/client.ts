const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://api.chababia.dz/v1';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
}

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  const { method = 'GET', body, headers = {} } = options;

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const status = response.status;

    if (!response.ok) {
      return { data: null, error: `HTTP ${status}`, status };
    }

    const data = (await response.json()) as T;
    return { data, error: null, status };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { data: null, error: message, status: 0 };
  }
}

export const api = {
  get<T>(endpoint: string, headers?: Record<string, string>) {
    return request<T>(endpoint, { method: 'GET', headers });
  },
  post<T>(endpoint: string, body: unknown, headers?: Record<string, string>) {
    return request<T>(endpoint, { method: 'POST', body, headers });
  },
  delete<T>(endpoint: string, headers?: Record<string, string>) {
    return request<T>(endpoint, { method: 'DELETE', headers });
  },
};
