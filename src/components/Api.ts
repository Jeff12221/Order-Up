export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

export interface ApiMenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
}

export interface ApiOrderItem {
  name: string;
  quantity: number;
  notes: string | null;
  price: number;
}

export interface ApiOrder {
  id: number;
  customer_name: string;
  table_number: number;
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled';
  created_at: string;
  items: ApiOrderItem[];
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || `Request failed (${response.status})`);
  return payload as T;
}
