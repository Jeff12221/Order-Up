import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2, Play, ChefHat } from 'lucide-react';
import { useOrderStore } from '../components/Store';
import Header from '../components/Header';
import { formatDistanceToNow } from 'date-fns';

const Kitchen: React.FC = () => {
  const { batches, startPreparing, completeBatch } = useOrderStore();

  // FIFO: Oldest sentAt first
  const sortedBatches = [...batches].sort((a, b) => a.sentAt - b.sentAt);

  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <Header />
      <main className="flex-1 container mx-auto px-6 py-12">
        <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold font-serif flex items-center gap-3">
              <ChefHat className="h-10 w-10 text-primary" />
              Kitchen Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">Live order queue batched by table</p>
          </div>
          <div className="flex items-center gap-4 bg-card border border-border px-6 py-3 rounded-2xl shadow-sm">
            <div className="text-center">
              <span className="block text-2xl font-bold">{batches.length}</span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Active Batches</span>
            </div>
          </div>
        </div>

        {sortedBatches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
              <Clock className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-muted-foreground">No pending orders</h2>
            <p className="text-muted-foreground">New orders will appear here automatically.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            <AnimatePresence>
              {sortedBatches.map((batch, index) => (
                <motion.div
                  key={batch.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`relative flex flex-col rounded-2xl border-2 bg-card shadow-lg overflow-hidden ${
                    batch.status === 'preparing' ? 'border-primary' : 'border-border'
                  }`}
                >
                  {index === 0 && batch.status === 'queued' && (
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 text-xs font-bold rounded-bl-xl z-10">
                      NEXT UP
                    </div>
                  )}

                  <div className="p-6 border-b border-border bg-muted/30">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-bold">Table {batch.tableNumber}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Clock className="h-4 w-4" />
                          <span>Sent {formatDistanceToNow(batch.sentAt)} ago</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        batch.status === 'preparing' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                      }`}>
                        {batch.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 p-6 space-y-6">
                    {batch.orders.sort((a, b) => a.placedAt - b.placedAt).map((order, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                          {i + 1}
                        </div>
                        <div>
                          <p className="font-bold text-lg leading-tight">{order.itemName}</p>
                          {order.sideChoice && (
                            <p className="text-sm text-primary font-medium mt-1">Side: {order.sideChoice}</p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1 italic">For {order.customerName}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-6 bg-muted/10 border-t border-border">
                    {batch.status === 'queued' ? (
                      <button
                        onClick={() => startPreparing(batch.id)}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-4 font-bold text-primary-foreground transition-all hover:bg-primary/90"
                      >
                        <Play className="h-5 w-5" />
                        Start Preparing
                      </button>
                    ) : (
                      <button
                        onClick={() => completeBatch(batch.id)}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-green-600 py-4 font-bold text-white transition-all hover:bg-green-700"
                      >
                        <CheckCircle2 className="h-5 w-5" />
                        Mark as Served
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
};

export default Kitchen;