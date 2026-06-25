import React, { useState, useEffect } from 'react';
import { Seat, FoodOrder, EmergencyTicket, FeedbackItem, NotificationItem } from './types';
import { Sun, Moon, MapPin, Compass, ShieldAlert, Award, Bot, Info, Image as ImageIcon, Flame, ShoppingBag, Eye, Calendar, Accessibility } from 'lucide-react';
import SeatBookingMap from './components/SeatBookingMap';
import FoodOrdering from './components/FoodOrdering';
import AIAssistant from './components/AIAssistant';
import AdminConsole from './components/AdminConsole';

export default function App() {
  const [activeTab, setActiveTab] = useState<'Home' | 'Stadium' | 'Gallery' | 'Booking' | 'Food' | 'Travel' | 'AI' | 'Admin'>('Home');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Unified global systems states
  const [seats, setSeats] = useState<Seat[]>([]);
  const [foodOrders, setFoodOrders] = useState<FoodOrder[]>([]);
  const [emergencies, setEmergencies] = useState<EmergencyTicket[]>([]);
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // User session references
  const [userTicketId, setUserTicketId] = useState<string>('');
  const [userSeatInfo, setUserSeatInfo] = useState<string>('');

  // Travel Guide questionnaire state
  const [travelForm, setTravelForm] = useState({
    budget: 'Standard',
    groupType: 'Family',
    transit: 'Metro',
  });
  const [generatedItinerary, setGeneratedItinerary] = useState<any | null>(null);

  // Home Planner State
  const [homePlanner, setHomePlanner] = useState({
    budget: 'Standard',
    fans: '2 Fans',
    preference: 'Excellent Field View',
    food: 'Burger & Drinks Combo',
    arrival: 'Zurich S-Bahn Metro',
  });
  const [homePlannerOutput, setHomePlannerOutput] = useState<any | null>({
    section: 'Premium East Stand',
    seats: 'Row 3, Seats 12-13',
    viewQuality: '⭐️ 4.9/5 Field Line Sight',
    foodPackage: '2x Gladiator Burger + Cold Pepsi',
    travelRoute: 'Metro Line 4 directly to Station Arena (12 mins)',
    estimatedCost: '₹5400 total (₹2500/seat + ₹200/food)',
  });

  const handleHomePlanMatchday = () => {
    let section = 'Standard West Stand';
    let seatPrice = 1500;
    let viewQuality = '⭐️ 4.4/5 Atmospheric View';
    
    if (homePlanner.budget === 'VIP') {
      section = 'Exclusive VIP Club Deck';
      seatPrice = 5000;
      viewQuality = '⭐️ 5.0/5 Luxury Glass Box View';
    } else if (homePlanner.budget === 'Standard') {
      section = 'Premium East Stand';
      seatPrice = 2500;
      viewQuality = '⭐️ 4.8/5 Elevated Sideline Sight';
    } else {
      section = 'Economy South Curve';
      seatPrice = 800;
      viewQuality = '⭐️ 4.2/5 Vibrant Supporter Atmosphere';
    }

    if (homePlanner.preference === 'Family Friendly') {
      section = 'North Stand Family Tier';
      seatPrice = 1500;
      viewQuality = '⭐️ 4.5/5 Safe Family Environment';
    }

    const fanCount = parseInt(homePlanner.fans) || 2;
    const foodCostMap: Record<string, number> = {
      'Burger & Drinks Combo': 250,
      'Premium Pizza Combo': 350,
      'Healthy Green Salad': 180,
      'Hot Dogs & Soft Drink': 150
    };
    
    const foodPrice = foodCostMap[homePlanner.food] || 200;
    const totalCost = (seatPrice * fanCount) + (foodPrice * fanCount);

    let route = 'Metro Line 4 directly to Station Arena (15 mins)';
    if (homePlanner.arrival === 'Private Car Parking') {
      route = 'Assigned VIP parking slot in Arena Sector B-West (7 mins walk)';
    } else if (homePlanner.arrival === 'Taxi Cab Dropoff') {
      route = 'Express taxi dropoff zone at Gate Terminal 2 North';
    }

    setHomePlannerOutput({
      section,
      seats: `Row ${homePlanner.budget === 'VIP' ? '2' : '3'}, Seats ${Array.from({ length: fanCount }, (_, i) => 12 + i).join('-')}`,
      viewQuality,
      foodPackage: `${fanCount}x ${homePlanner.food}`,
      travelRoute: route,
      estimatedCost: `₹${totalCost} total (₹${seatPrice}/seat + ₹${foodPrice}/food)`,
    });
  };

  // New emergency submission
  const [emergType, setEmergType] = useState<'Medical' | 'Security' | 'Lost Child' | 'Lost Item' | 'Suspicious Activity'>('Medical');
  const [emergDesc, setEmergDesc] = useState('');
  const [emergSec, setEmergSec] = useState('East Stand');
  const [emergRow, setEmergRow] = useState(1);
  const [emergSeat, setEmergSeat] = useState(1);
  const [showEmergSuccess, setShowEmergSuccess] = useState(false);

  // Feedback form states
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(5);

  const [timeLeft, setTimeLeft] = useState({
    days: 1,
    hours: 11,
    minutes: 41,
    seconds: 14
  });

  useEffect(() => {
    // July 12, 2026 20:45:00
    const targetDate = new Date('2026-07-12T20:45:00').getTime();
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;
      
      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 1000);
        
        setTimeLeft({ days: d, hours: h, minutes: m, seconds: s });
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Load theme and configure mock seat data
  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme);
      document.documentElement.className = savedTheme;
    } else {
      setTheme('light');
      document.documentElement.className = 'light';
    }

    // Populate initial stadium seats
    const initialSeats: Seat[] = [];
    const stands: Seat['section'][] = ['East', 'West', 'North', 'South', 'VIP', 'Accessible'];
    stands.forEach((stand) => {
      let rows = 4;
      let seatsPerRow = 6;
      let price = 55;
      
      if (stand === 'VIP') {
        rows = 2;
        seatsPerRow = 4;
        price = 250;
      } else if (stand === 'East' || stand === 'West') {
        price = 85;
      } else if (stand === 'Accessible') {
        rows = 2;
        seatsPerRow = 4;
        price = 45;
      }

      for (let r = 1; r <= rows; r++) {
        for (let s = 1; s <= seatsPerRow; s++) {
          // Semi-randomized state
          let status: Seat['status'] = 'Available';
          if (r === 1 && s % 3 === 0) status = 'Booked';
          if (r === 2 && s === 4) status = 'Reserved';
          if (r === 4 && s === 5) status = 'Blocked';

          initialSeats.push({
            id: `${stand}-${r}-${s}`,
            section: stand,
            row: r,
            number: s,
            status,
            price,
            rating: stand === 'VIP' ? 5.0 : stand === 'East' ? 4.8 : 4.4,
            bestView: (stand === 'East' && r === 3) || stand === 'VIP',
            familyRecommended: r >= 3 && stand !== 'VIP',
          });
        }
      }
    });
    setSeats(initialSeats);

    // Initial notifications
    setNotifications([
      { id: '1', title: 'Stadium Access', message: 'Gates are currently open. Enter via the terminal suggested in your ticket.', type: 'success', createdAt: '18:30' },
      { id: '2', title: 'F&B Rush', message: 'High queues in Central Atrium. Order to seat via the Concessions tab to bypass.', type: 'info', createdAt: '18:45' },
    ]);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('app-theme', nextTheme);
    document.documentElement.className = nextTheme;
  };

  // State modifier handlers
  const handleBookSeat = (seatId: string, name: string, phone: string, email: string) => {
    setSeats((prev) =>
      prev.map((s) => (s.id === seatId ? { ...s, status: 'Booked' } : s))
    );
    const targetSeat = seats.find((s) => s.id === seatId);
    if (targetSeat) {
      const generatedTicket = `FIFA-SA-${targetSeat.section[0]}${targetSeat.row}-${targetSeat.number}-${Math.floor(Math.random() * 9000 + 1000)}`;
      setUserTicketId(generatedTicket);
      setUserSeatInfo(`${targetSeat.section} Stand Row ${targetSeat.row} Seat ${targetSeat.number}`);
    }
  };

  const handleOrderSuccess = (order: FoodOrder) => {
    setFoodOrders((prev) => [order, ...prev]);
  };

  const handleUpdateOrderStatus = (orderId: string, status: FoodOrder['status']) => {
    setFoodOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
    );
  };

  const handleUpdateEmergencyStatus = (ticketId: string, status: EmergencyTicket['status'], staff: string) => {
    setEmergencies((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status, assignedStaff: staff } : t))
    );
  };

  // Submit Safety dispatch from page
  const handleEmergencySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emergDesc) return;

    const newTicket: EmergencyTicket = {
      id: `EMERG-${Math.floor(Math.random() * 900 + 100)}`,
      type: emergType,
      description: emergDesc,
      section: emergSec,
      row: emergRow,
      seat: emergSeat,
      priority: emergType === 'Medical' || emergType === 'Security' ? 'High' : 'Medium',
      assignedStaff: 'Unassigned',
      status: 'Pending',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setEmergencies((prev) => [newTicket, ...prev]);
    setEmergDesc('');
    setShowEmergSuccess(true);
    setTimeout(() => setShowEmergSuccess(false), 5000);
  };

  // Submit fan feedback
  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackMsg) return;

    const newFeedback: FeedbackItem = {
      id: `FEED-${Date.now()}`,
      name: feedbackName || 'Anonymous Fan',
      message: feedbackMsg,
      rating: feedbackRating,
      sentiment: feedbackRating >= 4 ? 'positive' : feedbackRating === 3 ? 'neutral' : 'negative',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setFeedbackList((prev) => [newFeedback, ...prev]);
    setFeedbackName('');
    setFeedbackMsg('');
    alert('Thank you for logging your feedback! Our stadium AI systems have processed your sentiment score.');
  };

  // Travel Questionnaire custom generation
  const handleTravelGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate smart curation algorithm based on user selection
    const pricing = travelForm.budget === 'Economy' ? 'CHF 45-80 total' : travelForm.budget === 'Standard' ? 'CHF 120-180 total' : 'CHF 350+ total';
    const hotel = travelForm.budget === 'Economy' ? 'Zurich Alpine Hostel (Zentral)' : travelForm.budget === 'Standard' ? 'Novotel West Airport Plaza' : 'Dolder Grand Luxury Resort';
    const routing = travelForm.transit === 'Metro' ? 'Zurich Main S-Bahn Line M4' : travelForm.transit === 'Taxi' ? 'VeloTaxi Electric Cabin Car' : 'eBus Line 12 Shuttle';

    setGeneratedItinerary({
      pricing,
      hotel,
      routing,
      activity: travelForm.groupType === 'Family' ? 'Scenic Lindt Chocolate Museum & Lake Cruise' : travelForm.groupType === 'Solo' ? 'Zurich Old Town Pubcrawl & Football Museum' : 'Rhine Falls day tour & VIP stadium lounge',
    });
  };

  const [selectedSeatId, setSelectedSeatId] = useState<string | null>(null);

  return (
    <div className="relative min-h-screen text-slate-950 dark:text-white transition-colors duration-300 bg-white dark:bg-slate-950">
      {/* FLOATING HEADER */}
      <header className="sticky top-0 z-40 w-full px-6 py-4">
        <div className="max-w-7xl mx-auto bg-white/95 dark:bg-slate-950/95 backdrop-blur-md rounded-2xl px-6 py-3 flex items-center justify-between border border-slate-200 dark:border-slate-800/80 shadow-sm transition-all">
          
          {/* Logo Section */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('Home')}>
            <div className="w-10 h-10 rounded-full bg-[#2E7D32] flex items-center justify-center text-white font-black text-xl shadow-sm select-none">
              S
            </div>
            <div className="flex flex-col">
              <h1 className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white leading-none">SwissArena AI</h1>
              <span className="text-[9px] text-slate-400 font-bold tracking-widest uppercase mt-0.5">FIFA HACKUP</span>
            </div>
          </div>

          {/* MAIN HORIZONTAL NAVIGATION */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {[
              { id: 'Home', label: 'Home' },
              { id: 'Stadium', label: 'Stadium' },
              { id: 'Gallery', label: 'Gallery' },
              { id: 'Booking', label: 'Seats' },
              { id: 'Food', label: 'Food' },
              { id: 'Travel', label: 'Travel' },
              { id: 'AI', label: 'AI Assistant' },
            ].map((tab) => (
              <button
                id={`nav-tab-btn-${tab.id}`}
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-tight transition-all duration-200 cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#2E7D32] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-[#2E7D32] dark:hover:text-[#66BB6A] hover:bg-slate-100/50 dark:hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* CONTROL UTILITIES */}
          <div className="flex items-center gap-4">
            {/* Cart with Badge */}
            <div className="relative p-1.5 text-slate-600 dark:text-slate-300 hover:text-[#2E7D32] transition cursor-pointer" onClick={() => setActiveTab('Food')}>
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-[#2E7D32] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-950">
                2
              </span>
            </div>

            {/* Admin/Operations button */}
            <button
              onClick={() => setActiveTab('Admin')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold border transition duration-200 cursor-pointer ${
                activeTab === 'Admin'
                  ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900'
                  : 'text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              Admin
            </button>

            {/* Light/Dark Toggle */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-white/10 transition cursor-pointer"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE TABS TRAY (Visible only on small screens) */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 dark:bg-slate-950/95 border-t border-slate-200 dark:border-slate-800 py-3.5 px-4 flex justify-between items-center z-40 shadow-xl">
        {[
          { id: 'Home', label: 'Home' },
          { id: 'Stadium', label: 'Stadium' },
          { id: 'Booking', label: 'Booking' },
          { id: 'Food', label: 'Food' },
          { id: 'AI', label: 'AI' },
          { id: 'Admin', label: 'Admin' },
        ].map((tab) => (
          <button
            id={`mobile-tab-btn-${tab.id}`}
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-2 rounded-lg text-2xs uppercase tracking-wider font-bold transition-all duration-150 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-sm font-extrabold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* MAIN LAYOUT CANVAS */}
      <main className="max-w-7xl mx-auto px-6 py-4 pb-24 md:pb-8">

        {/* TAB 1: HERO HOME */}
        {activeTab === 'Home' && (
          <div className="space-y-20 animate-fade-in text-slate-800">
            {/* HERO SECTION */}
            <section className="relative overflow-hidden rounded-[32px] border border-slate-200/20 dark:border-slate-800 shadow-2xl bg-slate-950 text-white">
              {/* Stadium Sunset Background */}
              <div 
                className="absolute inset-0 bg-cover bg-center filter brightness-55"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80&w=1600')` }}
              />
              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/20 to-transparent" />

              {/* Hero Inner Content */}
              <div className="relative z-10 max-w-7xl mx-auto px-8 py-16 md:py-24 flex flex-col justify-between min-h-[580px] md:min-h-[640px]">
                
                {/* Upper Tag, Title and Description */}
                <div className="max-w-2xl space-y-6">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/10 backdrop-blur-md text-white text-xs font-bold tracking-wide rounded-full border border-white/20 select-none">
                    ✨ FIFA World Cup • Smart Stadium
                  </span>
                  
                  <h1 className="text-4xl md:text-6xl font-black text-white leading-none tracking-tight font-sans select-none">
                    Experience Football <br />
                    <span className="text-[#D4AF37] bg-clip-text text-transparent bg-gradient-to-r from-[#F59E0B] via-[#D4AF37] to-[#FBBF24]">
                      Beyond The Match
                    </span>
                  </h1>
                  
                  <p className="text-slate-200 text-sm md:text-base leading-relaxed font-medium">
                    Book seats, order food to your row, navigate the stadium, and let our AI plan your entire match day — all in one place.
                  </p>

                  {/* Buttons Action Group */}
                  <div className="flex flex-wrap gap-4 pt-2">
                    <button
                      id="hero-book-seats-btn"
                      onClick={() => setActiveTab('Booking')}
                      className="px-6 py-3.5 bg-[#2E7D32] hover:bg-[#2E7D32]/90 text-white font-black text-xs uppercase tracking-wider rounded-full shadow-lg flex items-center gap-2 hover:scale-[1.03] transition-transform duration-200 cursor-pointer"
                    >
                      Book Seats <span className="text-sm">→</span>
                    </button>
                    <button
                      id="hero-order-food-btn"
                      onClick={() => setActiveTab('Food')}
                      className="px-6 py-3.5 bg-white/95 text-slate-800 hover:bg-white font-extrabold text-xs uppercase tracking-wider rounded-full shadow-md hover:scale-[1.03] transition-transform duration-200 cursor-pointer"
                    >
                      Order Food
                    </button>
                    <button
                      id="hero-talk-ai-btn"
                      onClick={() => setActiveTab('AI')}
                      className="px-6 py-3.5 bg-slate-900/40 backdrop-blur-sm border border-white/30 text-white hover:bg-slate-900/60 font-extrabold text-xs uppercase tracking-wider rounded-full flex items-center gap-2 hover:scale-[1.03] transition-transform duration-200 cursor-pointer"
                    >
                      🤖 Talk to AI
                    </button>
                  </div>
                </div>

                {/* Floating Bottom Timer Card */}
                <div className="mt-12 md:mt-16 max-w-lg bg-slate-950/80 backdrop-blur-md rounded-2xl p-5 border border-white/10 shadow-xl self-start">
                  {/* Countdown Timer Row */}
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div className="flex flex-col">
                      <span className="text-3xl md:text-4xl font-black text-white font-mono tracking-tight">
                        {String(timeLeft.days).padStart(2, '0')}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Days</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-3xl md:text-4xl font-black text-white font-mono tracking-tight">
                        {String(timeLeft.hours).padStart(2, '0')}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Hours</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-3xl md:text-4xl font-black text-white font-mono tracking-tight">
                        {String(timeLeft.minutes).padStart(2, '0')}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Minutes</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-3xl md:text-4xl font-black text-white font-mono tracking-tight">
                        {String(timeLeft.seconds).padStart(2, '0')}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Seconds</span>
                    </div>
                  </div>

                  {/* Divider line */}
                  <div className="h-[1px] bg-white/10 my-4" />

                  {/* Event Details */}
                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="text-amber-400">🏆</span>
                    <p className="text-[11px] md:text-xs font-semibold tracking-wide">
                      FIFA World Cup — Group Stage · Switzerland vs Brazil · SwissArena, Zurich
                    </p>
                  </div>
                </div>

              </div>
            </section>

            {/* TRUST SECTION */}
            <section className="text-center space-y-8">
              <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
                TRUSTED BY FANS & OPERATORS WORLDWIDE
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { value: '100K+', label: 'Fans Assisted Successfully' },
                  { value: '50+', label: 'World-Class Stadiums' },
                  { value: '95%', label: 'Booking Satisfaction Score' },
                  { value: '24/7', label: 'AI Support Desk Resolution' },
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:-translate-y-1 transition-all duration-200"
                  >
                    <p className="text-3xl md:text-4xl font-extrabold text-[#2E7D32] dark:text-[#66BB6A] tracking-tight">
                      {stat.value}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* FEATURE SHOWCASE */}
            <section className="space-y-12">
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <h2 className="text-2xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                  Everything a Football Fan Needs
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  We integrate ticketing, food pre-orders, smart local transit planning, and AI support agents into a unified workspace.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    title: '🎟 Smart Seat Booking',
                    desc: 'Interactive stadium layouts, live seat availability check, and visual perspective previews.',
                    actionLabel: 'Book Seats Now',
                    actionTab: 'Booking'
                  },
                  {
                    title: '🍔 Food Pre-Ordering',
                    desc: 'Skip concession stand waiting lines. Pre-order standard food combo packs straight to seat pickup zones.',
                    actionLabel: 'Pre-Order Concessions',
                    actionTab: 'Food'
                  },
                  {
                    title: '🤖 AI Match Assistant',
                    desc: 'Instant personalized suggestions for seating views, transport routes, and food choices.',
                    actionLabel: 'Launch AI Chat',
                    actionTab: 'AI'
                  },
                  {
                    title: '🗺 Travel Navigator',
                    desc: 'Custom metro route schedules, designated parking reservations, and live congestion updates.',
                    actionLabel: 'View Travel Routes',
                    actionTab: 'Travel'
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab(item.actionTab as any)}
                      className="text-xs font-extrabold text-[#2E7D32] dark:text-[#66BB6A] mt-5 hover:underline text-left"
                    >
                      {item.actionLabel} →
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* AI PLANNER SECTION */}
            <section id="ai-planner-widget" className="bg-slate-50 dark:bg-slate-950 rounded-[32px] p-8 md:p-12 border border-slate-200 dark:border-slate-800 shadow-xs relative">
              <div className="absolute top-4 right-4 bg-[#D4AF37]/10 text-[#D4AF37] px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest border border-[#D4AF37]/20">
                ⭐️ Key Innovation
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-5 space-y-6">
                  <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-[#2E7D32] dark:text-[#66BB6A] text-[10px] font-bold tracking-wider rounded-full uppercase border border-emerald-100 dark:border-emerald-900/30">
                    Matchday Automation
                  </span>
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-tight font-sans uppercase">
                    Your Personal Match-Day Planner
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Adjust your preferences, match-day budget, group size, and favorite snack bundle. Our AI Advisor dynamically configures the optimal ticket tier, concession package, and transit connection route.
                  </p>

                  {/* Planner Controls Form */}
                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
                        Matchday Budget Category
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {['Economy', 'Standard', 'VIP'].map((b) => (
                          <button
                            key={b}
                            onClick={() => setHomePlanner((prev) => ({ ...prev, budget: b }))}
                            className={`py-2 text-2xs font-extrabold rounded-xl border transition cursor-pointer ${
                              homePlanner.budget === b
                                ? 'bg-[#2E7D32] text-white border-[#2E7D32]'
                                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                            }`}
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
                          Total Group Size
                        </label>
                        <select
                          value={homePlanner.fans}
                          onChange={(e) => setHomePlanner((prev) => ({ ...prev, fans: e.target.value }))}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none"
                        >
                          <option>1 Fan</option>
                          <option>2 Fans</option>
                          <option>4 Fans</option>
                          <option>6 Fans</option>
                          <option>8 Fans</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
                          Seat View Preference
                        </label>
                        <select
                          value={homePlanner.preference}
                          onChange={(e) => setHomePlanner((prev) => ({ ...prev, preference: e.target.value }))}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none"
                        >
                          <option>Excellent Field View</option>
                          <option>Supporter Atmosphere</option>
                          <option>Family Friendly</option>
                          <option>Budget Centric</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
                          Food Bundle Choice
                        </label>
                        <select
                          value={homePlanner.food}
                          onChange={(e) => setHomePlanner((prev) => ({ ...prev, food: e.target.value }))}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none"
                        >
                          <option>Burger & Drinks Combo</option>
                          <option>Premium Pizza Combo</option>
                          <option>Healthy Green Salad</option>
                          <option>Hot Dogs & Soft Drink</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
                          Preferred Arrival Method
                        </label>
                        <select
                          value={homePlanner.arrival}
                          onChange={(e) => setHomePlanner((prev) => ({ ...prev, arrival: e.target.value }))}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none"
                        >
                          <option>Zurich S-Bahn Metro</option>
                          <option>Private Car Parking</option>
                          <option>Taxi Cab Dropoff</option>
                        </select>
                      </div>
                    </div>

                    <button
                      onClick={handleHomePlanMatchday}
                      className="w-full py-3 bg-[#2E7D32] hover:bg-[#2E7D32]/95 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer mt-2"
                    >
                      Calculate Dynamic Route & Pricing
                    </button>
                  </div>
                </div>

                {/* AI Planner Output */}
                <div className="lg:col-span-7 flex flex-col justify-center">
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🤖</span>
                        <div>
                          <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">AI Seat Advisor recommendation</h4>
                          <p className="text-[9px] text-slate-400 font-mono uppercase">Status: Smart Match Computed</p>
                        </div>
                      </div>
                      <span className="text-[10px] bg-amber-50 dark:bg-amber-950/50 text-[#D4AF37] border border-[#D4AF37]/20 font-mono font-black rounded-lg px-2 py-0.5 uppercase">
                        {homePlanner.budget} CHOICE
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wider">Recommended Stadium Section</span>
                        <p className="text-xs font-extrabold text-[#2E7D32] dark:text-[#66BB6A]">{homePlannerOutput.section}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wider">Assigned Seat Allocation</span>
                        <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{homePlannerOutput.seats}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wider">Angle & View Visibility Rating</span>
                        <p className="text-xs font-extrabold text-slate-850 dark:text-slate-100">{homePlannerOutput.viewQuality}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wider">Add-on Concession Packages</span>
                        <p className="text-xs font-extrabold text-slate-850 dark:text-slate-100">{homePlannerOutput.foodPackage}</p>
                      </div>
                      <div className="col-span-1 md:col-span-2 space-y-1 border-t border-slate-100 dark:border-slate-800 pt-3">
                        <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wider">Optimal Express Transit Connection</span>
                        <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{homePlannerOutput.travelRoute}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-emerald-50/50 dark:bg-slate-950/60 border border-emerald-100 dark:border-slate-850 rounded-2xl p-4 mt-2">
                      <div>
                        <span className="text-[9px] text-slate-500 uppercase font-mono block">Estimated Comprehensive Price</span>
                        <span className="text-sm font-black text-[#2E7D32] dark:text-[#66BB6A]">{homePlannerOutput.estimatedCost}</span>
                      </div>
                      <button
                        onClick={() => {
                          alert(`Configuring filters: selected ${homePlannerOutput.section}. Moving to interactive map layout.`);
                          setActiveTab('Booking');
                        }}
                        className="px-4 py-2 bg-[#2E7D32] hover:bg-[#2E7D32]/90 text-white font-extrabold text-2xs uppercase tracking-widest rounded-xl transition cursor-pointer"
                      >
                        Select Seat Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="space-y-12 text-center">
              <div className="max-w-2xl mx-auto space-y-3">
                <h2 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white uppercase">
                  Seamless Match-Day Journey
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Book your match, lock in your perfect visual seats, order food, and reach your destination with peace of mind.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                {/* Horizontal timeline connector lines for desktop */}
                <div className="hidden md:block absolute top-10 left-[12%] right-[12%] h-[1px] bg-slate-200 dark:bg-slate-800 z-0" />

                {[
                  { step: 'Step 1', title: 'Choose Match', desc: 'Browse the latest high-profile fixtures, select venue, and kickoff slot.' },
                  { step: 'Step 2', title: 'Select Seats', desc: 'Inspect live 3D visual fields of view, verify price tiers, and select seat maps.' },
                  { step: 'Step 3', title: 'Reserve Food', desc: 'Choose your desired burger or pizza combinations and checkout concession tokens.' },
                  { step: 'Step 4', title: 'Enjoy Match Day', desc: 'Use smart transit maps, bypass waiting gates, and receive food direct to stand.' },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-3 relative z-10 text-center flex flex-col items-center">
                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-950 border-2 border-[#2E7D32] dark:border-[#66BB6A] text-slate-900 dark:text-white font-black text-xs flex items-center justify-center shadow-md">
                      {idx + 1}
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase text-[#2E7D32] dark:text-[#66BB6A] block">
                        {item.step}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[200px] leading-relaxed mx-auto">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* STADIUM GALLERY PREVIEW */}
            <section className="space-y-8">
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase">
                    Stadium Atmosphere
                  </h2>
                  <p className="text-xs text-slate-500">
                    A visual sneak-peek inside our architectural marvel, Lusail Stadium.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('Gallery')}
                  className="text-xs font-bold text-[#2E7D32] hover:underline cursor-pointer"
                >
                  View Full Gallery →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { title: 'Lusail Stadium Aerial', url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=400' },
                  { title: 'Golden Hour kickoff', url: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80&w=400' },
                  { title: 'Vibrant Fan Supporter Zone', url: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&q=80&w=400' },
                  { title: 'Modern Club Suite Decks', url: 'https://images.unsplash.com/photo-1577223625856-7455800a5a41?auto=format&fit=crop&q=80&w=400' },
                ].map((img, idx) => (
                  <div key={idx} className="group bg-white dark:bg-slate-950 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xs cursor-pointer">
                    <div className="h-44 overflow-hidden relative">
                      <img
                        src={img.url}
                        alt={img.title}
                        className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-900">
                      <p className="text-xs font-extrabold text-slate-900 dark:text-white">{img.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* TESTIMONIALS */}
            <section className="space-y-10">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase">
                  What Football Fans Are Saying
                </h2>
                <p className="text-xs text-slate-500">
                  Join thousands of spectators utilizing our smart operating system to customize their tournament experience.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { text: "The AI Match Planner saved us hours. We got exactly the seats we wanted and mapped metro departures seamlessly.", author: "Amal Dev", role: "FIFA Supporter 2026" },
                  { text: "Seat booking layout is incredibly simple. Being able to choose precise views and see prices transparently is beautiful.", author: "Sofia Martinez", role: "Football Tourist" },
                  { text: "Concession pre-ordering was completely seamless. Got pickup notifications right as we stepped into the atrium zone.", author: "Marcus Vance", role: "VIP Season Holder" },
                ].map((t, idx) => (
                  <div key={idx} className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 relative">
                    <span className="text-[#D4AF37] text-lg block">★★★★★</span>
                    <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
                      "{t.text}"
                    </p>
                    <div className="border-t border-slate-100 dark:border-slate-800/60 pt-3 flex justify-between items-center">
                      <div>
                        <p className="text-xs font-black text-slate-900 dark:text-white">{t.author}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{t.role}</p>
                      </div>
                      <span className="text-xs opacity-50">⚽️</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* CALL TO ACTION */}
            <section className="relative overflow-hidden bg-gradient-to-r from-[#2E7D32] to-[#43a047] text-white rounded-[32px] p-10 md:p-14 text-center space-y-6 shadow-xl">
              <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
              <div className="relative max-w-xl mx-auto space-y-4">
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                  Ready For The Ultimate Stadium Experience?
                </h2>
                <p className="text-xs text-emerald-100 max-w-md mx-auto leading-relaxed">
                  Book secure stadium seats, pre-order foods, plan transit with AI advice, and synchronize your schedule now.
                </p>
                <div className="flex justify-center gap-4 pt-2">
                  <button
                    onClick={() => setActiveTab('Booking')}
                    className="px-6 py-3 bg-white text-[#2E7D32] font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-slate-50 transition cursor-pointer"
                  >
                    Get Started
                  </button>
                  <button
                    onClick={() => setActiveTab('Booking')}
                    className="px-6 py-3 bg-transparent border border-white/60 hover:bg-white/10 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer"
                  >
                    Book Seats
                  </button>
                </div>
              </div>
            </section>

            {/* PREMIUM FOOTER */}
            <footer className="border-t border-slate-200 dark:border-slate-800 pt-12 pb-6 text-xs text-slate-500">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                <div className="space-y-3 col-span-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">⚽</span>
                    <span className="text-sm font-black text-slate-900 dark:text-white tracking-wider uppercase">Stadium Explorer AI</span>
                  </div>
                  <p className="text-xs leading-relaxed max-w-xs text-slate-400">
                    A premium matchday assistant platform powered by smart stadium algorithms and local travel orchestration modules. Built for FIFA HackUp 2026.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-[10px]">Platform</h4>
                  <ul className="space-y-1.5 font-medium">
                    <li><button onClick={() => setActiveTab('Booking')} className="hover:text-[#2E7D32]">Seat Reservation</button></li>
                    <li><button onClick={() => setActiveTab('Food')} className="hover:text-[#2E7D32]">Concession pre-order</button></li>
                    <li><button onClick={() => setActiveTab('AI')} className="hover:text-[#2E7D32]">Match Assistant AI</button></li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-[10px]">Support & Guide</h4>
                  <ul className="space-y-1.5 font-medium">
                    <li><button onClick={() => setActiveTab('Stadium')} className="hover:text-[#2E7D32]">Stadium Architecture</button></li>
                    <li><button onClick={() => setActiveTab('Travel')} className="hover:text-[#2E7D32]">Travel Route Planner</button></li>
                    <li><button onClick={() => setActiveTab('Admin')} className="hover:text-[#2E7D32]">Operations Console</button></li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-[10px]">Join Newsletter</h4>
                  <div className="flex gap-1">
                    <input
                      type="email"
                      placeholder="Enter email"
                      className="bg-slate-100 dark:bg-slate-900 px-3 py-2 rounded-lg text-xs w-full focus:outline-none border border-slate-200 dark:border-slate-800"
                    />
                    <button
                      onClick={() => alert('Successfully subscribed to match-day updates!')}
                      className="bg-[#2E7D32] hover:bg-[#2E7D32]/90 text-white font-bold px-3 py-2 rounded-lg text-2xs cursor-pointer uppercase"
                    >
                      Join
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400">Receive fixture timetables and ticket alerts.</p>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800/60 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p>© 2026 Stadium Explorer AI. All rights reserved. FIFA HackUp Smart Stadium Systems.</p>
                <div className="flex gap-4">
                  <a href="#" className="hover:underline">Privacy Policy</a>
                  <a href="#" className="hover:underline">Terms of Service</a>
                </div>
              </div>
            </footer>
          </div>
        )}

        {/* TAB 2: STADIUM DETAILS */}
        {activeTab === 'Stadium' && (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-7 space-y-6">
                <h3 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white font-sans uppercase">
                  🏟️ SwissArena Architecture & Heritage
                </h3>
                
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Constructed in **2024** in the heart of Zurich, the SwissArena is a pinnacle of modern stadium engineering. Designed with a modular, lightweight wood-steel roof mimicking alpine ranges, it represents the finest integration of Swiss heritage and smart venue technology.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-100 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/10 dark:border-slate-800/20">
                    <span className="text-2xs text-slate-500 uppercase font-bold">Total Capacity</span>
                    <p className="text-lg font-bold text-slate-800 dark:text-white">48,000 Seats</p>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/10 dark:border-slate-800/20">
                    <span className="text-2xs text-slate-500 uppercase font-bold">Photovoltaic Skin</span>
                    <p className="text-lg font-bold text-slate-800 dark:text-white">100% Self-Powered</p>
                  </div>
                </div>

                {/* VISITOR ACCESSIBILITY DETAILS */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-sm font-extrabold uppercase text-slate-800 dark:text-white flex items-center gap-2">
                    <Accessibility className="w-5 h-5 text-indigo-500" />
                    Visitor Accessibility Guidelines
                  </h4>
                  <ul className="list-disc pl-5 text-xs text-slate-600 dark:text-slate-400 space-y-1.5">
                    <li>Designated wheelchair terraces are located in the **ADA Stand** with uncompromised panoramic coverage.</li>
                    <li>Adaptive voice induction loops for visually-impaired fans are installed in East and West premium rows.</li>
                    <li>Direct elevator transport pathways connect Gate A terminal to level-2 accessible decks.</li>
                  </ul>
                </div>
              </div>

              <div className="md:col-span-5">
                <img
                  src="https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80&w=600"
                  alt="SwissArena Arena Architecture"
                  className="rounded-3xl border border-slate-200/10 dark:border-slate-850/40 shadow-xl object-cover w-full h-80"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: GALLERY */}
        {activeTab === 'Gallery' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h3 className="text-2xl font-black text-slate-800 dark:text-white font-sans uppercase">
                📸 SwissArena Immersive Media
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Step inside our high-tech arena through our panoramic captures, match action, and drone telemetry views.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { title: 'Drone View Elevation', url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=400' },
                { title: 'Golden Hour Stadium', url: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80&w=400' },
                { title: 'Fan Supporter Stand', url: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&q=80&w=400' },
              ].map((img, idx) => (
                <div key={idx} className="glass-panel rounded-3xl overflow-hidden group border border-white/5">
                  <div className="h-56 bg-slate-900 overflow-hidden relative">
                    <img src={img.url} alt={img.title} className="w-full h-full object-cover transition duration-300 group-hover:scale-105" />
                  </div>
                  <div className="p-4 bg-slate-900/40 text-xs font-semibold text-white">
                    {img.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SEAT BOOKING MAP */}
        {activeTab === 'Booking' && (
          <div className="space-y-6 animate-fade-in">
            <SeatBookingMap
              seats={seats}
              onBookSeat={handleBookSeat}
              selectedSeatId={selectedSeatId}
              onSelectSeat={setSelectedSeatId}
            />
          </div>
        )}

        {/* TAB 5: FOOD ORDERING & DELIVERIES */}
        {activeTab === 'Food' && (
          <div className="space-y-6 animate-fade-in">
            <FoodOrdering
              onOrderSuccess={handleOrderSuccess}
              ticketId={userTicketId}
              seatInfo={userSeatInfo}
            />
          </div>
        )}

        {/* TAB 6: TRAVEL TRANSIT GUIDE */}
        {activeTab === 'Travel' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            {/* COMPOSITE TRAVEL GUIDE QUESTIONS */}
            <div className="lg:col-span-5 glass-panel rounded-3xl p-6 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white font-sans flex items-center gap-1.5">
                  <Compass className="w-5 h-5 text-indigo-500" />
                  Curation Questionnaire
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Answer 3 simple questions to construct your custom match-day itinerary instantly.</p>
              </div>

              <form onSubmit={handleTravelGenerate} className="space-y-4">
                <div>
                  <label htmlFor="travel-budget-select" className="text-3xs text-slate-400 uppercase tracking-wider block font-bold mb-1">Budget tier</label>
                  <select
                    id="travel-budget-select"
                    value={travelForm.budget}
                    onChange={(e) => setTravelForm(prev => ({ ...prev, budget: e.target.value }))}
                    className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 text-xs rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-white"
                  >
                    <option value="Economy">Economy Saver (Backpacker budget)</option>
                    <option value="Standard">Standard Leisure (Comfort family)</option>
                    <option value="VIP">Premium VIP Elite (Chauffeurs & luxury suites)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="travel-group-select" className="text-3xs text-slate-400 uppercase tracking-wider block font-bold mb-1">Spectator Party Type</label>
                  <select
                    id="travel-group-select"
                    value={travelForm.groupType}
                    onChange={(e) => setTravelForm(prev => ({ ...prev, groupType: e.target.value }))}
                    className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 text-xs rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-white"
                  >
                    <option value="Solo">Solo Traveler (Football enthusiast)</option>
                    <option value="Couple">Romantic Couple Getaway</option>
                    <option value="Family">Family Holiday (with kids)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="travel-transit-select" className="text-3xs text-slate-400 uppercase tracking-wider block font-bold mb-1">Transit Choice</label>
                  <select
                    id="travel-transit-select"
                    value={travelForm.transit}
                    onChange={(e) => setTravelForm(prev => ({ ...prev, transit: e.target.value }))}
                    className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 text-xs rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-white"
                  >
                    <option value="Metro">S-Bahn Tram & Metro (Fastest)</option>
                    <option value="Taxi">Private Electric Car Cab (Direct)</option>
                  </select>
                </div>

                <button
                  id="generate-travel-itinerary-btn"
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-indigo-950/20 cursor-pointer"
                >
                  Construct My Zurich Itinerary
                </button>
              </form>
            </div>

            {/* RESULTS SCREEN */}
            <div className="lg:col-span-7 glass-panel rounded-3xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white font-sans border-b border-slate-200/10 dark:border-slate-800/20 pb-4">
                  🗺️ Custom Smart Itinerary
                </h3>

                {generatedItinerary ? (
                  <div className="space-y-5 py-4 animate-fade-in text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                    <div className="bg-slate-100 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/10 dark:border-slate-800/20 space-y-2">
                      <p>🏨 **Recommended Stay**: {generatedItinerary.hotel}</p>
                      <p>🚇 **Access Route**: Board the **{generatedItinerary.routing}** directly to SwissArena Gate Terminus.</p>
                      <p>🎡 **Curated Landmark Activity**: {generatedItinerary.activity}</p>
                    </div>

                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span>Projected travel costs:</span>
                      <span className="text-emerald-500 font-bold font-mono">{generatedItinerary.pricing}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16 text-slate-500 text-xs">
                    No itinerary structured yet. Toggle your budget and party preferences on the left panel to trigger Swiss tourist curation routes.
                  </div>
                )}
              </div>

              <div className="text-3xs text-slate-400 border-t border-slate-200/10 dark:border-slate-800/20 pt-4">
                *Zurich airport is positioned 10km north of the venue. Standard S-Bahn train journeys clock in under 12 minutes total.
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: AI ASSISTANT STREAM */}
        {activeTab === 'AI' && (
          <div className="space-y-6 animate-fade-in">
            <AIAssistant
              onActionClick={(tab) => setActiveTab(tab as any)}
              ticketId={userTicketId}
              seatInfo={userSeatInfo}
            />
          </div>
        )}

        {/* TAB 8: ADMIN OPERATIONS CONTROL DESK */}
        {activeTab === 'Admin' && (
          <div className="space-y-6 animate-fade-in">
            <AdminConsole
              seats={seats}
              onSeatsUpdate={setSeats}
              foodOrders={foodOrders}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              emergencies={emergencies}
              onUpdateEmergencyStatus={handleUpdateEmergencyStatus}
              parkingAreas={[]}
              feedbackList={feedbackList}
            />
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="w-full text-center py-6 text-[10px] text-slate-500 font-mono uppercase tracking-widest border-t border-slate-200/10 dark:border-slate-800/20 mt-12 pb-24 md:pb-6">
        <div>FIFA HACKUP SMART OPERATING SYSTEM © 2026 Zurich, Switzerland.</div>
        <div className="text-3xs text-slate-600 mt-1">Frosted Glass UI Architecture - Crafted for Smart Stadium Stadiums.</div>
      </footer>
    </div>
  );
}
