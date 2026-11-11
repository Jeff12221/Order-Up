import React, { useState } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { Hash, ArrowRight } from 'lucide-react';
    import { useOrderStore } from '../components/Store';
    import Header from '../components/Header';
    import Footer from '../components/Footer';

    const Home: React.FC = () => {
      const [tableNumber, setTableNumber] = useState<string>('');
      const [customerName, setCustomerName] = useState('');
      const startSession = useOrderStore(state => state.startSession);
      const navigate = useNavigate();

      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const parsedTable = Number(tableNumber);
        if (!customerName.trim() || parsedTable < 1 || parsedTable > 10) return;
        startSession(parsedTable, customerName.trim());
        navigate('/order');
      };

      return (
        <div className="flex min-h-screen flex-col bg-background">
          <Header />
          <main className="flex-1">
            <section className="relative overflow-hidden py-24 lg:py-5">
              <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_45%_at_50%_50%,rgba(var(--primary),0.05)_0%,transparent_100%)]" />
              
              <div className="container mx-auto max-w-4xl px-6 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
                    Welcome to Order Up
                  </span>
                  <h1 className="text-5xl font-bold tracking-tight font-serif sm:text-6xl mb-6">
                    Start a New Table Session
                  </h1>
                  <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
                    Enter your name and table number to place an order. The kitchen receives it as soon as you submit.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8 shadow-xl"
                >
                  <form onSubmit={handleSubmit} className="space-y-6 text-left">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Your Name</label>
                      <input
                        type="text"
                        required
                        maxLength={120}
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Jordan"
                        className="w-full rounded-lg border border-input bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Hash className="h-4 w-4 text-primary" />
                        Table Number
                      </label>
                      <input
                        type="number"
                        required
                        min={1}
                        max={10}
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        placeholder="1–10"
                        className="w-full rounded-lg border border-input bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                    </div>

                    <button
                      type="submit"
                      className="group flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-4 text-lg font-semibold text-primary-foreground transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Open Table
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </button>
                  </form>
                </motion.div>
              </div>
            </section>

          
          </main>
          <Footer />
        </div>
      );
    };

    export default Home;
