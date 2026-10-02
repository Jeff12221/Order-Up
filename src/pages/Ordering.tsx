import React, { useState, useMemo } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { motion, AnimatePresence } from 'framer-motion';
    import { ChevronRight, ChevronLeft, Check, Info, Utensils } from 'lucide-react';
    import { useOrderStore } from '../components/Store';
    import { MENU_ITEMS } from '../components/MenuData';
    import type { Cuisine, MenuItem } from '../components/MenuData';
    import Header from '../components/Header';

    type Step = 'cuisine' | 'category' | 'dish' | 'side' | 'summary';

    const Ordering: React.FC = () => {
      const navigate = useNavigate();
      const { sessions, activeSessionId, updateCustomerOrder } = useOrderStore();
      
      const session = useMemo(() => 
        sessions.find(s => s.id === activeSessionId), 
        [sessions, activeSessionId]
      );

      const currentCustomer = useMemo(() => 
        session?.customers.find(c => c.status === 'ordering'),
        [session]
      );

      const [step, setStep] = useState<Step>('cuisine');
      const [selectedCuisine, setSelectedCuisine] = useState<Cuisine | null>(null);
      const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
      const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
      const [selectedSide, setSelectedSide] = useState<string | null>(null);

      if (!session || !currentCustomer) {
        return (
          <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
            <Utensils className="h-16 w-16 text-muted mb-4" />
            <h2 className="text-2xl font-bold mb-2">All orders complete!</h2>
            <p className="text-muted-foreground mb-6">The table's order has been sent to the kitchen.</p>
            <button 
              onClick={() => navigate('/kitchen')}
              className="rounded-lg bg-primary px-6 py-3 text-white font-semibold"
            >
              View Kitchen Queue
            </button>
          </div>
        );
      }

      const cuisines: Cuisine[] = ['Nigerian', 'Continental', 'Mexican', 'Italian'];
      
      const categories = useMemo(() => 
        selectedCuisine ? Array.from(new Set(MENU_ITEMS.filter(m => m.cuisine === selectedCuisine).map(m => m.category))) : [],
        [selectedCuisine]
      );

      const dishes = useMemo(() => 
        selectedCategory ? MENU_ITEMS.filter(m => m.cuisine === selectedCuisine && m.category === selectedCategory) : [],
        [selectedCategory, selectedCuisine]
      );

      const handleFinish = () => {
        if (selectedDish) {
          updateCustomerOrder(session.id, currentCustomer.id, selectedDish.id, selectedSide || undefined);
          // Reset local state for next customer
          setStep('cuisine');
          setSelectedCuisine(null);
          setSelectedCategory(null);
          setSelectedDish(null);
          setSelectedSide(null);
        }
      };

      const renderStep = () => {
        switch (step) {
          case 'cuisine':
            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {cuisines.map((c) => (
                  <button
                    key={c}
                    onClick={() => { setSelectedCuisine(c); setStep('category'); }}
                    className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 text-left transition-all hover:border-primary hover:shadow-lg"
                  >
                    <div className="relative z-10">
                      <h3 className="text-2xl font-bold font-serif">{c}</h3>
                      <p className="text-sm text-muted-foreground mt-1">Explore authentic {c.toLowerCase()} flavors</p>
                    </div>
                    <div className="absolute -right-4 -bottom-4 opacity-10 transition-transform group-hover:scale-110">
                      <Utensils className="h-24 w-24" />
                    </div>
                  </button>
                ))}
              </div>
            );
          case 'category':
            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setSelectedCategory(cat); setStep('dish'); }}
                    className="rounded-xl border border-border bg-card p-6 text-left transition-all hover:border-primary hover:bg-primary/5"
                  >
                    <span className="text-lg font-semibold">{cat}</span>
                  </button>
                ))}
              </div>
            );
          case 'dish':
            return (
              <div className="grid grid-cols-1 gap-6">
                {dishes.map((dish) => (
                  <button
                    key={dish.id}
                    onClick={() => {
                      setSelectedDish(dish);
                      if (dish.requiresSide) setStep('side');
                      else setStep('summary');
                    }}
                    className="flex flex-col md:flex-row gap-6 rounded-2xl border border-border bg-card p-4 text-left transition-all hover:border-primary hover:shadow-md"
                  >
                    <img src={dish.image} alt={dish.name} className="h-32 w-full md:w-48 rounded-xl object-cover" />
                    <div className="flex-1 py-2">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-bold">{dish.name}</h3>
                        <span className="font-mono font-bold text-primary">₦{dish.price.toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{dish.description}</p>
                      {dish.requiresSide && (
                        <span className="inline-block mt-3 text-xs font-medium bg-accent px-2 py-1 rounded">Requires Side</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            );
          case 'side':
            return (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Choose your side/protein:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedDish?.sides?.map((side) => (
                    <button
                      key={side}
                      onClick={() => { setSelectedSide(side); setStep('summary'); }}
                      className={`rounded-xl border p-4 text-left transition-all ${
                        selectedSide === side ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border bg-card hover:border-primary/50'
                      }`}
                    >
                      {side}
                    </button>
                  ))}
                </div>
              </div>
            );
          case 'summary':
            return (
              <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <Check className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Confirm Order</h3>
                    <p className="text-sm text-muted-foreground">Review your selection for {currentCustomer.name}</p>
                  </div>
                </div>
                
                <div className="space-y-4 border-y border-border py-6 mb-8">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Main Dish</span>
                    <span className="font-semibold">{selectedDish?.name}</span>
                  </div>
                  {selectedSide && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Side/Choice</span>
                      <span className="font-semibold">{selectedSide}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-4 border-t border-border">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-primary">₦{selectedDish?.price.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={handleFinish}
                  className="w-full rounded-xl bg-primary py-4 text-lg font-bold text-primary-foreground transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Place Order
                </button>
              </div>
            );
        }
      };

      return (
        <div className="flex min-h-screen flex-col bg-background">
          <Header />
          <main className="flex-1 container mx-auto max-w-4xl px-6 py-12">
            <div className="mb-12 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold font-serif">Table {session.tableNumber}</h2>
                <p className="text-muted-foreground">Ordering for: <span className="font-semibold text-foreground">{currentCustomer.name}</span></p>
              </div>
              <div className="flex items-center gap-2">
                {session.customers.map((c, i) => (
                  <div 
                    key={c.id} 
                    className={`h-2 w-8 rounded-full transition-colors ${
                      c.id === currentCustomer.id ? 'bg-primary' : c.status === 'done' ? 'bg-green-500' : 'bg-muted'
                    }`} 
                  />
                ))}
              </div>
            </div>

            <div className="mb-8 flex items-center gap-4 overflow-x-auto pb-2 no-scrollbar">
              {step !== 'cuisine' && (
                <button 
                  onClick={() => {
                    if (step === 'category') setStep('cuisine');
                    if (step === 'dish') setStep('category');
                    if (step === 'side') setStep('dish');
                    if (step === 'summary') selectedDish?.requiresSide ? setStep('side') : setStep('dish');
                  }}
                  className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary"
                >
                  <ChevronLeft className="h-4 w-4" /> Back
                </button>
              )}
              <div className="flex items-center gap-2 text-sm font-medium">
                <span className={step === 'cuisine' ? 'text-primary' : 'text-muted-foreground'}>Cuisine</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground/30" />
                <span className={step === 'category' ? 'text-primary' : 'text-muted-foreground'}>Category</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground/30" />
                <span className={step === 'dish' ? 'text-primary' : 'text-muted-foreground'}>Dish</span>
                {selectedDish?.requiresSide && (
                  <>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/30" />
                    <span className={step === 'side' ? 'text-primary' : 'text-muted-foreground'}>Side</span>
                  </>
                )}
                <ChevronRight className="h-4 w-4 text-muted-foreground/30" />
                <span className={step === 'summary' ? 'text-primary' : 'text-muted-foreground'}>Confirm</span>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      );
    };

    export default Ordering;