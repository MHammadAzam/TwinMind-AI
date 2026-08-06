const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function apiClient<T>(
  endpoint: string
): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-store',
    },
  });

  if (!response.ok) {
    throw new Error('API request failed');
  }

  return response.json();
}