import React, { useState, useEffect, useRef } from 'react';
import { Seat, FoodOrder, EmergencyTicket, ParkingArea, FeedbackItem } from '../types';
import {
  ShieldAlert,
  BarChart3,
  Key,
  Terminal,
  Wifi,
  Users,
  DollarSign,
  Layers,
  Plus,
  Check,
  Play,
  RefreshCw,
  Send,
  AlertTriangle,
  Search,
  Bell,
  Menu,
  X,
  CheckCircle,
  Clock,
  Thermometer,
  MapPin,
  Coffee,
  Pizza,
  ClipboardList,
  TrendingUp,
  HelpCircle,
  Eye,
  Settings as SettingsIcon,
  AlertCircle,
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight,
  Wind,
  ShieldCheck,
  Sparkles,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface AdminConsoleProps {
  seats: Seat[];
  onSeatsUpdate: (updatedSeats: Seat[]) => void;
  foodOrders: FoodOrder[];
  onUpdateOrderStatus: (orderId: string, status: FoodOrder['status']) => void;
  emergencies: EmergencyTicket[];
  onUpdateEmergencyStatus: (ticketId: string, status: EmergencyTicket['status'], staff: string) => void;
  parkingAreas: ParkingArea[];
  feedbackList: FeedbackItem[];
}

export default function AdminConsole({
  seats,
  onSeatsUpdate,
  foodOrders,
  onUpdateOrderStatus,
  emergencies,
  onUpdateEmergencyStatus,
  parkingAreas,
  feedbackList,
}: AdminConsoleProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Tab controls - redone to include all premium pages
  const [activeTab, setActiveTab] = useState<'Home' | 'MatchControl' | 'Seats' | 'Food' | 'Deliveries' | 'Crowd' | 'DigitalTwin' | 'Emergency' | 'Settings'>('Home');

  // Search & Global Command State
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  
  // Notification center
  const [showNotifications, setShowNotifications] = useState(false);

  // Match Control state
  const [matchState, setMatchState] = useState({
    kickoffTimer: '45:00',
    attendance: 42000,
    gatesOpen: true,
    bookingsPaused: false,
    emergencyMode: false,
    announcementText: '',
    announcementsList: [
      { id: '1', text: 'All visitors please check in tickets at S-Bahn Turnstiles', time: '08:15 AM' },
      { id: '2', text: 'F&B stalls in East Wing are now fully stocked', time: '08:22 AM' }
    ] as { id: string; text: string; time: string }[]
  });

  // Seat management state
  const [selectedSection, setSelectedSection] = useState<'All' | 'North' | 'South' | 'East' | 'West' | 'VIP'>('All');
  const [priceModifier, setPriceModifier] = useState<number>(0);
  const [heatmapSelection, setHeatmapSelection] = useState<'VIP' | 'North' | 'South' | 'East' | 'West'>('VIP');

  // Digital Twin simulated state
  const [weatherPreset, setWeatherPreset] = useState<'Sunny' | 'Heavy Rain' | 'Storm'>('Sunny');
  const [metroFrequency, setMetroFrequency] = useState<'Standard' | 'Doubled'>('Standard');

  // Food Inventory State
  const [foodInventory, setFoodInventory] = useState([
    { id: 'burger', name: 'Gladiator Burger', category: 'Burgers', quantity: 180, sales: 340, prediction: 'High (420 needed)' },
    { id: 'pizza', name: 'Margherita Pizza Slice', category: 'Pizza', quantity: 95, sales: 480, prediction: 'Extreme (600 needed)' },
    { id: 'coffee', name: 'Express Alpine Coffee', category: 'Drinks', quantity: 210, sales: 190, prediction: 'Moderate (250 needed)' },
    { id: 'drinks', name: 'Swiss Glacial Soda', category: 'Drinks', quantity: 450, sales: 620, prediction: 'Extreme (700 needed)' }
  ]);

  // AI Command Center
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswers, setAiAnswers] = useState<Array<{ q: string; a: string; time: string }>>([
    {
      q: 'How many burgers should we prepare?',
      a: 'Based on dynamic crowd density metrics at SwissArena East Stand, F&B operations should prepare 85 additional Gladiator Burgers. Current prep-rates are falling 12% behind demand expectations.',
      time: '08:05 AM'
    }
  ]);
  const [isAiTyping, setIsAiTyping] = useState(false);

  // Live Food Delivery Map Simulator - active delivery runners moving around
  const [runners, setRunners] = useState([
    { id: 'Runner #1', name: 'Marc G.', task: 'Gladiator Burger to Seat B-4', progress: 12, direction: 1, route: 'Kitchen -> Sec East -> B-4' },
    { id: 'Runner #2', name: 'Elena K.', task: 'Alpine Coffee to VIP-12', progress: 48, direction: 1, route: 'Kitchen -> VIP Lounge -> VIP-12' },
    { id: 'Runner #3', name: 'Sven O.', task: 'Margherita Slice to Sec South', progress: 85, direction: 1, route: 'Kitchen -> Sec South -> S-9' }
  ]);

  // Handle Runner Movement Animation
  useEffect(() => {
    const timer = setInterval(() => {
      setRunners(prev =>
        prev.map(r => {
          let nextProgress = r.progress + (Math.random() * 8 + 3) * r.direction;
          let nextDirection = r.direction;
          if (nextProgress >= 100) {
            nextProgress = 100;
            nextDirection = -1; // turnaround
          } else if (nextProgress <= 0) {
            nextProgress = 0;
            nextDirection = 1; // head out again
          }
          return { ...r, progress: Math.round(nextProgress), direction: nextDirection };
        })
      );
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  // Check login on load
  useEffect(() => {
    const saved = localStorage.getItem('adminSession');
    if (saved) {
      const session = JSON.parse(saved);
      if (session.loggedIn && session.username === 'adhil@123') {
        setIsLoggedIn(true);
      }
    }
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'adhil@123' && password === 'hassanadil@1234') {
      const session = { username, role: 'super_admin', loggedIn: true };
      localStorage.setItem('adminSession', JSON.stringify(session));
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Invalid Administrator credentials. Please verify and retry.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    setIsLoggedIn(false);
  };

  // Bulk Seat Updates
  const handleBulkUpdatePrice = () => {
    const updated = seats.map(s => {
      if (selectedSection === 'All' || s.section === selectedSection) {
        return { ...s, price: Math.max(10, s.price + Number(priceModifier)) };
      }
      return s;
    });
    onSeatsUpdate(updated);
    setPriceModifier(0);
    alert(`Successfully applied CHF ${priceModifier} bulk pricing adjustment to ${selectedSection} stand seats!`);
  };

  const handleBulkBlockSection = (block: boolean) => {
    const updated = seats.map(s => {
      if (selectedSection === 'All' || s.section === selectedSection) {
        return { ...s, status: block ? ('Blocked' as const) : ('Available' as const) };
      }
      return s;
    });
    onSeatsUpdate(updated);
    alert(`Successfully ${block ? 'Blocked' : 'Opened/Unblocked'} all seats in ${selectedSection} Stand!`);
  };

  // Total stadium statistics calculations
  const totalRevenue = foodOrders.reduce((acc, ord) => acc + ord.totalPrice, 0) +
    seats.filter(s => s.status === 'Booked').reduce((acc, s) => acc + s.price, 0);

  const occupiedSeatsCount = seats.filter(s => s.status === 'Booked').length;

  // Ask AI command handler
  const handleAiAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;

    const currentQ = aiQuestion;
    setAiQuestion('');
    setIsAiTyping(true);

    setTimeout(() => {
      let answer = '';
      const qLower = currentQ.toLowerCase();

      if (qLower.includes('burger') || qLower.includes('food') || qLower.includes('inventory')) {
        answer = 'Our predictive model forecasts a 34% surge in beverage & snacks demand during half-time. Strongly suggest queuing 120 Gladiator Burgers in pre-assembly at East Stand and boosting Glacial Soda stocks.';
      } else if (qLower.includes('attendance') || qLower.includes('visitor') || qLower.includes('crowd')) {
        answer = `Current dynamic sensor gates confirm ${matchState.attendance} active fans seated. Model predicts an ultimate egress of 95% capacity. Metro Line S-2 transit intervals should remain doubled to prevent exit lobby clustering.`;
      } else if (qLower.includes('emergency') || qLower.includes('alert') || qLower.includes('threat')) {
        const activeAlertsCount = emergencies.filter(e => e.status !== 'Resolved').length;
        answer = activeAlertsCount > 0 
          ? `There are currently ${activeAlertsCount} unresolved dispatch alerts. Priority is high for Section West medical alert. All security dispatch teams are equipped and in direct position.` 
          : 'All systems green. Sensors indicate steady crowd sentiment (88% positive indices), normal atmospheric temperature (18°C), and no structural anomalies logged.';
      } else {
        answer = `SwissArena operations metrics indicate excellent telemetry. Match-day parameters for Switzerland vs Germany are functioning within normal bounds. Is there a specific gate, concession inventory, or parking coordinate you would like to audit?`;
      }

      setAiAnswers(prev => [{ q: currentQ, a: answer, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }, ...prev]);
      setIsAiTyping(false);
    }, 1000);
  };

  // Search filter options
  const searchSuggestions = [
    { text: 'Concessions Inventory status', category: 'Inventory' },
    { text: 'VIP Stand seats lookup', category: 'Seating' },
    { text: 'Open S-Bahn Gate 3 transit status', category: 'Operations' },
    { text: 'Medical dispatch in South stand', category: 'Emergency' },
    { text: 'Adhil Hassan profile', category: 'Admin' }
  ];

  // Filtered lists for simple demo table searches
  const filteredOrders = foodOrders.filter(o => 
    o.customerName.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
    o.section.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
    o.id.toLowerCase().includes(globalSearchQuery.toLowerCase())
  );

  const notificationsList = [
    { id: '1', title: 'New Seat Booking', text: 'Section VIP Row A Seat 3 purchased by amaldev@gmail.com', type: 'success', time: '1m ago' },
    { id: '2', title: 'Concession Alert', text: 'Margherita Pizza stock has reached warning levels (95 left)', type: 'warning', time: '5m ago' },
    { id: '3', title: 'Medical Ticket Dispatched', text: 'Operations Officer Alpha arrived at Row C, Seat 8', type: 'info', time: '12m ago' },
    { id: '4', title: 'Transit Frequency Boosted', text: 'AI automated order: S-Bahn S12 route frequency doubled', type: 'success', time: '18m ago' }
  ];

  // Interactive Heatmap details
  const heatmapData = {
    VIP: { occupancy: 100, price: 480, status: 'Full', count: 180, color: 'bg-red-500 text-red-700 border-red-200' },
    North: { occupancy: 95, price: 55, status: 'Peak Crowd', count: 12000, color: 'bg-amber-500 text-amber-700 border-amber-200' },
    South: { occupancy: 78, price: 75, status: 'Normal Flow', count: 9800, color: 'bg-emerald-500 text-emerald-700 border-emerald-200' },
    East: { occupancy: 94, price: 220, status: 'High Density', count: 10500, color: 'bg-amber-500 text-amber-700 border-amber-200' },
    West: { occupancy: 88, price: 220, status: 'Steady Flow', count: 9500, color: 'bg-emerald-500 text-emerald-700 border-emerald-200' }
  };

  // Standard Mock Sparkline Data
  const sparklineData = [20, 28, 25, 45, 38, 55, 62];

  // Pre-configured Recharts analytical datasets
  const crowdTimelineData = [
    { time: '18:00', ingress: 2500, concourse: 1200 },
    { time: '18:30', ingress: 8500, concourse: 3200 },
    { time: '19:00', ingress: 18400, concourse: 7400 },
    { time: '19:30', ingress: 34000, concourse: 12100 },
    { time: '20:00', ingress: 41200, concourse: 8400 },
    { time: '20:30', ingress: 42000, concourse: 1500 }
  ];

  const salesTrendData = [
    { item: 'Burgers', sales: 340, stock: 180 },
    { item: 'Pizza Slices', sales: 480, stock: 95 },
    { item: 'Coffee', sales: 190, stock: 210 },
    { item: 'Swiss Soda', sales: 620, stock: 450 }
  ];

  const demographicsData = [
    { name: 'Local Fans', value: 24500, color: '#16A34A' },
    { name: 'Foreign Spectators', value: 14000, color: '#3B82F6' },
    { name: 'VIP/Corporate', value: 3500, color: '#FBBF24' }
  ];

  // Restock handler
  const handleRestock = (id: string) => {
    setFoodInventory(prev => 
      prev.map(item => item.id === id ? { ...item, quantity: item.quantity + 100 } : item)
    );
    alert(`Ordered emergency F&B replenishment (+100 items) for ${id.toUpperCase()}`);
  };

  // Public Announcement Dispatcher
  const handleDispatchAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchState.announcementText.trim()) return;
    setMatchState(prev => ({
      ...prev,
      announcementText: '',
      announcementsList: [
        { id: String(Date.now()), text: prev.announcementText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
        ...prev.announcementsList
      ]
    }));
    alert('Broadcast Announcement successfully queued and beamed to SwissArena Stadium screens!');
  };

  // Login screen renders if not authorized
  if (!isLoggedIn) {
    return (
      <div id="admin-login-screen" className="flex items-center justify-center min-h-[calc(100vh-220px)] p-6 bg-[#F8FAFC]">
        <div className="bg-white rounded-[32px] p-8 md:p-10 max-w-lg w-full space-y-8 shadow-[0_12px_40px_rgba(0,0,0,0.06)] border border-[#E5E7EB] animate-fade-in">
          
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#DCFCE7] text-[#16A34A] text-2xs font-extrabold uppercase tracking-wider rounded-full">
              🇨🇭 Official FIFA Smart Arena OS
            </div>
            <h3 className="text-3xl font-black text-[#111827] tracking-tight">STADIUM OPERATIONS</h3>
            <p className="text-sm text-[#6B7280]">Sign in using dynamic operational key credentials to configure SwissArena Zurich.</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="admin-username-input" className="text-2xs font-bold text-[#111827] uppercase tracking-wider block">Security ID (Username)</label>
              <input
                id="admin-username-input"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. adhil@123"
                className="w-full bg-[#F8FAFC] border border-[#E5E7EB] px-4 py-3.5 text-xs rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#16A34A] text-[#111827] font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="admin-password-input" className="text-2xs font-bold text-[#111827] uppercase tracking-wider block">Admin Token Key (Password)</label>
              <input
                id="admin-password-input"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#F8FAFC] border border-[#E5E7EB] px-4 py-3.5 text-xs rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#16A34A] text-[#111827] font-medium"
              />
            </div>

            {loginError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              id="admin-login-submit-btn"
              type="submit"
              className="w-full py-4 bg-[#16A34A] hover:bg-[#22C55E] text-white font-bold text-xs uppercase tracking-widest rounded-2xl transition-all duration-300 shadow-[0_8px_20px_rgba(22,163,74,0.25)] hover:shadow-[0_12px_24px_rgba(34,197,94,0.35)] cursor-pointer"
            >
              Authorize Secure Terminal
            </button>
          </form>

          {/* CREDENTIALS WATERMARK */}
          <div className="bg-[#F8FAFC] border border-[#E5E7EB] p-4 rounded-2xl space-y-1">
            <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-wider block">📋 Operational Credentials</span>
            <div className="text-xs font-mono text-[#6B7280] space-y-0.5">
              <div className="flex justify-between"><span>Username:</span> <strong className="text-[#111827] font-extrabold select-all">adhil@123</strong></div>
              <div className="flex justify-between"><span>Password:</span> <strong className="text-[#111827] font-extrabold select-all">hassanadil@1234</strong></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // CORE REDESIGNED LAYOUT
  return (
    <div id="admin-dashboard-layout" className="flex flex-col gap-6 text-[#111827] bg-[#F8FAFC] min-h-[calc(100vh-160px)] p-1 rounded-[40px] animate-fade-in font-sans">
      
      {/* 1. TOP PREMIUM NAVBAR - Apple Glass-like feel */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-8 py-4 bg-white/95 backdrop-blur-md border border-[#E5E7EB] rounded-[30px] shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        
        {/* Brand logo & Swiss Flag icon */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#16A34A] flex items-center justify-center text-white font-extrabold text-2xl shadow-md shadow-[#16A34A]/25 select-none animate-pulse">
            +
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black tracking-tight text-[#111827]">SWISSARENA AI</span>
              <span className="px-2 py-0.5 bg-[#DCFCE7] text-[#16A34A] font-extrabold text-[8px] uppercase tracking-widest rounded-md">
                LIVE OPS
              </span>
            </div>
            <p className="text-[9px] text-[#6B7280] font-bold uppercase tracking-widest">Zurich Operations Command</p>
          </div>
        </div>

        {/* Global search with dropdown suggestions */}
        <div className="relative hidden md:flex items-center w-full max-w-md mx-6">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#6B7280]" />
          <input
            type="text"
            placeholder="Search bookings, concessions inventory, spectator seats..."
            value={globalSearchQuery}
            onFocus={() => setShowSearchSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
            onChange={(e) => setGlobalSearchQuery(e.target.value)}
            className="w-full bg-[#F8FAFC] border border-[#E5E7EB] py-2.5 pl-11 pr-4 text-xs rounded-2xl focus:outline-none focus:border-[#16A34A] focus:bg-white text-[#111827] transition-all font-medium"
          />
          
          {/* Global search dropdown */}
          {showSearchSuggestions && (
            <div className="absolute top-12 left-0 right-0 bg-white border border-[#E5E7EB] rounded-2xl shadow-xl overflow-hidden z-40 p-2 animate-fade-in">
              <div className="p-2 text-3xs font-extrabold text-[#6B7280] uppercase tracking-wider">AI Operations Shortcuts</div>
              {searchSuggestions.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setGlobalSearchQuery(item.text);
                    if (item.category === 'Emergency') setActiveTab('Emergency');
                    if (item.category === 'Seating') setActiveTab('Seats');
                    if (item.category === 'Inventory') setActiveTab('Food');
                  }}
                  className="w-full flex items-center justify-between p-2 hover:bg-[#DCFCE7] rounded-xl text-left text-xs transition duration-150 cursor-pointer text-[#111827]"
                >
                  <span className="font-semibold">{item.text}</span>
                  <span className="text-3xs bg-[#F8FAFC] text-[#6B7280] px-2 py-0.5 rounded-lg border border-[#E5E7EB] font-bold uppercase">
                    {item.category}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right side utilities: notifications, theme display, profile */}
        <div className="flex items-center gap-4">
          
          {/* Simulated API connection health */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#DCFCE7] border border-[#DCFCE7] rounded-full">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-ping" />
            <span className="text-[10px] font-extrabold text-[#16A34A] tracking-wider uppercase font-mono">LIVE CONNECTED</span>
          </div>

          {/* Notification center */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2.5 bg-[#F8FAFC] hover:bg-[#DCFCE7] border border-[#E5E7EB] rounded-full text-[#111827] transition relative cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#16A34A] rounded-full border-2 border-white animate-bounce" />
            </button>

            {/* Notification Dropdown list */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 bg-white border border-[#E5E7EB] rounded-3xl shadow-xl w-80 overflow-hidden z-50 p-4 animate-fade-in">
                <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3 mb-3">
                  <span className="text-xs font-black text-[#111827] uppercase">Notification Logs</span>
                  <span className="text-3xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">4 NEW</span>
                </div>
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {notificationsList.map((notif) => (
                    <div key={notif.id} className="p-2.5 bg-[#F8FAFC] hover:bg-[#DCFCE7]/40 rounded-xl border border-[#E5E7EB]/50 space-y-1 transition text-xs">
                      <div className="flex justify-between font-bold text-[#111827]">
                        <span>{notif.title}</span>
                        <span className="text-3xs text-[#6B7280] font-normal">{notif.time}</span>
                      </div>
                      <p className="text-[#6B7280] text-3xs">{notif.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Admin Profile */}
          <div className="flex items-center gap-3 pl-3 border-l border-[#E5E7EB]">
            <div className="w-9 h-9 rounded-full bg-[#16A34A]/10 border border-[#16A34A] flex items-center justify-center font-black text-xs text-[#16A34A]">
              AH
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-bold text-[#111827] leading-none">Adhil Hassan</span>
              <span className="text-[9px] text-[#6B7280] font-bold uppercase mt-0.5">Super Administrator</span>
            </div>
          </div>

          {/* Disconnect button */}
          <button
            onClick={handleLogout}
            className="p-2.5 bg-red-50 hover:bg-red-100 border border-red-100 hover:border-red-200 text-red-600 rounded-full transition cursor-pointer"
            title="Securely Sign Out"
          >
            <X className="w-4 h-4" />
          </button>

        </div>
      </header>

      {/* 2. BODY CONTENT - Sidebar + Main Viewport */}
      <div className="flex flex-col lg:flex-row gap-8 flex-1 h-full">
        
        {/* LEFT SIDEBAR - Rounded 30px, Shadow, Width 300px */}
        <aside className="w-full lg:w-[300px] bg-white rounded-[30px] border border-[#E5E7EB] shadow-[0_10px_30px_rgba(0,0,0,0.04)] p-6 shrink-0 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="p-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl text-center space-y-1 select-none">
              <span className="text-[9px] text-[#6B7280] font-bold uppercase tracking-widest block">Active Session Status</span>
              <div className="flex items-center justify-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-pulse" />
                <span className="text-xs font-bold text-[#111827]">Secure Admin Console</span>
              </div>
            </div>

            {/* Sidebar items */}
            <nav className="flex flex-col gap-1.5">
              {[
                { id: 'Home', label: 'Dashboard Control', icon: BarChart3, desc: 'Overview, counts & charts' },
                { id: 'MatchControl', label: 'Match Operations', icon: Terminal, desc: 'Gates, alerts & announcements' },
                { id: 'Seats', label: 'Seating Dynamic Pricing', icon: Layers, desc: 'Stands pricing & heatmap' },
                { id: 'Food', label: 'Concessions & Food', icon: Pizza, desc: 'Concession queue & stock' },
                { id: 'Deliveries', label: 'Live Delivery Map', icon: MapPin, desc: 'Realtime runner paths' },
                { id: 'Crowd', label: 'Crowd Analytics', icon: Users, desc: 'Ingress & demographics' },
                { id: 'DigitalTwin', label: 'Digital Twin Twin', icon: RefreshCw, desc: '3D blueprint stress test' },
                { id: 'Emergency', label: 'Emergency Center', icon: ShieldAlert, desc: 'First aid dispatch & evac' },
                { id: 'Settings', label: 'Control Settings', icon: SettingsIcon, desc: 'Accents, language & API keys' },
              ].map((tab) => {
                const IconComp = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    id={`admin-tab-btn-${tab.id}`}
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-4 w-full p-[14px] rounded-[18px] transition-all duration-300 text-left select-none group cursor-pointer ${
                      isActive
                        ? 'bg-[#16A34A] text-white shadow-md shadow-[#16A34A]/25 scale-[1.02]'
                        : 'bg-transparent text-[#111827] hover:bg-[#DCFCE7] hover:text-[#111827] hover:translate-x-[5px]'
                    }`}
                  >
                    <IconComp className={`w-5 h-5 shrink-0 transition-transform duration-300 group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-[#6B7280] group-hover:text-[#16A34A]'
                    }`} />
                    <div className="flex flex-col leading-none">
                      <span className="text-xs font-bold font-sans">{tab.label}</span>
                      <span className={`text-[9px] mt-0.5 font-medium ${isActive ? 'text-green-100' : 'text-[#6B7280]'}`}>
                        {tab.desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="pt-6 border-t border-[#E5E7EB] mt-6 text-center select-none">
            <span className="text-[10px] text-[#6B7280] font-bold font-mono uppercase tracking-widest block">SwissArena OS v2.4</span>
            <p className="text-[9px] text-[#6B7280]/60 font-semibold mt-0.5">FIFA Premium Partner System</p>
          </div>
        </aside>

        {/* MAIN VIEW AREA - Bright white, airy, clean cards */}
        <main className="flex-1 space-y-6">
          
          {/* TAB 1: DASHBOARD HOME OVERVIEW */}
          {activeTab === 'Home' && (
            <div className="space-y-8 animate-fade-in">
              
              {/* HEADING TITLE */}
              <div>
                <h2 className="text-2xl font-black text-[#111827] tracking-tight">STADIUM COMMAND CENTER</h2>
                <p className="text-sm text-[#6B7280]">Live match-day metrics and active concession transactions for Zurich SwissArena.</p>
              </div>

              {/* STAT CARDS - Height 150px, rounded 28px, custom shadow, hover translate-y-2 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[
                  {
                    title: 'Gross Stadium Revenue',
                    value: `CHF ${(totalRevenue + 12500).toLocaleString()}`,
                    change: '+14.2% from forecast',
                    isPositive: true,
                    icon: DollarSign,
                    color: 'text-emerald-600 bg-emerald-50 border-emerald-100'
                  },
                  {
                    title: 'Live Attendance Ingress',
                    value: `${matchState.attendance.toLocaleString()} fans`,
                    change: '95% capacity occupancy',
                    isPositive: true,
                    icon: Users,
                    color: 'text-blue-600 bg-blue-50 border-blue-100'
                  },
                  {
                    title: 'Concessions Orders Queue',
                    value: `${foodOrders.length} dispatches`,
                    change: 'Average ETA: 7.2 minutes',
                    isPositive: true,
                    icon: ShoppingBag,
                    color: 'text-amber-600 bg-amber-50 border-amber-100'
                  },
                  {
                    title: 'S-Bahn Parking Capacity',
                    value: '148 spots open',
                    change: '92% lots filled total',
                    isPositive: false,
                    icon: Wifi,
                    color: 'text-orange-600 bg-orange-50 border-orange-100'
                  },
                  {
                    title: 'Safety Emergency Dispatches',
                    value: `${emergencies.filter(e => e.status !== 'Resolved').length} active tickets`,
                    change: 'Average dispatch rate: 2.4m',
                    isPositive: true,
                    icon: ShieldAlert,
                    color: 'text-red-600 bg-red-50 border-red-100'
                  },
                  {
                    title: 'Real-Time Fan Occupancy',
                    value: '95.2% Capacity',
                    change: '+2% higher than Group stage',
                    isPositive: true,
                    icon: TrendingUp,
                    color: 'text-indigo-600 bg-indigo-50 border-indigo-100'
                  }
                ].map((c, idx) => {
                  const IconComponent = c.icon;
                  return (
                    <div
                      key={idx}
                      className="h-[150px] bg-white border border-[#E5E7EB] rounded-[28px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:-translate-y-2 hover:shadow-[0_15px_35px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col justify-between"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-3xs font-extrabold text-[#6B7280] uppercase tracking-wider block">
                            {c.title}
                          </span>
                          <span className="text-2xl font-black text-[#111827] block mt-1 tracking-tight">
                            {c.value}
                          </span>
                        </div>
                        <div className={`p-3 rounded-2xl border ${c.color}`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                      </div>

                      {/* Sparkline mini-visual & percentage text */}
                      <div className="flex items-center justify-between text-2xs pt-1">
                        <span className={`font-bold flex items-center gap-1 ${c.isPositive ? 'text-[#16A34A]' : 'text-red-600'}`}>
                          {c.isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                          {c.change}
                        </span>
                        
                        {/* Custom SVG inline sparkline graph */}
                        <svg className="w-16 h-6 shrink-0" viewBox="0 0 100 30">
                          <path
                            d={`M 0 ${sparklineData[0]} Q 20 ${sparklineData[1]}, 40 ${sparklineData[2]} T 80 ${sparklineData[5]} L 100 ${sparklineData[6]}`}
                            fill="none"
                            stroke="#16A34A"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* LIVE STADIUM STATE COMPACT GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Stadium Card & Circular Occupancy Indicators */}
                <div className="lg:col-span-8 bg-white border border-[#E5E7EB] rounded-[28px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] space-y-6">
                  <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                      <h4 className="text-sm font-black text-[#111827] uppercase tracking-wider">LIVE STADIUM STATUS</h4>
                    </div>
                    
                    <span className="px-3 py-1 bg-red-50 text-red-600 text-3xs font-extrabold uppercase tracking-widest rounded-full border border-red-100 select-none animate-pulse">
                      🔴 KICKOFF LIVE
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    <div className="p-3 bg-[#F8FAFC] rounded-2xl border border-[#E5E7EB]">
                      <span className="text-3xs font-bold text-[#6B7280] uppercase block">Stadium Capacity</span>
                      <span className="text-base font-black text-[#111827] block mt-1">48,000 Seats</span>
                    </div>
                    <div className="p-3 bg-[#F8FAFC] rounded-2xl border border-[#E5E7EB]">
                      <span className="text-3xs font-bold text-[#6B7280] uppercase block">Current Attendance</span>
                      <span className="text-base font-black text-[#16A34A] block mt-1">42,000 / 95%</span>
                    </div>
                    <div className="p-3 bg-[#F8FAFC] rounded-2xl border border-[#E5E7EB]">
                      <span className="text-3xs font-bold text-[#6B7280] uppercase block">Outdoor Weather</span>
                      <span className="text-base font-black text-[#111827] block mt-1">18°C Sunny</span>
                    </div>
                    <div className="p-3 bg-[#F8FAFC] rounded-2xl border border-[#E5E7EB]">
                      <span className="text-3xs font-bold text-[#6B7280] uppercase block">Concourse Traffic</span>
                      <span className="text-base font-black text-amber-600 block mt-1">Moderate</span>
                    </div>
                  </div>

                  {/* CIRCULAR CHARTS WITH GRADIENT RINGS */}
                  <div className="space-y-4 pt-2">
                    <span className="text-3xs font-extrabold text-[#6B7280] uppercase tracking-wider block">Stand Capacity Occupancy Rings</span>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      {[
                        { name: 'North Fan Curve', percent: 95, color: '#16A34A' },
                        { name: 'East & West Stands', percent: 94, color: '#3B82F6' },
                        { name: 'VIP Deck Box', percent: 100, color: '#FBBF24' }
                      ].map((ring, index) => {
                        const radius = 35;
                        const stroke = 6;
                        const normalizedRadius = radius - stroke * 2;
                        const circumference = normalizedRadius * 2 * Math.PI;
                        const strokeDashoffset = circumference - (ring.percent / 100) * circumference;

                        return (
                          <div key={index} className="flex flex-col items-center p-4 bg-[#F8FAFC] rounded-2xl border border-[#E5E7EB]">
                            <svg className="w-20 h-20" viewBox="0 0 70 70">
                              <circle
                                stroke="#E5E7EB"
                                fill="transparent"
                                strokeWidth={stroke}
                                r={normalizedRadius}
                                cx={radius}
                                cy={radius}
                              />
                              <circle
                                stroke={ring.color}
                                fill="transparent"
                                strokeWidth={stroke}
                                strokeDasharray={circumference + ' ' + circumference}
                                style={{ strokeDashoffset }}
                                strokeLinecap="round"
                                r={normalizedRadius}
                                cx={radius}
                                cy={radius}
                                transform="rotate(-90 35 35)"
                              />
                              <text
                                x="50%"
                                y="50%"
                                dy=".3em"
                                textAnchor="middle"
                                className="text-xs font-extrabold text-[#111827] font-mono"
                              >
                                {ring.percent}%
                              </text>
                            </svg>
                            <span className="text-2xs font-extrabold text-[#111827] uppercase tracking-wide mt-2">{ring.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* AI Recommendation insights panel & Floating command widget */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* AI Recommendations Panel */}
                  <div className="bg-white border border-[#E5E7EB] rounded-[28px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] space-y-4">
                    <div className="flex items-center gap-1.5 border-b border-[#E5E7EB] pb-3 text-[#16A34A]">
                      <Sparkles className="w-5 h-5 shrink-0 animate-bounce" />
                      <span className="text-xs font-black uppercase tracking-wider">AI Operations Suggestor</span>
                    </div>

                    <div className="space-y-3.5 text-2xs leading-relaxed text-[#6B7280]">
                      <div className="flex items-start gap-2 bg-[#DCFCE7]/50 p-2.5 rounded-xl border border-[#16A34A]/10 text-[#111827]">
                        <span className="text-base">🚀</span>
                        <p className="font-medium"><strong className="text-[#16A34A]">Dynamic Gate Open Advice</strong>: Open North Gate 2 & 3 immediately to accommodate 1,200 sudden arrivals arriving via Tram 11.</p>
                      </div>
                      <div className="flex items-start gap-2 bg-amber-50/50 p-2.5 rounded-xl border border-amber-200/20 text-[#111827]">
                        <span className="text-base">🍕</span>
                        <p className="font-medium"><strong className="text-amber-600">Stock Reallocation</strong>: Margherita slices are depleting 18% quicker than projected. Shift 40 slices from west to east wing.</p>
                      </div>
                      <div className="flex items-start gap-2 bg-red-50/50 p-2.5 rounded-xl border border-red-200/20 text-[#111827]">
                        <span className="text-base">🚗</span>
                        <p className="font-medium"><strong className="text-red-600">Parking Saturation</strong>: Parking Sector A is at 98% capacity. AI auto-rerouting traffic to Sector B lot now.</p>
                      </div>
                    </div>
                  </div>

                  {/* AI Floating Command Center Interactive */}
                  <div className="bg-[#111827] text-white rounded-[28px] p-6 shadow-xl space-y-4 relative overflow-hidden">
                    <div className="absolute top-[-50px] right-[-50px] w-32 h-32 rounded-full bg-[#16A34A]/15 filter blur-3xl pointer-events-none" />
                    
                    <div className="flex items-center gap-1.5 border-b border-white/10 pb-3 text-[#16A34A]">
                      <Terminal className="w-4 h-4 shrink-0" />
                      <span className="text-xs font-black uppercase tracking-widest text-white">AI OPERATING COPILOT</span>
                    </div>

                    {/* Pre-defined shortcuts */}
                    <div className="space-y-1">
                      <span className="text-4xs text-white/40 uppercase tracking-widest font-extrabold block mb-1">Quick Ask Queries</span>
                      <div className="flex flex-wrap gap-1.5">
                        {['How many burgers should we prepare?', 'Predict second-half attendance', 'Any emergency alerts?'].map((q, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setAiQuestion(q);
                            }}
                            className="text-[9px] bg-white/5 hover:bg-white/10 border border-white/10 px-2 py-1.5 rounded-lg text-slate-300 transition text-left leading-none"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>

                    <form onSubmit={handleAiAsk} className="flex gap-2">
                      <input
                        type="text"
                        value={aiQuestion}
                        onChange={(e) => setAiQuestion(e.target.value)}
                        placeholder="Ask AI operator anything..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-2xs text-white focus:outline-none focus:border-[#16A34A]"
                      />
                      <button
                        type="submit"
                        className="p-2 bg-[#16A34A] hover:bg-[#22C55E] text-white rounded-xl transition cursor-pointer shrink-0"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>

                    {/* AI responses list */}
                    <div className="space-y-2.5 max-h-40 overflow-y-auto pt-2 no-scrollbar">
                      {isAiTyping && (
                        <div className="flex items-center gap-2 text-2xs text-white/50 animate-pulse">
                          <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
                          <span>AI is calculating live stadium flow...</span>
                        </div>
                      )}
                      
                      {aiAnswers.map((ans, idx) => (
                        <div key={idx} className="bg-white/5 border border-white/10 p-3 rounded-xl space-y-1 text-2xs">
                          <div className="flex justify-between font-extrabold text-slate-400">
                            <span>Q: {ans.q}</span>
                            <span>{ans.time}</span>
                          </div>
                          <p className="text-white font-medium">{ans.a}</p>
                        </div>
                      ))}
                    </div>

                  </div>

                </div>

              </div>

            </div>
          )}

          {/* TAB 2: MATCH OPERATIONS CONTROL */}
          {activeTab === 'MatchControl' && (
            <div className="space-y-8 animate-fade-in text-left">
              <div>
                <h2 className="text-2xl font-black text-[#111827] tracking-tight">MATCH OPERATIONS CENTER</h2>
                <p className="text-sm text-[#6B7280]">Dispatch live emergency broadcasts, open gate sensors, and pause bookings.</p>
              </div>

              {/* Status Row indicators */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-[0_4px_15px_rgba(0,0,0,0.02)]">
                  <span className="text-3xs text-[#6B7280] font-extrabold uppercase tracking-wider block mb-1">STADIUM METRO GATES</span>
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${matchState.gatesOpen ? 'bg-[#16A34A]' : 'bg-red-600 animate-pulse'}`} />
                    <span className="text-base font-black text-[#111827]">
                      {matchState.gatesOpen ? 'OPEN (ALL WINGS)' : 'LOCKED CLOSED'}
                    </span>
                  </div>
                </div>

                <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-[0_4px_15px_rgba(0,0,0,0.02)]">
                  <span className="text-3xs text-[#6B7280] font-extrabold uppercase tracking-wider block mb-1">TICKET RESERVATION ENGINE</span>
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${matchState.bookingsPaused ? 'bg-amber-500' : 'bg-[#16A34A]'}`} />
                    <span className="text-base font-black text-[#111827]">
                      {matchState.bookingsPaused ? 'SALES PAUSED' : 'ONLINE (SELLING)'}
                    </span>
                  </div>
                </div>

                <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-[0_4px_15px_rgba(0,0,0,0.02)]">
                  <span className="text-3xs text-[#6B7280] font-extrabold uppercase tracking-wider block mb-1">EMERGENCY STATE STATUS</span>
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${matchState.emergencyMode ? 'bg-red-600 animate-ping' : 'bg-[#6B7280]'}`} />
                    <span className="text-base font-black text-[#111827]">
                      {matchState.emergencyMode ? 'MASS EVACUATION ACTIVE' : 'NORMAL (ALL SYSTEMS SAFE)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* ACTION TOGGLES PANEL with specifications: bg-[#16A34A] (Green), rounded-2xl, custom green shadow */}
              <div className="bg-white border border-[#E5E7EB] rounded-[28px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] space-y-6">
                <span className="text-xs font-black text-[#111827] uppercase tracking-wider block border-b border-[#E5E7EB] pb-3">
                  STADIUM HARDWARE OVERRIDES
                </span>

                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => {
                      setMatchState(prev => ({ ...prev, gatesOpen: !prev.gatesOpen }));
                      alert(matchState.gatesOpen ? 'All electronic gates LOCKED.' : 'All electronic gates UNLOCKED successfully.');
                    }}
                    className="px-6 py-3.5 bg-[#16A34A] hover:bg-[#22C55E] text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-[0_8px_20px_rgba(34,197,94,0.3)] hover:shadow-[0_12px_24px_rgba(34,197,94,0.4)] transition-all cursor-pointer"
                  >
                    {matchState.gatesOpen ? '🔒 Lock Gates' : '🔑 Unlock Stadium Gates'}
                  </button>

                  <button
                    onClick={() => {
                      setMatchState(prev => ({ ...prev, bookingsPaused: !prev.bookingsPaused }));
                      alert(matchState.bookingsPaused ? 'Ticket Sales RESUMED.' : 'Ticket Sales PAUSED.');
                    }}
                    className="px-6 py-3.5 bg-[#16A34A] hover:bg-[#22C55E] text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-[0_8px_20px_rgba(34,197,94,0.3)] hover:shadow-[0_12px_24px_rgba(34,197,94,0.4)] transition-all cursor-pointer"
                  >
                    {matchState.bookingsPaused ? '▶ Resume Ticket Sales' : '⏸ Pause Ticket Sales'}
                  </button>

                  <button
                    onClick={() => {
                      setMatchState(prev => ({ ...prev, emergencyMode: !prev.emergencyMode }));
                      alert(matchState.emergencyMode ? 'Emergency mode DISMISSED.' : 'ALERT: Emergency state initialized across all SwissArena units!');
                    }}
                    className={`px-6 py-3.5 font-extrabold text-xs uppercase tracking-wider rounded-2xl transition-all cursor-pointer shadow-md ${
                      matchState.emergencyMode 
                        ? 'bg-[#16A34A] hover:bg-[#22C55E] text-white shadow-[0_8px_20px_rgba(34,197,94,0.3)]' 
                        : 'bg-red-600 hover:bg-red-500 text-white shadow-[0_8px_20px_rgba(220,38,38,0.3)] animate-pulse'
                    }`}
                  >
                    {matchState.emergencyMode ? '🟢 Clear Evac Alarm' : '🚨 ACTIVATE EMERGENCY STATE'}
                  </button>
                </div>
              </div>

              {/* ANNOUNCEMENT BROADCASTER */}
              <div className="bg-white border border-[#E5E7EB] rounded-[28px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] space-y-6">
                <span className="text-xs font-black text-[#111827] uppercase tracking-wider block">
                  PUBLIC BROADCAST DISPATCHER
                </span>

                <form onSubmit={handleDispatchAnnouncement} className="space-y-4">
                  <textarea
                    rows={3}
                    placeholder="Type official SwissArena warning or informational update to broadcast instantly..."
                    value={matchState.announcementText}
                    onChange={(e) => setMatchState(prev => ({ ...prev, announcementText: e.target.value }))}
                    className="w-full bg-[#F8FAFC] border border-[#E5E7EB] p-4 text-xs rounded-2xl focus:outline-none focus:border-[#16A34A] text-[#111827] font-medium"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#16A34A] hover:bg-[#22C55E] text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-[0_8px_20px_rgba(34,197,94,0.25)] cursor-pointer"
                  >
                    Broadcast to Stadium Screens
                  </button>
                </form>

                {/* Queue log */}
                <div className="space-y-3">
                  <span className="text-3xs font-extrabold text-[#6B7280] uppercase tracking-wider block">Recent broadcasts log</span>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {matchState.announcementsList.map((ann) => (
                      <div key={ann.id} className="flex justify-between items-center p-3 bg-[#F8FAFC] rounded-xl border border-[#E5E7EB] text-xs">
                        <span className="font-semibold text-[#111827]">{ann.text}</span>
                        <span className="text-3xs text-[#6B7280] font-mono font-bold">{ann.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: SEATING DYNAMIC PRICING & LIVE HEATMAP */}
          {activeTab === 'Seats' && (
            <div className="space-y-8 animate-fade-in text-left">
              <div>
                <h2 className="text-2xl font-black text-[#111827] tracking-tight">STADIUM SEATING ADMINISTRATION</h2>
                <p className="text-sm text-[#6B7280]">Adjust dynamic seat prices based on match density, and view the interactive heatmap.</p>
              </div>

              {/* SECTIONS BULK MANAGEMENT */}
              <div className="bg-white border border-[#E5E7EB] rounded-[28px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] space-y-6">
                <span className="text-xs font-black text-[#111827] uppercase tracking-wider block">DYNAMIC BULK MODIFIERS</span>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1.5">
                    <label htmlFor="bulk-stand-select" className="text-2xs font-bold text-[#111827] uppercase">Target Sector</label>
                    <select
                      id="bulk-stand-select"
                      value={selectedSection}
                      onChange={(e) => setSelectedSection(e.target.value as any)}
                      className="w-full bg-[#F8FAFC] border border-[#E5E7EB] p-3 text-xs rounded-xl focus:outline-none focus:border-[#16A34A] text-[#111827]"
                    >
                      <option value="All">All Arena Sectors</option>
                      <option value="East">East Stand</option>
                      <option value="West">West Stand</option>
                      <option value="North">North Stand</option>
                      <option value="South">South Stand</option>
                      <option value="VIP">VIP Executive Box</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="bulk-price-input" className="text-2xs font-bold text-[#111827] uppercase">Price Offset (CHF)</label>
                    <input
                      id="bulk-price-input"
                      type="number"
                      placeholder="e.g. +15 or -10"
                      value={priceModifier}
                      onChange={(e) => setPriceModifier(Number(e.target.value))}
                      className="w-full bg-[#F8FAFC] border border-[#E5E7EB] p-3 text-xs rounded-xl focus:outline-none focus:border-[#16A34A] text-[#111827]"
                    />
                  </div>

                  <div className="flex items-end gap-2">
                    <button
                      onClick={handleBulkUpdatePrice}
                      className="flex-1 py-3.5 bg-[#16A34A] hover:bg-[#22C55E] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer"
                    >
                      Apply Offset
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 border-t border-[#E5E7EB] pt-4">
                  <button
                    onClick={() => handleBulkBlockSection(true)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                  >
                    🔒 Close Sector
                  </button>
                  <button
                    onClick={() => handleBulkBlockSection(false)}
                    className="px-4 py-2 bg-[#16A34A] hover:bg-[#22C55E] text-white font-bold text-xs rounded-xl transition cursor-pointer"
                  >
                    🔓 Open Sector
                  </button>
                </div>
              </div>

              {/* INTERACTIVE HEATMAP PANEL */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Visual Heatmap Map */}
                <div className="lg:col-span-7 bg-white border border-[#E5E7EB] rounded-[28px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#111827] uppercase tracking-wider">LIVE STADIUM HEATMAP</span>
                    <span className="text-3xs text-[#6B7280] font-mono font-bold">CLICK STAND TO ANALYZE</span>
                  </div>

                  {/* SVG Heatmap structure with interactive nodes */}
                  <div className="relative flex justify-center py-6 bg-[#F8FAFC] rounded-2xl border border-[#E5E7EB]">
                    <svg viewBox="0 0 500 300" className="w-full max-w-[400px] h-auto drop-shadow-sm">
                      {/* North Stand */}
                      <path
                        d="M 120 40 L 380 40 L 410 70 L 90 70 Z"
                        fill={heatmapSelection === 'North' ? '#FBBF24' : '#FCD34D'}
                        stroke="#FFF"
                        strokeWidth="2"
                        className="cursor-pointer hover:opacity-85 transition"
                        onClick={() => setHeatmapSelection('North')}
                      />
                      <text x="250" y="55" fill="#78350F" textAnchor="middle" className="text-[10px] font-black select-none pointer-events-none">North Stand (95%)</text>

                      {/* South Stand */}
                      <path
                        d="M 90 230 L 410 230 L 380 260 L 120 260 Z"
                        fill={heatmapSelection === 'South' ? '#10B981' : '#34D399'}
                        stroke="#FFF"
                        strokeWidth="2"
                        className="cursor-pointer hover:opacity-85 transition"
                        onClick={() => setHeatmapSelection('South')}
                      />
                      <text x="250" y="250" fill="#064E3B" textAnchor="middle" className="text-[10px] font-black select-none pointer-events-none">South Stand (78%)</text>

                      {/* East Stand */}
                      <path
                        d="M 410 75 L 440 100 L 440 200 L 410 225 Z"
                        fill={heatmapSelection === 'East' ? '#F59E0B' : '#FBBF24'}
                        stroke="#FFF"
                        strokeWidth="2"
                        className="cursor-pointer hover:opacity-85 transition"
                        onClick={() => setHeatmapSelection('East')}
                      />
                      <text x="425" y="155" fill="#78350F" textAnchor="middle" transform="rotate(90 425 155)" className="text-[10px] font-black select-none pointer-events-none">East (94%)</text>

                      {/* West Stand */}
                      <path
                        d="M 90 75 L 60 100 L 60 200 L 90 225 Z"
                        fill={heatmapSelection === 'West' ? '#10B981' : '#34D399'}
                        stroke="#FFF"
                        strokeWidth="2"
                        className="cursor-pointer hover:opacity-85 transition"
                        onClick={() => setHeatmapSelection('West')}
                      />
                      <text x="75" y="155" fill="#064E3B" textAnchor="middle" transform="rotate(-90 75 155)" className="text-[10px] font-black select-none pointer-events-none">West (88%)</text>

                      {/* VIP Stand center luxury deck */}
                      <ellipse
                        cx="250"
                        cy="150"
                        rx="75"
                        ry="40"
                        fill={heatmapSelection === 'VIP' ? '#EF4444' : '#FCA5A5'}
                        stroke="#FFF"
                        strokeWidth="2"
                        className="cursor-pointer hover:opacity-85 transition"
                        onClick={() => setHeatmapSelection('VIP')}
                      />
                      <text x="250" y="153" fill="#7F1D1D" textAnchor="middle" className="text-[10px] font-black select-none pointer-events-none">VIP Box (100%)</text>
                    </svg>
                  </div>
                </div>

                {/* Heatmap selection summary card */}
                <div className="lg:col-span-5 bg-white border border-[#E5E7EB] rounded-[28px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] space-y-6">
                  <span className="text-xs font-black text-[#111827] uppercase tracking-wider block">SECTOR INSIGHTS</span>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-black text-[#111827]">{heatmapSelection} Sector Stand</span>
                      <span className={`px-2 py-0.5 rounded-lg border text-3xs font-extrabold uppercase ${heatmapData[heatmapSelection].color}`}>
                        {heatmapData[heatmapSelection].status}
                      </span>
                    </div>

                    <div className="space-y-2 font-mono text-2xs text-[#6B7280]">
                      <div className="flex justify-between border-b border-[#E5E7EB] pb-2">
                        <span>Current Occupancy:</span>
                        <strong className="text-[#111827]">{heatmapData[heatmapSelection].occupancy}%</strong>
                      </div>
                      <div className="flex justify-between border-b border-[#E5E7EB] pb-2">
                        <span>Active Ticket Count:</span>
                        <strong className="text-[#111827]">{heatmapData[heatmapSelection].count.toLocaleString()} fans</strong>
                      </div>
                      <div className="flex justify-between border-b border-[#E5E7EB] pb-2">
                        <span>Ticket Baseline Cost:</span>
                        <strong className="text-[#111827]">CHF {heatmapData[heatmapSelection].price}</strong>
                      </div>
                      <div className="flex justify-between pb-1">
                        <span>Threat Congestion Index:</span>
                        <strong className={heatmapData[heatmapSelection].occupancy > 90 ? 'text-red-600 animate-pulse font-black' : 'text-[#16A34A] font-black'}>
                          {heatmapData[heatmapSelection].occupancy > 90 ? 'HIGH WARNING' : 'STABLE SAFE'}
                        </strong>
                      </div>
                    </div>

                    <p className="text-3xs text-[#6B7280] leading-relaxed italic">
                      * Stand metric nodes are updated in real-time via seat pressure sensors and dynamic thermal CCTV cameras mounted under the SwissArena roof beams.
                    </p>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 4: FOOD ORDERS & INVENTORY TRACKER */}
          {activeTab === 'Food' && (
            <div className="space-y-8 animate-fade-in text-left">
              <div>
                <h2 className="text-2xl font-black text-[#111827] tracking-tight">CONCESSIONS & FOOD DISPATCH</h2>
                <p className="text-sm text-[#6B7280]">Update active fan seat orders and audit concession stock levels instantly.</p>
              </div>

              {/* Concession orders panel */}
              <div className="bg-white border border-[#E5E7EB] rounded-[28px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] space-y-6">
                <span className="text-xs font-black text-[#111827] uppercase tracking-wider block border-b border-[#E5E7EB] pb-3">
                  ACTIVE SEAT DELIVERY DISPATCHES ({filteredOrders.length})
                </span>

                <div className="space-y-3.5 max-h-[400px] overflow-y-auto pr-1">
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((ord) => (
                      <div key={ord.id} className="p-4 bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:scale-[1.01] transition-transform duration-200">
                        <div className="space-y-1.5 text-xs text-[#6B7280]">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-emerald-50 text-[#16A34A] font-extrabold text-[9px] rounded-md border border-emerald-100 uppercase">
                              ORDER {ord.id}
                            </span>
                            <span className="font-mono text-2xs text-[#111827] font-extrabold">CHF {ord.totalPrice.toFixed(2)}</span>
                          </div>
                          
                          <p className="text-2xs text-[#111827]">
                            Deliver to: <strong className="text-[#16A34A] font-extrabold">{ord.section} Row {ord.row}, Seat {ord.seatNumber}</strong> for <strong>{ord.customerName}</strong> ({ord.phone})
                          </p>
                          
                          <div className="flex flex-wrap gap-1.5 pt-0.5">
                            {ord.items.map((it, index) => (
                              <span key={index} className="bg-white border border-[#E5E7EB] text-3xs px-2 py-1 rounded-lg text-[#111827] font-semibold">
                                🌭 {it.name} (x{it.quantity})
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Order action button toggles */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          {['Received', 'Preparing', 'Out for Delivery', 'Delivered'].map((status) => (
                            <button
                              id={`status-btn-${ord.id}-${status}`}
                              key={status}
                              onClick={() => {
                                onUpdateOrderStatus(ord.id, status as any);
                                alert(`Order ${ord.id} status updated to ${status}`);
                              }}
                              className={`px-3 py-1.5 rounded-xl text-3xs font-black uppercase tracking-wider transition cursor-pointer select-none ${
                                ord.status === status
                                  ? 'bg-[#16A34A] text-white shadow-sm'
                                  : 'bg-white text-[#6B7280] border border-[#E5E7EB] hover:bg-[#DCFCE7] hover:text-[#111827]'
                              }`}
                            >
                              {status}
                            </button>
                          ))}
                        </div>

                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-[#6B7280] text-xs">
                      No active concessions orders placed yet. Toggle the food menu items to trigger instant operations queue dispatches!
                    </div>
                  )}
                </div>
              </div>

              {/* Food Inventory Tracker */}
              <div className="bg-white border border-[#E5E7EB] rounded-[28px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] space-y-6">
                <span className="text-xs font-black text-[#111827] uppercase tracking-wider block">
                  CONCESSION INVENTORY CONTROLLER
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {foodInventory.map((item) => (
                    <div key={item.id} className="p-4 bg-[#F8FAFC] rounded-2xl border border-[#E5E7EB] flex flex-col justify-between space-y-3">
                      <div className="space-y-1">
                        <div className="flex justify-between text-2xs">
                          <span className="text-3xs text-[#6B7280] font-extrabold uppercase">{item.category}</span>
                          <span className={`px-2 py-0.5 rounded font-extrabold text-[8px] ${item.quantity < 100 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-[#DCFCE7] text-[#16A34A]'}`}>
                            {item.quantity < 100 ? 'LOW STOCK' : 'IN STOCK'}
                          </span>
                        </div>
                        <h4 className="text-xs font-black text-[#111827]">{item.name}</h4>
                        <div className="pt-1.5 text-3xs text-[#6B7280] space-y-0.5 font-mono">
                          <div>Stock Quantity: <strong className="text-[#111827]">{item.quantity} units</strong></div>
                          <div>Sales Rate: <strong className="text-[#111827]">{item.sales} sold</strong></div>
                          <div>AI Prediction: <strong className="text-[#16A34A]">{item.prediction}</strong></div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRestock(item.id)}
                        className="w-full py-2 bg-[#16A34A] hover:bg-[#22C55E] text-white text-3xs font-extrabold uppercase tracking-wider rounded-xl shadow-sm cursor-pointer"
                      >
                        ⚡ Replenish Stock
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 5: LIVE FOOD DELIVERY MAP SIMULATOR */}
          {activeTab === 'Deliveries' && (
            <div className="space-y-8 animate-fade-in text-left">
              <div>
                <h2 className="text-2xl font-black text-[#111827] tracking-tight">LIVE DELIVERY RADAR</h2>
                <p className="text-sm text-[#6B7280]">Real-time visual routes of F&B concourse usher teams delivering orders to fans.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Visual Delivery map */}
                <div className="lg:col-span-7 bg-white border border-[#E5E7EB] rounded-[28px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#111827] uppercase tracking-wider">LIVE COURIER RADAR PATHS</span>
                    <span className="text-[9px] bg-[#DCFCE7] text-[#16A34A] px-2 py-0.5 rounded font-extrabold uppercase">3 RUNNERS DISPATCHED</span>
                  </div>

                  {/* Draw beautiful animated vectors */}
                  <div className="relative flex justify-center py-6 bg-slate-900 rounded-3xl border border-slate-800">
                    <svg viewBox="0 0 500 300" className="w-full max-w-[400px] h-auto">
                      {/* Stadium Oval outline */}
                      <ellipse cx="250" cy="150" rx="180" ry="110" fill="none" stroke="#2D3748" strokeWidth="4" />
                      <ellipse cx="250" cy="150" rx="140" ry="80" fill="none" stroke="#2D3748" strokeWidth="2" strokeDasharray="4 4" />
                      
                      {/* Kitchen Center Hub */}
                      <circle cx="250" cy="150" r="14" fill="#16A34A" stroke="#FFF" strokeWidth="2.5" />
                      <text x="250" y="153" fill="#FFF" textAnchor="middle" className="text-[7px] font-black pointer-events-none select-none">HUB</text>

                      {/* Runner 1 Route to East */}
                      <path d="M 250 150 Q 330 150, 390 150" fill="none" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="3" strokeLinecap="round" />
                      <circle cx={250 + (140 * runners[0].progress) / 100} cy="150" r="7" fill="#3B82F6" stroke="#FFF" strokeWidth="1.5" className="animate-pulse" />
                      <text x={250 + (140 * runners[0].progress) / 100} y="139" fill="#93C5FD" textAnchor="middle" className="text-[6px] font-bold font-mono">Runner #1</text>

                      {/* Runner 2 Route to VIP */}
                      <path d="M 250 150 Q 250 100, 250 60" fill="none" stroke="rgba(251, 191, 36, 0.4)" strokeWidth="3" />
                      <circle cx="250" cy={150 - (90 * runners[1].progress) / 100} r="7" fill="#FBBF24" stroke="#FFF" strokeWidth="1.5" />
                      <text x="250" y={140 - (90 * runners[1].progress) / 100} fill="#FDE68A" textAnchor="middle" className="text-[6px] font-bold font-mono">Runner #2</text>

                      {/* Runner 3 Route to South */}
                      <path d="M 250 150 Q 250 200, 250 240" fill="none" stroke="rgba(239, 68, 68, 0.4)" strokeWidth="3" />
                      <circle cx="250" cy={150 + (90 * runners[2].progress) / 100} r="7" fill="#EF4444" stroke="#FFF" strokeWidth="1.5" />
                      <text x="250" y={164 + (90 * runners[2].progress) / 100} fill="#FCA5A5" textAnchor="middle" className="text-[6px] font-bold font-mono">Runner #3</text>
                    </svg>

                    <div className="absolute bottom-3 left-3 right-3 flex justify-between text-[8px] font-mono text-slate-400 bg-slate-950/80 p-2 rounded-xl">
                      <span>RADAR SCAN INTERVAL: 500MS</span>
                      <span className="text-[#16A34A]">✓ COURIER LOCATIONS ENCRYPTED</span>
                    </div>
                  </div>
                </div>

                {/* Runners Details List */}
                <div className="lg:col-span-5 bg-white border border-[#E5E7EB] rounded-[28px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] space-y-4">
                  <span className="text-xs font-black text-[#111827] uppercase tracking-wider block">ACTIVE RUNNERS LOG</span>

                  <div className="space-y-3">
                    {runners.map((r, idx) => (
                      <div key={idx} className="p-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl text-xs space-y-2">
                        <div className="flex justify-between items-center font-bold text-[#111827]">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]" />
                            {r.id} ({r.name})
                          </span>
                          <span className="font-mono text-3xs text-[#6B7280] bg-white px-2 py-0.5 rounded border border-[#E5E7EB]">
                            {r.progress}% DISPATCHED
                          </span>
                        </div>
                        <p className="text-3xs text-[#6B7280] font-semibold uppercase font-mono">Route: {r.route}</p>
                        
                        {/* Progress Bar */}
                        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-[#16A34A]" style={{ width: `${r.progress}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 6: CROWD FLUID FLOW & ANALYTICS */}
          {activeTab === 'Crowd' && (
            <div className="space-y-8 animate-fade-in text-left">
              <div>
                <h2 className="text-2xl font-black text-[#111827] tracking-tight">CROWD FLUID ANALYTICS</h2>
                <p className="text-sm text-[#6B7280]">Live S-Bahn arrival charts, fan concourse congestion timelines and demographics indices.</p>
              </div>

              {/* RECHARTS PLOTS COMPOSITE GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* TIMELINE AREA CHART */}
                <div className="bg-white border border-[#E5E7EB] rounded-[28px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] space-y-4">
                  <span className="text-xs font-black text-[#111827] uppercase tracking-wider block">INGRESS GATE PEAKS TIMELINE</span>
                  
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={crowdTimelineData}>
                        <defs>
                          <linearGradient id="colorIngress" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#16A34A" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#16A34A" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis dataKey="time" stroke="#6B7280" fontSize={10} />
                        <YAxis stroke="#6B7280" fontSize={10} />
                        <Tooltip />
                        <Area type="monotone" dataKey="ingress" stroke="#16A34A" fillOpacity={1} fill="url(#colorIngress)" name="Entrance Gates" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* SALES CHART */}
                <div className="bg-white border border-[#E5E7EB] rounded-[28px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] space-y-4">
                  <span className="text-xs font-black text-[#111827] uppercase tracking-wider block">CONCESSION SALES VS STOCKTIMELINE</span>
                  
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={salesTrendData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis dataKey="item" stroke="#6B7280" fontSize={10} />
                        <YAxis stroke="#6B7280" fontSize={10} />
                        <Tooltip />
                        <Line type="monotone" dataKey="sales" stroke="#16A34A" strokeWidth={3} name="Total Sales" />
                        <Line type="monotone" dataKey="stock" stroke="#3B82F6" strokeWidth={2} name="Current Stock" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>

              {/* DEMOGRAPHICS AND HISTORIC REGISTERED VISITOR TABLES */}
              <div className="bg-white border border-[#E5E7EB] rounded-[28px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] space-y-6">
                <span className="text-xs font-black text-[#111827] uppercase tracking-wider block">HISTORICAL REGISTERED TICKETS DATABASE</span>

                {/* Tables must be white, rounded, sticky headers, with search/filters */}
                <div className="overflow-x-auto rounded-2xl border border-[#E5E7EB]">
                  <table className="w-full text-left border-collapse bg-white text-xs text-[#111827]">
                    <thead>
                      <tr className="bg-[#F8FAFC] border-b border-[#E5E7EB] font-extrabold uppercase text-[#6B7280] tracking-wider text-3xs sticky top-0">
                        <th className="p-4">Customer Name</th>
                        <th className="p-4">Ticket ID</th>
                        <th className="p-4">Seat Assigned</th>
                        <th className="p-4">Category Section</th>
                        <th className="p-4">Contact Phone</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E7EB]">
                      {[
                        { name: 'Adhil Hassan', id: 'TKT-SA-9281', seat: 'VIP-4', stand: 'VIP Executive Box', phone: '+41 79 123 45 67' },
                        { name: 'John Miller', id: 'TKT-SA-1102', seat: 'East B-12', stand: 'East Wing Premium', phone: '+41 78 854 22 11' },
                        { name: 'Sarah Dubois', id: 'TKT-SA-4390', seat: 'North F-8', stand: 'North Fan Curve', phone: '+41 79 330 40 50' },
                        { name: 'David Glarus', id: 'TKT-SA-7721', seat: 'South S-14', stand: 'South Stand Standard', phone: '+41 76 990 12 34' }
                      ].map((item, index) => (
                        <tr key={index} className="hover:bg-[#DCFCE7]/20 transition-colors duration-150">
                          <td className="p-4 font-bold">{item.name}</td>
                          <td className="p-4 font-mono text-[#6B7280]">{item.id}</td>
                          <td className="p-4 font-black text-[#16A34A]">{item.seat}</td>
                          <td className="p-4 text-[#6B7280]">{item.stand}</td>
                          <td className="p-4 font-mono text-[#6B7280]">{item.phone}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 7: DIGITAL TWIN SIMULATOR */}
          {activeTab === 'DigitalTwin' && (
            <div className="space-y-8 animate-fade-in text-left">
              <div>
                <h2 className="text-2xl font-black text-[#111827] tracking-tight">DIGITAL TWIN HOLOGRAM</h2>
                <p className="text-sm text-[#6B7280]">Simulate extreme weather presets, S-Bahn transit frequencies and stadium stress alerts.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* 3D Visual blueprint drawing representation */}
                <div className="lg:col-span-7 bg-white border border-[#E5E7EB] rounded-[28px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] space-y-4">
                  <span className="text-xs font-black text-[#111827] uppercase tracking-wider block">3D STRUCTURAL blueprint SYSTEM</span>

                  <div className="relative flex justify-center py-10 bg-slate-950 rounded-3xl border border-slate-900 overflow-hidden min-h-[300px]">
                    
                    {/* Animated Holographic grid design representing a 3D Stadium */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(22,163,74,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(22,163,74,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
                    
                    <div className="relative flex flex-col items-center justify-center space-y-6 z-10 text-center">
                      <div className="relative w-48 h-36 border border-[#16A34A]/50 rounded-full transform rotateX-[60deg] rotateZ-[30deg] flex items-center justify-center animate-spin-slow">
                        {/* Nested rings to feel like a 3D stadium */}
                        <div className="absolute w-40 h-28 border border-[#16A34A]/40 rounded-full animate-pulse" />
                        <div className="absolute w-32 h-20 border-2 border-white/80 rounded-full bg-[#16A34A]/10 flex items-center justify-center">
                          {/* Inner Pitch */}
                          <div className="w-24 h-12 border border-white rounded-md" />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[10px] font-mono text-[#16A34A] font-extrabold tracking-widest block uppercase">SWISSARENA BLUEPRINT INTERACTIVE LAYER</span>
                        <p className="text-slate-300 text-2xs max-w-sm font-medium">Holographic nodes confirm 95.2% structural and environmental load compliance.</p>
                      </div>
                    </div>

                    <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 bg-[#16A34A]/20 border border-[#16A34A]/40 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-ping" />
                      <span className="text-[8px] font-mono font-black text-white">SENSORS ONLINE</span>
                    </div>
                  </div>
                </div>

                {/* Simulation Environmental Controls panel */}
                <div className="lg:col-span-5 bg-white border border-[#E5E7EB] rounded-[28px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] space-y-6">
                  <span className="text-xs font-black text-[#111827] uppercase tracking-wider block">STRESS SYSTEM SIMULATOR</span>

                  <div className="space-y-5">
                    <div className="space-y-1.5">
                      <label htmlFor="sim-weather-select" className="text-2xs font-bold text-[#111827] uppercase">Weather Scenario</label>
                      <select
                        id="sim-weather-select"
                        value={weatherPreset}
                        onChange={(e) => setWeatherPreset(e.target.value as any)}
                        className="w-full bg-[#F8FAFC] border border-[#E5E7EB] p-3 text-xs rounded-xl focus:outline-none focus:border-[#16A34A] text-[#111827] font-bold"
                      >
                        <option value="Sunny">Clear Skies (Sunny Zurich)</option>
                        <option value="Heavy Rain">Heavy Alpine Downpour</option>
                        <option value="Storm">Extreme Thunderstorm Grid Alert</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="sim-transit-select" className="text-2xs font-bold text-[#111827] uppercase">S-Bahn Metro Frequency</label>
                      <select
                        id="sim-transit-select"
                        value={metroFrequency}
                        onChange={(e) => setMetroFrequency(e.target.value as any)}
                        className="w-full bg-[#F8FAFC] border border-[#E5E7EB] p-3 text-xs rounded-xl focus:outline-none focus:border-[#16A34A] text-[#111827] font-bold"
                      >
                        <option value="Standard">Standard Frequency (every 10 mins)</option>
                        <option value="Doubled">Doubled Express Frequency (every 5 mins)</option>
                      </select>
                    </div>

                    <button
                      onClick={() => alert(`Applying Digital Twin stress simulation!\nWeather system: ${weatherPreset}\nS-Bahn frequency order: ${metroFrequency}`)}
                      className="w-full py-4 bg-[#16A34A] hover:bg-[#22C55E] text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-[0_8px_20px_rgba(34,197,94,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-current" /> Initialize Twin Simulation
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 8: EMERGENCY CENTER */}
          {activeTab === 'Emergency' && (
            <div className="space-y-8 animate-fade-in text-left">
              <div>
                <h2 className="text-2xl font-black text-[#111827] tracking-tight">EMERGENCY RESPONSE CENTER</h2>
                <p className="text-sm text-[#6B7280]">Fulfill fan-submitted medical or safety dispatches instantly.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Active Dispatches List */}
                <div className="lg:col-span-8 bg-white border border-[#E5E7EB] rounded-[28px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] space-y-6">
                  <span className="text-xs font-black text-[#111827] uppercase tracking-wider block border-b border-[#E5E7EB] pb-3">
                    ACTIVE FIELD SAFETY ALERTS ({emergencies.length})
                  </span>

                  <div className="space-y-4">
                    {emergencies.length > 0 ? (
                      emergencies.map((ticket) => (
                        <div
                          key={ticket.id}
                          className={`p-4 border rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition duration-300 ${
                            ticket.status === 'Resolved'
                              ? 'bg-slate-50 border-slate-200 opacity-60'
                              : 'bg-red-50 border-red-200 text-red-700 animate-pulse'
                          }`}
                        >
                          <div className="space-y-1.5 text-xs">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 bg-red-600 text-white font-bold tracking-widest text-[8px] rounded-md uppercase">
                                {ticket.type}
                              </span>
                              <span className="font-mono text-2xs font-extrabold text-[#111827]">TICKET {ticket.id}</span>
                              <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold ${
                                ticket.priority === 'Critical' ? 'bg-red-200 text-red-800' : 'bg-slate-100 text-slate-700'
                              }`}>
                                {ticket.priority} Priority
                              </span>
                            </div>
                            
                            <p className="font-medium text-[#111827]">"{ticket.description}"</p>
                            
                            <p className="text-3xs text-[#6B7280] font-mono font-bold uppercase">
                              COORDINATES: {ticket.section} Row {ticket.row}, Seat {ticket.seat} | DISPATCHED: {ticket.assignedStaff || 'Pending officer'}
                            </p>
                          </div>

                          <div className="shrink-0">
                            {ticket.status !== 'Resolved' ? (
                              <button
                                onClick={() => {
                                  onUpdateEmergencyStatus(ticket.id, 'Resolved', 'Operations Officer Alpha');
                                  alert(`Emergency ticket ${ticket.id} resolved successfully.`);
                                }}
                                className="px-4 py-2 bg-[#16A34A] hover:bg-[#22C55E] text-white text-3xs font-extrabold uppercase tracking-wider rounded-xl shadow-sm cursor-pointer"
                              >
                                Fulfill Alert ✓
                              </button>
                            ) : (
                              <span className="text-[#16A34A] text-2xs font-extrabold uppercase tracking-wide flex items-center gap-1">
                                <CheckCircle className="w-4 h-4" /> RESOLVED
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 text-[#6B7280] text-xs">
                        All systems secure. No medical or security dispatches logged at SwissArena.
                      </div>
                    )}
                  </div>
                </div>

                {/* Evacuation button warning panel */}
                <div className="lg:col-span-4 bg-white border border-[#E5E7EB] rounded-[28px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] space-y-6">
                  <span className="text-xs font-black text-[#111827] uppercase tracking-wider block text-red-600">MASS ALARM CONTROLLER</span>
                  
                  <div className="space-y-4">
                    <p className="text-2xs text-[#6B7280] leading-relaxed">
                      ACTIVATE MASS EVACUATION ALARM ONLY during extreme incidents requiring immediate exit of SwissArena's 48,000 visitors. This transmits signals directly to Zurich emergency systems and activates S-Bahn rescue routes.
                    </p>

                    <button
                      onClick={() => {
                        const conf = window.confirm('WARNING: Are you absolutely certain you wish to transmit the Mass Evacuation command? This will deploy sirens across SwissArena!');
                        if (conf) {
                          setMatchState(prev => ({ ...prev, emergencyMode: true }));
                          alert('SIRENS DEPLOYED. Mass evacuation signal transmitted across Zurich public rescue channels.');
                        }
                      }}
                      className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs uppercase tracking-widest rounded-2xl shadow-[0_8px_20px_rgba(220,38,38,0.3)] animate-bounce cursor-pointer"
                    >
                      🚨 ACTIVATE EVAC PROTOCOL
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 9: SETTINGS PAGE */}
          {activeTab === 'Settings' && (
            <div className="space-y-8 animate-fade-in text-left">
              <div>
                <h2 className="text-2xl font-black text-[#111827] tracking-tight">OPERATIONS WORKSPACE CONFIGURATION</h2>
                <p className="text-sm text-[#6B7280]">Configure dynamic operational parameters and dynamic brand colors.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                
                {/* Branding and Accents settings card */}
                <div className="bg-white border border-[#E5E7EB] rounded-[28px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] space-y-6">
                  <span className="text-xs font-black text-[#111827] uppercase tracking-wider block">BRANDING CONFIGURATION</span>
                  
                  <div className="space-y-4 text-xs">
                    <div className="space-y-1">
                      <span className="text-3xs font-extrabold text-[#6B7280] uppercase tracking-wider block">Primary Accent Theme</span>
                      <div className="flex gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#16A34A] border-2 border-white ring-2 ring-[#16A34A] cursor-pointer" />
                        <span className="w-6 h-6 rounded-full bg-[#E30613] border-2 border-white cursor-pointer" title="Switch to Swiss Arena Red" onClick={() => alert('Swiss Classic Red color schema set!')} />
                        <span className="w-6 h-6 rounded-full bg-blue-600 border-2 border-white cursor-pointer" title="Switch to Ocean Blue" onClick={() => alert('Swiss Arena Ocean Blue color schema set!')} />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="settings-lang-select" className="text-3xs font-extrabold text-[#6B7280] uppercase block">Operations Language</label>
                      <select
                        id="settings-lang-select"
                        className="w-full bg-[#F8FAFC] border border-[#E5E7EB] p-2.5 rounded-xl focus:outline-none focus:border-[#16A34A]"
                      >
                        <option>English (Official FIFA Matchday)</option>
                        <option>German (Schweizerdeutsch)</option>
                        <option>French (Français)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* API and secret settings card */}
                <div className="bg-white border border-[#E5E7EB] rounded-[28px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] space-y-6">
                  <span className="text-xs font-black text-[#111827] uppercase tracking-wider block">AI CO-PILOT CONFIGURATION</span>
                  
                  <div className="space-y-4 text-xs">
                    <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-3">
                      <div>
                        <h5 className="font-bold">Real-Time Sensor Polling</h5>
                        <p className="text-3xs text-[#6B7280]">Enable simulated thermal camera stream polling.</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-[#16A34A] focus:ring-[#16A34A]" />
                    </div>

                    <div className="flex justify-between items-center pb-1">
                      <div>
                        <h5 className="font-bold">AI Autopilot Dispatches</h5>
                        <p className="text-3xs text-[#6B7280]">Authorize models to double train frequencies.</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-[#16A34A] focus:ring-[#16A34A]" />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </main>

      </div>

    </div>
  );
}
