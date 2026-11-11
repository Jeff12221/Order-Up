INSERT INTO restaurant_tables (table_number, status)
VALUES (1,'available'),(2,'available'),(3,'available'),(4,'available'),(5,'available'),
       (6,'available'),(7,'available'),(8,'available'),(9,'available'),(10,'available')
ON CONFLICT (table_number) DO NOTHING;

INSERT INTO menu_items (name, description, price, cuisine, image_url, is_available) VALUES
('Pounded Yam','Smooth pounded yam served with your choice of traditional soup.',4500,'Nigerian','https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&q=80&w=800',TRUE),
('Smokey Jollof Rice','Classic West African party-style rice with tomato and pepper flavors.',3800,'Nigerian','https://images.unsplash.com/photo-1628294895950-9805252327bc?auto=format&fit=crop&q=80&w=800',TRUE),
('Fettuccine Carbonara','Creamy egg-based sauce with guanciale and pecorino romano.',5200,'Italian','https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&q=80&w=800',TRUE),
('Margherita DOP','San Marzano tomatoes, buffalo mozzarella, basil, and olive oil.',4800,'Italian','https://placehold.co/800x400',TRUE),
('Street Tacos Trio','Three soft corn tortillas with protein, onion, and cilantro.',3500,'Mexican','https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?auto=format&fit=crop&q=80&w=800',TRUE),
('El Gigante Burrito','Flour tortilla stuffed with rice, beans, cheese, and salsa.',4200,'Mexican','https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&q=80&w=800',TRUE),
('Ribeye Steak','250g prime beef ribeye, flame-grilled to your preference.',12000,'Continental','https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&q=80&w=800',TRUE),
('Pan-Seared Salmon','Fresh Atlantic salmon with a lemon butter reduction.',9500,'Continental','https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=800',TRUE)
ON CONFLICT DO NOTHING;
