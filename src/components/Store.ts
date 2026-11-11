import { create } from 'zustand';

export interface Customer {
  id: string;
  name: string;
  status: 'ordering' | 'done';
}

export interface TableSession {
  id: string;
  tableNumber: number;
  customers: Customer[];
}

interface OrderStore {
  isAuthenticated: boolean;
  sessions: TableSession[];
  activeSessionId: string | null;
  login: (pin: string) => boolean;
  logout: () => void;
  startSession: (tableNumber: number, customerName: string) => void;
  clearSession: () => void;
}

export const useOrderStore = create<OrderStore>((set) => ({
  isAuthenticated: false,
  sessions: [],
  activeSessionId: null,
  login: (pin) => {
    if (pin !== '1234') return false;
    set({ isAuthenticated: true });
    return true;
  },
  logout: () => set({ isAuthenticated: false }),
  startSession: (tableNumber, customerName) => {
    const sessionId = crypto.randomUUID();
    set({
      sessions: [{ id: sessionId, tableNumber, customers: [{ id: crypto.randomUUID(), name: customerName, status: 'ordering' }] }],
      activeSessionId: sessionId,
    });
  },
  clearSession: () => set({ sessions: [], activeSessionId: null }),
}));
