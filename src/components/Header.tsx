import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UtensilsCrossed, LogOut, User } from 'lucide-react';
import { useOrderStore } from './Store';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useOrderStore();

  const isChefRoute = location.pathname.startsWith('/chef');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105">
          <div className="rounded-lg bg-primary p-1.5 text-primary-foreground">
            <UtensilsCrossed className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-tight font-serif">Order Up</span>
        </Link>

        <div className="flex items-center gap-4">
          {isAuthenticated && isChefRoute ? (
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-sm font-medium text-muted-foreground bg-secondary px-3 py-1.5 rounded-full">
                <User className="h-4 w-4" />
                <span>Chef Mode</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground transition-all hover:bg-destructive hover:text-destructive-foreground"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
              Guest View
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;