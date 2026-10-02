import { create } from 'zustand';
import { MENU_ITEMS } from './MenuData';

export interface Customer {
  id: string;
  name: string;
  status: 'ordering' | 'done';
  order?: {
    itemId: string;
    sideChoice?: string;
    placedAt: number;
  };
}

export interface TableSession {
  id: string;
  tableNumber: number;
  customers: Customer[];
  status: 'open' | 'ordering' | 'sent' | 'served';
}

export interface OrderBatch {
  id: string;
  tableId: string;
  tableNumber: number;
  sentAt: number;
  status: 'queued' | 'preparing' | 'complete';
  orders: {
    customerName: string;
    itemName: string;
    sideChoice?: string;
    placedAt: number;
  }[];
}

interface OrderStore {
  // Auth State
  isAuthenticated: boolean;
  
  // App State
  sessions: TableSession[];
  batches: OrderBatch[];
  activeSessionId: string | null;
  
  // Auth Actions
  login: (pin: string) => boolean;
  logout: () => void;

  // App Actions
  startSession: (tableNumber: number, customerCount: number) => void;
  updateCustomerOrder: (sessionId: string, customerId: string, itemId: string, sideChoice?: string) => void;
  completeBatch: (batchId: string) => void;
  startPreparing: (batchId: string) => void;
}

export const useOrderStore = create<OrderStore>((set) => ({
  isAuthenticated: false,
  sessions: [],
  batches: [],
  activeSessionId: null,

  login: (pin: string) => {
    // Simple PIN for staff access
    if (pin === '1234') {
      set({ isAuthenticated: true });
      return true;
    }
    return false;
  },

  logout: () => set({ isAuthenticated: false }),

  startSession: (tableNumber, customerCount) => {
    const sessionId = Math.random().toString(36).substr(2, 9);
    const customers: Customer[] = Array.from({ length: customerCount }).map((_, i) => ({
      id: `c-${i}`,
      name: `Guest ${i + 1}`,
      status: 'ordering'
    }));

    const newSession: TableSession = {
      id: sessionId,
      tableNumber,
      customers,
      status: 'ordering'
    };

    set((state) => ({
      sessions: [...state.sessions, newSession],
      activeSessionId: sessionId
    }));
  },

  updateCustomerOrder: (sessionId, customerId, itemId, sideChoice) => {
    set((state) => {
      const session = state.sessions.find(s => s.id === sessionId);
      const customer = session?.customers.find(c => c.id === customerId);
      const menuItem = MENU_ITEMS.find(item => item.id === itemId);
      if (!session || !customer || customer.status === 'done' || !menuItem) return state;

      const placedAt = Date.now();
      const updatedCustomer: Customer = {
        ...customer,
        status: 'done',
        order: {
          itemId,
          sideChoice,
          placedAt
        }
      };
      const customers = session.customers.map(c =>
        c.id === customerId ? updatedCustomer : c
      );
      const allDone = customers.every(c => c.status === 'done');
      const updatedSession: TableSession = {
        ...session,
        customers,
        status: allDone ? 'sent' : session.status
      };
      const sessions = state.sessions.map(s =>
        s.id === sessionId ? updatedSession : s
      );

      if (allDone) {
        const sentAt = Date.now();
        const newBatch: OrderBatch = {
          id: `b-${Math.random().toString(36).substr(2, 9)}`,
          tableId: session.id,
          tableNumber: session.tableNumber,
          sentAt,
          status: 'queued',
          orders: customers.map(c => ({
            customerName: c.name,
            itemName: MENU_ITEMS.find(item => item.id === c.order?.itemId)?.name ?? c.order?.itemId ?? 'Unknown item',
            sideChoice: c.order?.sideChoice,
            placedAt: c.order?.placedAt ?? sentAt
          }))
        };

        return {
          sessions,
          batches: [...state.batches, newBatch]
        };
      }

      return { sessions };
    });
  },

  startPreparing: (batchId) => {
    set((state) => ({
      batches: state.batches.map(b => 
        b.id === batchId ? { ...b, status: 'preparing' } : b
      )
    }));
  },

  completeBatch: (batchId) => {
    set((state) => {
      const batch = state.batches.find(b => b.id === batchId);
      if (!batch) return state;

      return {
        batches: state.batches.filter(b => b.id !== batchId),
        sessions: state.sessions.map(s => 
          s.id === batch.tableId ? { ...s, status: 'served' } : s
        )
      };
    });
  }
}));