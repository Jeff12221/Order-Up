import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check, Utensils } from 'lucide-react';
import { useOrderStore } from '../components/Store';
import { MENU_ITEMS, type Cuisine, type MenuItem } from '../components/MenuData';
import { apiRequest, type ApiMenuItem } from '../components/Api';
import Header from '../components/Header';

type Step = 'cuisine' | 'category' | 'dish' | 'side' | 'summary';
type Dish = Omit<MenuItem, 'id'> & { id: number };

const Ordering: React.FC = () => {
  const navigate = useNavigate();
  const { sessions, activeSessionId, clearSession } = useOrderStore();
  const session = sessions.find((entry) => entry.id === activeSessionId);
  const customer = session?.customers[0];
  const [menuByCuisine, setMenuByCuisine] = useState<Record<string, Dish[]>>({});
  const [menuLoading, setMenuLoading] = useState(true);
  const [menuError, setMenuError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<Step>('cuisine');
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [selectedSide, setSelectedSide] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    apiRequest<Record<string, ApiMenuItem[]>>('/api/menu')
      .then((grouped) => {
        if (!active) return;
        const adapted: Record<string, Dish[]> = {};
        Object.entries(grouped).forEach(([cuisine, items]) => {
          adapted[cuisine] = items.map((item) => {
            const extra = MENU_ITEMS.find((local) => local.name === item.name);
            return {
              id: item.id,
              cuisine: cuisine as Cuisine,
              category: extra?.category ?? 'Main dishes',
              name: item.name,
              description: item.description,
              price: item.price,
              requiresSide: extra?.requiresSide ?? false,
              sides: extra?.sides,
              image: item.image_url || extra?.image || '',
            };
          });
        });
        setMenuByCuisine(adapted);
      })
      .catch((error: Error) => active && setMenuError(error.message))
      .finally(() => active && setMenuLoading(false));
    return () => { active = false; };
  }, []);

  const cuisines = Object.keys(menuByCuisine);
  const categories = useMemo(() => selectedCuisine
    ? Array.from(new Set((menuByCuisine[selectedCuisine] || []).map((item) => item.category)))
    : [], [menuByCuisine, selectedCuisine]);
  const dishes = selectedCuisine && selectedCategory
    ? (menuByCuisine[selectedCuisine] || []).filter((item) => item.category === selectedCategory)
    : [];

  const placeOrder = async () => {
    if (!selectedDish || !session || !customer) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      await apiRequest('/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          name: customer.name,
          table_number: session.tableNumber,
          items: [{ menu_item_id: selectedDish.id, quantity: 1, notes: selectedSide || '' }],
        }),
      });
      clearSession();
      navigate('/', { replace: true });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Could not place the order.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!session || !customer) {
    return <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <Utensils className="mb-4 h-16 w-16 text-muted" />
      <h2 className="mb-2 text-2xl font-bold">Start an order first</h2>
      <button onClick={() => navigate('/')} className="rounded-lg bg-primary px-6 py-3 font-semibold text-white">Back to Order-Up</button>
    </div>;
  }

  const stepBack = () => {
    if (step === 'category') setStep('cuisine');
    if (step === 'dish') setStep('category');
    if (step === 'side') setStep('dish');
    if (step === 'summary') setStep(selectedDish?.requiresSide ? 'side' : 'dish');
  };

  return <div className="flex min-h-screen flex-col bg-background">
    <Header />
    <main className="container mx-auto max-w-4xl flex-1 px-6 py-12">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h2 className="font-serif text-3xl font-bold">Table {session.tableNumber}</h2>
          <p className="text-muted-foreground">Ordering for: <span className="font-semibold text-foreground">{customer.name}</span></p>
        </div>
      </div>
      <div className="mb-8 flex items-center gap-4 overflow-x-auto pb-2">
        {step !== 'cuisine' && <button onClick={stepBack} className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary"><ChevronLeft className="h-4 w-4" /> Back</button>}
        <div className="flex items-center gap-2 text-sm font-medium">
          {(['Cuisine', 'Category', 'Dish', ...(selectedDish?.requiresSide ? ['Side'] : []), 'Confirm']).map((label, index) => <React.Fragment key={label}>
            {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground/30" />}
            <span className={(label === 'Confirm' ? step === 'summary' : label.toLowerCase() === step) ? 'text-primary' : 'text-muted-foreground'}>{label}</span>
          </React.Fragment>)}
        </div>
      </div>

      {menuLoading && <p className="py-16 text-center text-muted-foreground">Loading menu…</p>}
      {menuError && <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center text-destructive">Could not load the menu: {menuError}</div>}
      {!menuLoading && !menuError && <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
          {step === 'cuisine' && <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{cuisines.map((cuisine) => <button key={cuisine} onClick={() => { setSelectedCuisine(cuisine); setStep('category'); }} className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 text-left hover:border-primary hover:shadow-lg"><h3 className="font-serif text-2xl font-bold">{cuisine}</h3><p className="mt-1 text-sm text-muted-foreground">Explore {cuisine.toLowerCase()} flavors</p><Utensils className="absolute -bottom-4 -right-4 h-24 w-24 opacity-10 transition-transform group-hover:scale-110" /></button>)}</div>}
          {step === 'category' && <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{categories.map((category) => <button key={category} onClick={() => { setSelectedCategory(category); setStep('dish'); }} className="rounded-xl border border-border bg-card p-6 text-left hover:border-primary hover:bg-primary/5"><span className="text-lg font-semibold">{category}</span></button>)}</div>}
          {step === 'dish' && <div className="grid grid-cols-1 gap-6">{dishes.map((dish) => <button key={dish.id} onClick={() => { setSelectedDish(dish); setSelectedSide(null); setStep(dish.requiresSide ? 'side' : 'summary'); }} className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-4 text-left transition-all hover:border-primary hover:shadow-md md:flex-row">{dish.image && <img src={dish.image} alt={dish.name} className="h-32 w-full rounded-xl object-cover md:w-48" />}<div className="flex-1 py-2"><div className="flex items-start justify-between gap-3"><h3 className="text-xl font-bold">{dish.name}</h3><span className="whitespace-nowrap font-mono font-bold text-primary">₦{dish.price.toLocaleString()}</span></div><p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{dish.description}</p></div></button>)}</div>}
          {step === 'side' && <div className="space-y-4"><h3 className="mb-4 text-lg font-semibold">Choose your side/protein:</h3><div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{selectedDish?.sides?.map((side) => <button key={side} onClick={() => { setSelectedSide(side); setStep('summary'); }} className="rounded-xl border border-border bg-card p-4 text-left hover:border-primary">{side}</button>)}</div></div>}
          {step === 'summary' && <div className="rounded-2xl border border-border bg-card p-8 shadow-sm"><div className="mb-8 flex items-center gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600"><Check className="h-6 w-6" /></div><div><h3 className="text-xl font-bold">Confirm Order</h3><p className="text-sm text-muted-foreground">Review your order for {customer.name}</p></div></div><div className="mb-8 space-y-4 border-y border-border py-6"><div className="flex justify-between"><span className="text-muted-foreground">Dish</span><span className="font-semibold">{selectedDish?.name}</span></div>{selectedSide && <div className="flex justify-between"><span className="text-muted-foreground">Side/Choice</span><span className="font-semibold">{selectedSide}</span></div>}<div className="flex justify-between border-t border-border pt-4"><span className="font-bold">Total</span><span className="font-bold text-primary">₦{selectedDish?.price.toLocaleString()}</span></div></div>{submitError && <p className="mb-4 text-sm text-destructive">{submitError}</p>}<button disabled={submitting} onClick={placeOrder} className="w-full rounded-xl bg-primary py-4 text-lg font-bold text-primary-foreground transition-all hover:scale-[1.02] disabled:opacity-60">{submitting ? 'Placing order…' : 'Place Order'}</button></div>}
        </motion.div>
      </AnimatePresence>}
    </main>
  </div>;
};

export default Ordering;
