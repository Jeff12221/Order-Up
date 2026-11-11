import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ChefHat, ArrowRight, AlertCircle } from 'lucide-react';
import { useOrderStore } from '../components/Store';
import Header from '../components/Header';

const ChefLogin: React.FC = () => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const login = useOrderStore(state => state.login);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(pin);
    if (success) {
      navigate('/chef');
    } else {
      setError(true);
      setPin('');
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <Header />
      <main className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground mb-4 shadow-lg">
              <ChefHat className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold font-serif">Staff Access</h1>
            <p className="text-muted-foreground mt-2">Enter your security PIN to access the kitchen</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary" />
                  Security PIN
                </label>
                <input
                  type="password"
                  required
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="••••"
                  maxLength={4}
                  className={`w-full rounded-xl border bg-background px-4 py-4 text-center text-2xl font-bold tracking-[1em] focus:outline-none focus:ring-2 transition-all ${
                    error ? 'border-destructive ring-destructive/20 animate-shake' : 'border-input focus:ring-primary/50'
                  }`}
                />
                {error && (
                  <p className="text-xs text-destructive flex items-center gap-1 mt-2 justify-center">
                    <AlertCircle className="h-3 w-3" />
                    Invalid PIN. Please try again.
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 text-lg font-bold text-primary-foreground transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Sign In
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
            </form>
            
            <div className="mt-8 pt-6 border-t border-border text-center">
              <p className="text-xs text-muted-foreground">
                Authorized personnel only. All access is logged.
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default ChefLogin;