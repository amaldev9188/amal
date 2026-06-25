import React, { useState, useEffect } from 'react';
import { FoodItem, CartItem, FoodOrder } from '../types';
import { ShoppingCart, Flame, Clock, Heart, Plus, Minus, Check, ChevronRight, MapPin, Truck } from 'lucide-react';

interface FoodOrderingProps {
  onOrderSuccess: (order: FoodOrder) => void;
  ticketId?: string;
  seatInfo?: string;
}

export default function FoodOrdering({ onOrderSuccess, ticketId, seatInfo }: FoodOrderingProps) {
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Burgers' | 'Pizza' | 'Drinks' | 'Desserts' | 'Vegetarian' | 'Kids'>('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeOrder, setActiveOrder] = useState<FoodOrder | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [orderTicketId, setOrderTicketId] = useState(ticketId || '');
  const [section, setSection] = useState('');
  const [row, setRow] = useState<number>(0);
  const [seatNum, setSeatNum] = useState<number>(0);

  // Pre-fill seat info if available (e.g. "East Stand Row 3 Seat 12")
  useEffect(() => {
    if (seatInfo) {
      const parts = seatInfo.split(' ');
      // Simple parsing
      const standIdx = parts.indexOf('Stand');
      const rowIdx = parts.indexOf('Row');
      const seatIdx = parts.indexOf('Seat');
      
      if (standIdx !== -1) {
        setSection(parts.slice(0, standIdx).join(' ') + ' Stand');
      }
      if (rowIdx !== -1 && rowIdx + 1 < parts.length) {
        setRow(Number(parts[rowIdx + 1]));
      }
      if (seatIdx !== -1 && seatIdx + 1 < parts.length) {
        setSeatNum(Number(parts[seatIdx + 1]));
      }
    }
    if (ticketId) {
      setOrderTicketId(ticketId);
    }
  }, [seatInfo, ticketId]);

  // Food Menu catalog
  const foodMenu: FoodItem[] = [
    {
      id: 'burger-1',
      name: 'Gladiator Beef Burger',
      description: 'Double Angus beef patties, Swiss Alpine raclette melt, local forest pickles, brioche bun.',
      price: 14.50,
      category: 'Burgers',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=60&w=400',
      isAvailable: true,
      prepTime: 8,
      inventory: 245,
    },
    {
      id: 'pizza-1',
      name: 'Zurich Melt Pizza Slice',
      description: 'Fresh wood-fired thin crust topped with mountain gruyère, sun-ripened tomatoes, fresh basil.',
      price: 12.00,
      category: 'Pizza',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=60&w=400',
      isAvailable: true,
      prepTime: 6,
      inventory: 118,
    },
    {
      id: 'hotdog-1',
      name: 'Smart Arena Hotdog',
      description: 'Gourmet smoked bratwurst, sweet honey mustard, crispy shallots, loaded in toasted pretzel bun.',
      price: 9.50,
      category: 'Kids',
      image: 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?auto=format&fit=crop&q=60&w=400',
      isAvailable: true,
      prepTime: 4,
      inventory: 92,
    },
    {
      id: 'pretzel-1',
      name: 'Alpine Butter Pretzel',
      description: 'Handmade salted Bavarian-style pretzel served warm with a side of creamy garlic herb butter.',
      price: 6.50,
      category: 'Vegetarian',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=60&w=400',
      isAvailable: true,
      prepTime: 2,
      inventory: 295,
    },
    {
      id: 'drink-1',
      name: 'Zero-Gravity Swiss Cola',
      description: 'Locally crafted refreshing organic botanical cola. Zero sugar, high energy.',
      price: 5.00,
      category: 'Drinks',
      image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=60&w=400',
      isAvailable: true,
      prepTime: 1,
      inventory: 440,
    },
    {
      id: 'drink-2',
      name: 'Craft Arena Brew',
      description: 'Premium Swiss mountain lager brewed specifically for the FIFA smart venue. Crisp & golden.',
      price: 8.50,
      category: 'Drinks',
      image: 'https://images.unsplash.com/photo-1538256824899-c89b4dbcb9c1?auto=format&fit=crop&q=60&w=400',
      isAvailable: true,
      prepTime: 2,
      inventory: 310,
    },
    {
      id: 'dessert-1',
      name: 'Gold Trophy Choco-Waffle',
      description: 'Warm fluffy waffle dusted with organic cocoa, Swiss chocolate drizzle, vanilla bean whip.',
      price: 7.50,
      category: 'Desserts',
      image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&q=60&w=400',
      isAvailable: true,
      prepTime: 5,
      inventory: 85,
    },
  ];

  const filteredMenu = selectedCategory === 'All'
    ? foodMenu
    : foodMenu.filter(item => item.category === selectedCategory);

  const handleAddToCart = (item: FoodItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.foodItem.id === item.id);
      if (existing) {
        return prev.map((i) => i.foodItem.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { foodItem: item, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (item: FoodItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.foodItem.id === item.id);
      if (existing && existing.quantity > 1) {
        return prev.map((i) => i.foodItem.id === item.id ? { ...i, quantity: i.quantity - 1 } : i);
      }
      return prev.filter((i) => i.foodItem.id !== item.id);
    });
  };

  const handleClearCart = () => setCart([]);

  const subtotal = cart.reduce((sum, item) => sum + (item.foodItem.price * item.quantity), 0);
  const bundleDiscount = subtotal >= 25 ? 4.50 : 0; // CHF 4.50 Combo discount
  const finalTotal = subtotal > 0 ? Math.max(0, subtotal - bundleDiscount) : 0;

  // Checkout order
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0 || !name || !phone || !section || !row || !seatNum) return;

    const orderId = `FIFA-ORD-${Math.floor(Math.random() * 90000 + 10000)}`;
    const newOrder: FoodOrder = {
      id: orderId,
      customerName: name,
      phone,
      ticketId: orderTicketId || 'WALK-IN',
      section,
      row,
      seatNumber: seatNum,
      status: 'Received',
      items: cart.map(i => ({
        foodId: i.foodItem.id,
        name: i.foodItem.name,
        quantity: i.quantity,
        price: i.foodItem.price,
      })),
      totalPrice: finalTotal,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      estimatedDelivery: 10,
    };

    setActiveOrder(newOrder);
    onOrderSuccess(newOrder);
    setCart([]);
  };

  // Live tracker state simulation
  useEffect(() => {
    if (!activeOrder) return;

    const interval = setInterval(() => {
      setActiveOrder((prev) => {
        if (!prev) return null;
        if (prev.status === 'Received') {
          return { ...prev, status: 'Preparing', estimatedDelivery: 8 };
        } else if (prev.status === 'Preparing') {
          return { ...prev, status: 'Cooking', estimatedDelivery: 5 };
        } else if (prev.status === 'Cooking') {
          return { ...prev, status: 'Out for Delivery', estimatedDelivery: 2 };
        } else if (prev.status === 'Out for Delivery') {
          clearInterval(interval);
          return { ...prev, status: 'Delivered', estimatedDelivery: 0 };
        }
        return prev;
      });
    }, 8000); // Progress states every 8 seconds for real-time visual excitement

    return () => clearInterval(interval);
  }, [activeOrder]);

  const getStepClass = (currentStatus: string, step: string) => {
    const statuses = ['Received', 'Preparing', 'Cooking', 'Out for Delivery', 'Delivered'];
    const currentIdx = statuses.indexOf(currentStatus);
    const stepIdx = statuses.indexOf(step);

    if (currentIdx >= stepIdx) {
      return 'bg-emerald-600 text-white border-emerald-500';
    }
    return 'bg-slate-100 dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-800';
  };

  return (
    <div id="food-ordering-catalog-container" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* LEFT COLUMN: FOOD CATEGORIES & ITEM GRID */}
      <div className="lg:col-span-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-sans flex items-center gap-2">
              🍔 SeatSide Gastronomy Concessions
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Avoid queues completely! High-quality Alpine specials delivered hot directly to your coordinates.</p>
          </div>
        </div>

        {/* CATEGORY SELECTOR TABS */}
        <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          {['All', 'Burgers', 'Pizza', 'Drinks', 'Desserts', 'Vegetarian', 'Kids'].map((cat) => (
            <button
              id={`select-food-category-${cat}-tab`}
              key={cat}
              onClick={() => setSelectedCategory(cat as any)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl border transition cursor-pointer shrink-0 ${
                selectedCategory === cat
                  ? 'bg-orange-600 border-orange-500 text-white shadow-md'
                  : 'bg-white/5 border-slate-200/10 dark:border-slate-800/20 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FOOD CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredMenu.map((item) => {
            const cartQty = cart.find(i => i.foodItem.id === item.id)?.quantity || 0;
            return (
              <div key={item.id} className="glass-panel glass-panel-hover rounded-3xl overflow-hidden flex flex-col justify-between">
                <div className="relative h-44 bg-slate-950">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover filter brightness-90" />
                  <div className="absolute top-3 right-3 px-2.5 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-orange-400 fill-current" />
                    <span className="text-2xs font-bold text-white font-mono">CHF {item.price.toFixed(2)}</span>
                  </div>
                  {item.category === 'Vegetarian' && (
                    <span className="absolute top-3 left-3 px-2 py-0.5 bg-emerald-500/80 text-white text-[9px] font-bold tracking-wider rounded uppercase">
                      VEG-FRIENDLY
                    </span>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-slate-800 dark:text-white font-sans">{item.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{item.description}</p>
                  </div>

                  <div className="flex items-center justify-between text-2xs text-slate-600 dark:text-slate-400 font-mono">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.prepTime} mins delivery</span>
                    </div>
                    <span>Inventory: {item.inventory} portions</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/10 dark:border-slate-800/20">
                    <div className="flex items-center gap-1.5 text-yellow-500 font-bold text-2xs">
                      ★ 4.8
                    </div>
                    
                    {cartQty > 0 ? (
                      <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200/10 dark:border-slate-800/20">
                        <button
                          id={`decrease-qty-${item.id}`}
                          onClick={() => handleRemoveFromCart(item)}
                          className="w-7 h-7 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-700 dark:text-white hover:bg-slate-200 cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-mono text-xs font-bold px-1 text-slate-800 dark:text-white">{cartQty}</span>
                        <button
                          id={`increase-qty-${item.id}`}
                          onClick={() => handleAddToCart(item)}
                          className="w-7 h-7 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-700 dark:text-white hover:bg-slate-200 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        id={`add-to-cart-btn-${item.id}`}
                        onClick={() => handleAddToCart(item)}
                        className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-xl transition shadow-md shadow-orange-900/10 cursor-pointer"
                      >
                        Add to Seat Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT COLUMN: ACTIVE SHOPPING CART & REAL-TIME TRACKER */}
      <div className="lg:col-span-4 space-y-6">
        {/* ACTIVE LIVE DELIVERY TRACKER (SHOW IF ORDER EXISTS) */}
        {activeOrder && (
          <div className="glass-panel rounded-3xl p-6 border-orange-500/30 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-200/10 dark:border-slate-800/20 pb-3">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-orange-400" />
                <h4 className="font-sans font-bold text-slate-800 dark:text-white">Seat Delivery Live</h4>
              </div>
              <span className="text-3xs text-yellow-500 font-mono bg-yellow-500/10 px-2 py-0.5 rounded uppercase">
                {activeOrder.status}
              </span>
            </div>

            <div className="space-y-4 text-center">
              <div className="bg-slate-100 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/10 dark:border-slate-800/20 space-y-2 text-left">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Order Reference:</span>
                  <span className="font-mono text-slate-800 dark:text-white font-semibold">{activeOrder.id}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Coordinates:</span>
                  <span className="text-emerald-500 font-bold">{activeOrder.section} (R{activeOrder.rowNumber}, S{activeOrder.seatNumber})</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Estimated Delivery:</span>
                  <span className="font-semibold text-orange-400 font-mono">{activeOrder.estimatedDelivery} minutes</span>
                </div>
              </div>

              {/* DYNAMIC PROGRESS STATE STAGE */}
              <div className="flex justify-between items-center relative pt-2">
                <div className="absolute top-5 inset-x-2 h-0.5 bg-slate-200 dark:bg-slate-800 z-0" />
                {['Received', 'Preparing', 'Cooking', 'Out for Delivery', 'Delivered'].map((step, s_idx) => {
                  const isActiveStep = activeOrder.status === step;
                  return (
                    <div key={step} className="flex flex-col items-center z-10">
                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-3xs font-bold ${getStepClass(activeOrder.status, step)}`}>
                        {activeOrder.status === step ? '●' : s_idx + 1}
                      </div>
                      <span className="text-[8px] text-slate-400 font-mono mt-1 rotate-12 sm:rotate-0">
                        {step.split(' ')[0]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* CART & CHECKOUT CONTAINER */}
        <div className="backdrop-filter backdrop-blur-xl bg-white/10 dark:bg-slate-950/40 border border-slate-200/20 dark:border-slate-800/40 rounded-3xl p-6 shadow-xl space-y-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white font-sans border-b border-slate-200/10 dark:border-slate-800/20 pb-4 flex justify-between items-center">
            <span>🛒 Selected Concessions</span>
            {cart.length > 0 && (
              <button
                id="clear-cart-items-btn"
                onClick={handleClearCart}
                className="text-3xs text-rose-500 hover:text-rose-400 font-semibold uppercase cursor-pointer"
              >
                Clear All
              </button>
            )}
          </h3>

          {cart.length > 0 ? (
            <div className="space-y-6">
              {/* CART LIST */}
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
                {cart.map((item) => (
                  <div key={item.foodItem.id} className="flex items-center justify-between text-xs py-1 border-b border-slate-200/5 dark:border-slate-800/10">
                    <div className="space-y-0.5">
                      <span className="font-bold text-slate-800 dark:text-white">{item.foodItem.name}</span>
                      <p className="text-3xs text-slate-400">CHF {item.foodItem.price.toFixed(2)} each</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-500">x{item.quantity}</span>
                      <span className="font-mono text-slate-800 dark:text-white font-bold">CHF {(item.foodItem.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* CONCESSIONS DUAL COMBOS OFFERS */}
              {subtotal < 25 && (
                <div className="bg-orange-500/10 border border-orange-500/20 p-3 rounded-2xl text-[11px] text-orange-600 dark:text-orange-400">
                  💡 **Matchday combo discount:** Spend **CHF 25.00** or more and unlock a flat CHF 4.50 stadium concession voucher instantly!
                </div>
              )}

              {/* BILL SUMMARY */}
              <div className="space-y-2 border-t border-slate-200/10 dark:border-slate-800/20 pt-4 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Items Subtotal:</span>
                  <span className="text-slate-800 dark:text-white">CHF {subtotal.toFixed(2)}</span>
                </div>
                {bundleDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Bundle Discount:</span>
                    <span>-CHF {bundleDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-extrabold border-t border-slate-200/10 dark:border-slate-800/20 pt-2 text-slate-800 dark:text-white">
                  <span>Grand Total:</span>
                  <span>CHF {finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* ORDER CHECKOUT FORM */}
              <form onSubmit={handleCheckoutSubmit} className="space-y-4 border-t border-slate-200/10 dark:border-slate-800/20 pt-4">
                <span className="text-2xs text-slate-400 uppercase tracking-widest font-bold block">Concessions In-Seat delivery</span>

                <div>
                  <label htmlFor="food-order-name" className="text-3xs text-slate-400 uppercase block font-medium mb-1">Spectator Name</label>
                  <input
                    id="food-order-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Liam Muller"
                    className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 text-xs rounded-xl focus:outline-none focus:border-orange-500 text-slate-800 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="food-order-phone" className="text-3xs text-slate-400 uppercase block font-medium mb-1">Mobile Contact</label>
                    <input
                      id="food-order-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+41 78..."
                      className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 text-xs rounded-xl focus:outline-none focus:border-orange-500 text-slate-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="food-order-ticket" className="text-3xs text-slate-400 uppercase block font-medium mb-1">Ticket ID</label>
                    <input
                      id="food-order-ticket"
                      type="text"
                      value={orderTicketId}
                      onChange={(e) => setOrderTicketId(e.target.value)}
                      placeholder="FIFA-SA-E..."
                      className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 text-xs rounded-xl focus:outline-none focus:border-orange-500 text-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                {/* TARGET COORDINATES COORDINATORS */}
                <div className="space-y-2 bg-slate-100 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-slate-200/10 dark:border-slate-800/20">
                  <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold block mb-2">GPS Seat coordinate lock</span>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label htmlFor="food-order-section" className="text-[9px] text-slate-500 block mb-1">Stand/Section</label>
                      <input
                        id="food-order-section"
                        type="text"
                        required
                        value={section}
                        onChange={(e) => setSection(e.target.value)}
                        placeholder="East"
                        className="w-full bg-white dark:bg-slate-950 p-2 text-xs rounded-lg text-slate-800 dark:text-white font-bold"
                      />
                    </div>
                    <div>
                      <label htmlFor="food-order-row" className="text-[9px] text-slate-500 block mb-1">Row Num</label>
                      <input
                        id="food-order-row"
                        type="number"
                        required
                        min="1"
                        value={row || ''}
                        onChange={(e) => setRow(Number(e.target.value))}
                        placeholder="4"
                        className="w-full bg-white dark:bg-slate-950 p-2 text-xs rounded-lg text-slate-800 dark:text-white font-bold"
                      />
                    </div>
                    <div>
                      <label htmlFor="food-order-seat" className="text-[9px] text-slate-500 block mb-1">Seat Num</label>
                      <input
                        id="food-order-seat"
                        type="number"
                        required
                        min="1"
                        value={seatNum || ''}
                        onChange={(e) => setSeatNum(Number(e.target.value))}
                        placeholder="12"
                        className="w-full bg-white dark:bg-slate-950 p-2 text-xs rounded-lg text-slate-800 dark:text-white font-bold"
                      />
                    </div>
                  </div>
                </div>

                <button
                  id="submit-food-checkout-btn"
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600 text-white font-bold text-sm rounded-xl transition shadow-lg shadow-orange-950/20 cursor-pointer"
                >
                  Deliver Concessions (CHF {finalTotal.toFixed(2)})
                </button>
              </form>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-500">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <p className="text-xs max-w-xs mx-auto">
                Your concessions tray is empty. Tap any premium Swiss food card or combo pack to add it to your stadium seat-side delivery tray.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
