export type Cuisine = 'Nigerian' | 'Continental' | 'Mexican' | 'Italian';

export interface MenuItem {
  id: string;
  cuisine: Cuisine;
  category: string;
  name: string;
  description: string;
  price: number;
  requiresSide: boolean;
  sides?: string[];
  image: string;
}

export const MENU_ITEMS: MenuItem[] = [
  // Nigerian
  {
    id: 'n1',
    cuisine: 'Nigerian',
    category: 'Swallow',
    name: 'Pounded Yam',
    description: 'Smooth, stretchy pounded yam served with your choice of traditional soup.',
    price: 4500,
    requiresSide: true,
    sides: ['Egusi Soup', 'Okra Soup', 'Efo Riro', 'Afang Soup'],
    image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'n2',
    cuisine: 'Nigerian',
    category: 'Rice',
    name: 'Smokey Jollof Rice',
    description: 'Classic West African party-style rice with deep tomato and pepper flavors.',
    price: 3800,
    requiresSide: true,
    sides: ['Fried Plantain', 'Grilled Chicken', 'Beef Suya', 'Moin Moin'],
    image: 'https://images.unsplash.com/photo-1628294895950-9805252327bc?auto=format&fit=crop&q=80&w=800'
  },
  // Italian
  {
    id: 'i1',
    cuisine: 'Italian',
    category: 'Pasta',
    name: 'Fettuccine Carbonara',
    description: 'Creamy egg-based sauce with crispy guanciale and pecorino romano.',
    price: 5200,
    requiresSide: false,
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'i2',
    cuisine: 'Italian',
    category: 'Pizza',
    name: 'Margherita DOP',
    description: 'San Marzano tomatoes, buffalo mozzarella, fresh basil, and extra virgin olive oil.',
    price: 4800,
    requiresSide: false,
    image: 'https://placehold.co/800x400'
  },
  // Mexican
  {
    id: 'm1',
    cuisine: 'Mexican',
    category: 'Tacos',
    name: 'Street Tacos Trio',
    description: 'Three soft corn tortillas with your choice of protein, onion, and cilantro.',
    price: 3500,
    requiresSide: true,
    sides: ['Carne Asada', 'Al Pastor', 'Pollo Asado', 'Carnitas'],
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'm2',
    cuisine: 'Mexican',
    category: 'Burritos',
    name: 'El Gigante Burrito',
    description: 'Massive flour tortilla stuffed with rice, beans, cheese, and salsa.',
    price: 4200,
    requiresSide: true,
    sides: ['Spicy Beef', 'Grilled Chicken', 'Vegetarian Beans'],
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&q=80&w=800'
  },
  // Continental
  {
    id: 'c1',
    cuisine: 'Continental',
    category: 'Grill',
    name: 'Ribeye Steak',
    description: '250g prime beef ribeye, flame-grilled to your preference.',
    price: 12000,
    requiresSide: true,
    sides: ['Mashed Potatoes', 'Steamed Veggies', 'French Fries', 'Garlic Bread'],
    image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'c2',
    cuisine: 'Continental',
    category: 'Seafood',
    name: 'Pan-Seared Salmon',
    description: 'Fresh Atlantic salmon with a lemon butter reduction.',
    price: 9500,
    requiresSide: true,
    sides: ['Asparagus', 'Wild Rice', 'Garden Salad'],
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=800'
  }
];