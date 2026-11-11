import React, { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2, Play, ChefHat } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Header from '../components/Header';
import { apiRequest, type ApiOrder } from '../components/Api';

const Kitchen: React.FC = () => {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const refreshOrders = useCallback(async () => {
    try {
      const fresh = await apiRequest<ApiOrder[]>('/api/orders?status=pending,preparing,ready');
      setOrders(fresh);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not reach the order API.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshOrders();
    const timer = window.setInterval(() => void refreshOrders(), 3000);
    return () => window.clearInterval(timer);
  }, [refreshOrders]);

  const setStatus = async (orderId: number, status: 'preparing' | 'ready') => {
    try {
      await apiRequest(`/api/orders/${orderId}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
      await refreshOrders();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update order status.');
    }
  };

  const activeCount = orders.filter((order) => order.status !== 'ready').length;

  return <div className="flex min-h-screen flex-col bg-muted/20">
    <Header />
    <main className="container mx-auto flex-1 px-6 py-12">
      <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div><h1 className="flex items-center gap-3 font-serif text-4xl font-bold"><ChefHat className="h-10 w-10 text-primary" />Kitchen Dashboard</h1><p className="mt-2 text-muted-foreground">Orders refresh automatically every 3 seconds</p></div>
        <div className="rounded-2xl border border-border bg-card px-6 py-3 text-center shadow-sm"><span className="block text-2xl font-bold">{activeCount}</span><span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Active Orders</span></div>
      </div>
      {error && <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">API connection issue: {error}</div>}
      {loading && <p className="py-24 text-center text-muted-foreground">Connecting to the order queue…</p>}
      {!loading && orders.length === 0 && <div className="flex flex-col items-center justify-center py-32 text-center"><div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted"><Clock className="h-10 w-10 text-muted-foreground" /></div><h2 className="text-2xl font-bold text-muted-foreground">No active orders</h2><p className="text-muted-foreground">New orders will appear here automatically.</p></div>}
      {!loading && orders.length > 0 && <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3"><AnimatePresence>{orders.map((order) => <motion.article key={order.id} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} className={`flex flex-col overflow-hidden rounded-2xl border-2 bg-card shadow-lg ${order.status === 'preparing' ? 'border-primary' : order.status === 'ready' ? 'border-green-500' : 'border-border'}`}>
        <div className="border-b border-border bg-muted/30 p-6"><div className="mb-4 flex items-start justify-between gap-3"><div><h3 className="text-2xl font-bold">Table {order.table_number}</h3><p className="mt-1 font-semibold">{order.customer_name}</p><div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground"><Clock className="h-4 w-4" /><span>Placed {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}</span></div></div><span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${order.status === 'ready' ? 'bg-green-100 text-green-800' : order.status === 'preparing' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>{order.status}</span></div></div>
        <div className="flex-1 space-y-5 p-6">{order.items.map((item, index) => <div key={`${order.id}-${index}`} className="flex gap-4"><div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">{item.quantity}×</div><div><p className="text-lg font-bold leading-tight">{item.name}</p>{item.notes && <p className="mt-1 text-sm text-primary">Notes: {item.notes}</p>}</div></div>)}</div>
        <div className="border-t border-border bg-muted/10 p-6">{order.status === 'pending' && <button onClick={() => void setStatus(order.id, 'preparing')} className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-bold text-primary-foreground hover:bg-primary/90"><Play className="h-5 w-5" />Mark Preparing</button>}{order.status === 'preparing' && <button onClick={() => void setStatus(order.id, 'ready')} className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-4 font-bold text-white hover:bg-green-700"><CheckCircle2 className="h-5 w-5" />Mark Ready</button>}{order.status === 'ready' && <div className="flex items-center justify-center gap-2 font-bold text-green-700"><CheckCircle2 className="h-5 w-5" />Ready for pickup</div>}</div>
      </motion.article>)}</AnimatePresence></div>}
    </main>
  </div>;
};

export default Kitchen;
