import React from 'react';
    import { UtensilsCrossed, Github, Twitter, Instagram } from 'lucide-react';

    const Footer: React.FC = () => {
      return (
        <footer className="border-t border-border/40 bg-muted/30">
          <div className="container mx-auto px-6 py-12">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <UtensilsCrossed className="h-6 w-6 text-primary" />
                  <span className="text-xl font-bold font-serif">Order Up</span>
                </div> 
                <p className="max-w-xs text-sm text-muted-foreground leading-relaxed">
                  The next generation of restaurant management. Batching orders by table to ensure everyone eats together, every time.
                </p>
              </div>
              
              <div>
                <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">Product</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-primary transition-colors">Kitchen Display</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Table Management</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Menu Builder</a></li>
                </ul>
              </div>

              <div>
                <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">Connect</h4>
                <div className="flex gap-4">
                  <button className="rounded-full p-2 hover:bg-primary/10 transition-colors">
                    <Twitter className="h-5 w-5" />
                  </button>
                  <button className="rounded-full p-2 hover:bg-primary/10 transition-colors">
                    <Instagram className="h-5 w-5" />
                  </button>
                  <button className="rounded-full p-2 hover:bg-primary/10 transition-colors">
                    <Github className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-12 border-t border-border/40 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-xs text-muted-foreground">
                © 2026 Order Up Systems Inc. All rights reserved.
              </p>
              <div className="flex gap-6 text-xs text-muted-foreground">
                <a href="#" className="hover:text-primary">Privacy Policy</a>
                <a href="#" className="hover:text-primary">Terms of Service</a>
              </div>
            </div>
          </div>
        </footer>
      );
    };

    export default Footer;