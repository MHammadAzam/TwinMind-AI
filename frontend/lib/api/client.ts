const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function apiClient<T>(
  endpoint: string
): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache, no-store, max-age=0',
      Pragma: 'no-cache',
      Expires: '0',
    },
  });

  if (!response.ok) {
    throw new Error('API request failed');
  }

  return response.json();
}
