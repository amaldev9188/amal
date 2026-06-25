import React, { useState } from 'react';
import { Seat } from '../types';
import { Check, Info, Star, Users, Award, ShieldAlert, CheckCircle, Mail, Phone, User } from 'lucide-react';

interface SeatBookingMapProps {
  seats: Seat[];
  onBookSeat: (seatId: string, name: string, phone: string, email: string) => void;
  selectedSeatId: string | null;
  onSelectSeat: (seatId: string | null) => void;
}

// Fixed zone definitions matching Screenshot 2
const ZONES = [
  { id: 'VIP', label: 'VIP Zone', price: 480, color: '#FF8A8A', desc: 'Top center executive suite deck, premium padded seats and full visual fields.' },
  { id: 'Premium', label: 'Premium Zone', price: 220, color: '#FF4B4B', desc: 'East & West side-line seats, closest to team benches with superb perspective.' },
  { id: 'Standard', label: 'Standard Zone', price: 75, color: '#94A3B8', desc: 'Upper and lower curves, incredible fan atmosphere and direct overview.' },
  { id: 'Family', label: 'Family Zone', price: 55, color: '#E2C19D', desc: 'Dedicated family-friendly stands with custom amenities and easy stroller access.' }
];

export default function SeatBookingMap({
  seats,
  onBookSeat,
  selectedSeatId,
  onSelectSeat,
}: SeatBookingMapProps) {
  const [selectedZone, setSelectedZone] = useState<'VIP' | 'Premium' | 'Standard' | 'Family'>('Premium');
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]); // list of seat coordinates e.g., ["B-4", "B-5"]
  
  // Checkout Modal State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  
  // Success state
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);
  const [recentBookings, setRecentBookings] = useState<{ seatCodes: string[]; zoneLabel: string; totalCost: number; ticketCode: string } | null>(null);

  // Deterministic seat status generation for the 15-column A-F grid
  const getSeatStatus = (rowLetter: string, seatNum: number) => {
    // Generate some deterministic Taken/Booked seats so the grid looks exactly like Screenshot 2
    const hash = (rowLetter.charCodeAt(0) * 7 + seatNum * 13) % 10;
    if (hash === 3 || hash === 7) return 'Taken';
    return 'Available';
  };

  const handleSeatClick = (rowLetter: string, seatNum: number) => {
    const seatId = `${rowLetter}-${seatNum}`;
    const status = getSeatStatus(rowLetter, seatNum);
    if (status === 'Taken') return;

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(prev => prev.filter(id => id !== seatId));
    } else {
      if (selectedSeats.length >= 6) {
        alert('You can select a maximum of 6 seats per booking.');
        return;
      }
      setSelectedSeats(prev => [...prev, seatId]);
    }
  };

  const handleConfirmOrder = () => {
    if (selectedSeats.length === 0) return;
    setIsCheckoutOpen(true);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email || selectedSeats.length === 0) return;

    const zoneObj = ZONES.find(z => z.id === selectedZone)!;
    const totalCost = selectedSeats.length * zoneObj.price;
    const ticketCode = `SA-2026-${selectedZone.toUpperCase()}-${Math.floor(Math.random() * 90000 + 10000)}`;

    // Invoke callback for each booked seat
    selectedSeats.forEach(seatCoord => {
      // Find matching mock seat from the store or fallback
      const mockSeatId = `Booking-${selectedZone}-${seatCoord}`;
      onBookSeat(mockSeatId, name, phone, email);
    });

    setRecentBookings({
      seatCodes: [...selectedSeats],
      zoneLabel: zoneObj.label,
      totalCost,
      ticketCode,
    });

    setIsCheckoutOpen(false);
    setShowBookingSuccess(true);
    setSelectedSeats([]);
  };

  const activeZoneObj = ZONES.find(z => z.id === selectedZone)!;
  const currentTotal = selectedSeats.length * activeZoneObj.price;

  return (
    <div className="bg-slate-50 dark:bg-slate-900 rounded-[32px] p-6 md:p-10 border border-slate-200 dark:border-slate-800/80 transition-colors duration-300">
      
      {/* SWISS FLAG TOP HEADER (Matching Screenshot 2) */}
      <div className="flex flex-col md:flex-row items-center justify-between border-b border-slate-200 dark:border-slate-800/60 pb-6 mb-8 gap-4">
        <div className="flex items-center gap-3">
          {/* Swiss flag circle */}
          <div className="w-10 h-10 rounded-full bg-[#E30613] flex items-center justify-center text-white font-extrabold text-2xl shadow-sm select-none">
            +
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white leading-none">SWISS ARENA</h1>
            <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-0.5">OFFICIAL PLATFORM</span>
          </div>
        </div>
        
        {/* Sub Header indicators */}
        <div className="flex items-center gap-6 text-xs text-slate-500 font-medium">
          <span className="hover:text-rose-500 cursor-pointer">Official Ticket Seller</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#E30613]" />
          <span>Zurich Matchday Center</span>
        </div>
      </div>

      {/* PAGE HEADER */}
      <div className="space-y-1 mb-8">
        <span className="text-xs font-black uppercase tracking-wider text-[#E30613] block">
          MATCHDAY TICKETS
        </span>
        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none font-sans">
          Choose your <span className="text-[#E30613]">seat.</span>
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium pt-1">
          Switzerland vs Germany · Sat 12 Jul 2026 · 20:45 CET
        </p>
      </div>

      {/* CORE BOOKING INTERACTIVE CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Map & Seat Picker */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* STEP 1: PICK A ZONE CARD */}
          <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
              1. PICK A ZONE
            </h3>

            {/* Stadium Ellipse Drawing Representation */}
            <div className="flex justify-center py-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-850">
              <svg 
                viewBox="0 0 500 280" 
                className="w-full max-w-[460px] h-auto drop-shadow-md"
              >
                {/* Standard Zone base ellipse */}
                <ellipse 
                  cx="250" 
                  cy="140" 
                  rx="195" 
                  ry="105" 
                  fill="none" 
                  stroke={selectedZone === 'Standard' ? '#94A3B8' : '#E2E8F0'} 
                  strokeWidth={selectedZone === 'Standard' ? '12' : '6'} 
                  className="cursor-pointer transition-all duration-300 hover:stroke-slate-400"
                  onClick={() => { setSelectedZone('Standard'); setSelectedSeats([]); }}
                />

                {/* VIP Zone (Top arc) */}
                <path 
                  d="M 150 72 A 155 85 0 0 1 350 72" 
                  fill="none" 
                  stroke={selectedZone === 'VIP' ? '#F472B6' : '#FF8A8A'} 
                  strokeWidth={selectedZone === 'VIP' ? '16' : '10'} 
                  strokeLinecap="round"
                  className="cursor-pointer transition-all duration-300 hover:stroke-pink-500"
                  onClick={() => { setSelectedZone('VIP'); setSelectedSeats([]); }}
                />

                {/* Premium Zone Left arc */}
                <path 
                  d="M 100 110 A 130 85 0 0 0 100 170" 
                  fill="none" 
                  stroke={selectedZone === 'Premium' ? '#DC2626' : '#FF4B4B'} 
                  strokeWidth={selectedZone === 'Premium' ? '16' : '10'} 
                  strokeLinecap="round"
                  className="cursor-pointer transition-all duration-300 hover:stroke-red-600"
                  onClick={() => { setSelectedZone('Premium'); setSelectedSeats([]); }}
                />

                {/* Premium Zone Right arc */}
                <path 
                  d="M 400 110 A 130 85 0 0 1 400 170" 
                  fill="none" 
                  stroke={selectedZone === 'Premium' ? '#DC2626' : '#FF4B4B'} 
                  strokeWidth={selectedZone === 'Premium' ? '16' : '10'} 
                  strokeLinecap="round"
                  className="cursor-pointer transition-all duration-300 hover:stroke-red-600"
                  onClick={() => { setSelectedZone('Premium'); setSelectedSeats([]); }}
                />

                {/* Family Zone (Bottom arc) */}
                <path 
                  d="M 150 208 A 155 85 0 0 0 350 208" 
                  fill="none" 
                  stroke={selectedZone === 'Family' ? '#D97706' : '#E2C19D'} 
                  strokeWidth={selectedZone === 'Family' ? '16' : '10'} 
                  strokeLinecap="round"
                  className="cursor-pointer transition-all duration-300 hover:stroke-amber-600"
                  onClick={() => { setSelectedZone('Family'); setSelectedSeats([]); }}
                />

                {/* Center Soccer Grass Field Rectangle */}
                <rect 
                  x="160" 
                  y="95" 
                  width="180" 
                  height="90" 
                  rx="4" 
                  fill="#2E7D32" 
                  stroke="#FFFFFF" 
                  strokeWidth="2" 
                />
                
                {/* Center field line */}
                <line x1="250" y1="95" x2="250" y2="185" stroke="white" strokeWidth="2" />
                
                {/* Center soccer circle */}
                <circle cx="250" cy="140" r="22" fill="none" stroke="white" strokeWidth="2" />
                
                {/* Center spot */}
                <circle cx="250" cy="140" r="2" fill="white" />

                {/* Field markings goals */}
                <rect x="160" y="125" width="10" height="30" fill="none" stroke="white" strokeWidth="1.5" />
                <rect x="330" y="125" width="10" height="30" fill="none" stroke="white" strokeWidth="1.5" />
              </svg>
            </div>

            {/* Zone Picker Cards Grid (Exactly like Screenshot 2) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {ZONES.map((zone) => (
                <div 
                  key={zone.id}
                  onClick={() => { setSelectedZone(zone.id as any); setSelectedSeats([]); }}
                  className={`p-4 rounded-xl border bg-white dark:bg-slate-900 transition-all duration-200 cursor-pointer ${
                    selectedZone === zone.id 
                      ? 'border-[#E30613] ring-1 ring-[#E30613] shadow-md' 
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: zone.color }}
                    />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{zone.label}</span>
                  </div>
                  <p className="text-base font-extrabold text-slate-900 dark:text-white leading-none">
                    CHF {zone.price}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* STEP 2: SELECT SEATS CARD */}
          <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-900 pb-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
                2. SELECT SEATS
              </h3>
              
              {/* Legends matching Screenshot 2 */}
              <div className="flex items-center gap-4 text-xs font-semibold">
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#E2E8F0]" />
                  <span className="text-slate-500 uppercase text-[10px]">OPEN</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#E30613]" />
                  <span className="text-[#E30613] uppercase text-[10px]">SELECTED</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#475569]" />
                  <span className="text-slate-500 uppercase text-[10px]">TAKEN</span>
                </div>
              </div>
            </div>

            {/* Visual Pitch Line bar */}
            <div className="w-full text-center text-[10px] font-black uppercase tracking-widest text-slate-400 border-b-2 border-slate-100 dark:border-slate-800 pb-2">
              PITCH ↑
            </div>

            {/* Seat Grid Layout (Rows A to F, 15 columns) */}
            <div className="overflow-x-auto py-2">
              <div className="min-w-[480px] space-y-2.5">
                {['A', 'B', 'C', 'D', 'E', 'F'].map((rowLetter) => (
                  <div key={rowLetter} className="flex items-center gap-4">
                    {/* Row Letter on left */}
                    <span className="text-slate-400 font-extrabold text-xs w-6 text-center select-none">
                      {rowLetter}
                    </span>
                    
                    {/* Row Seat circles */}
                    <div className="flex items-center justify-between flex-1 gap-1">
                      {Array.from({ length: 15 }, (_, i) => i + 1).map((seatNum) => {
                        const seatId = `${rowLetter}-${seatNum}`;
                        const status = getSeatStatus(rowLetter, seatNum);
                        const isSelected = selectedSeats.includes(seatId);

                        let bgClass = 'bg-[#E2E8F0] dark:bg-slate-800 hover:scale-110 cursor-pointer';
                        if (status === 'Taken') {
                          bgClass = 'bg-[#475569] cursor-not-allowed opacity-80';
                        }
                        if (isSelected) {
                          bgClass = 'bg-[#E30613] scale-110';
                        }

                        return (
                          <div
                            key={seatNum}
                            onClick={() => handleSeatClick(rowLetter, seatNum)}
                            className={`w-6 h-6 rounded-full transition-transform duration-150 flex items-center justify-center ${bgClass}`}
                            title={`Row ${rowLetter} - Seat ${seatNum} (${status})`}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-2xs text-slate-400 font-semibold pt-2 text-center select-none">
              Pitch ↑ · Max 6 seats per booking
            </p>
          </div>

        </div>

        {/* RIGHT COLUMN: Your Order Box */}
        <div className="lg:col-span-4">
          <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-md sticky top-6 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
              YOUR ORDER
            </h3>

            {/* Selected Zone header details */}
            <div className="flex items-center gap-3">
              <span 
                className="w-5 h-5 rounded-full" 
                style={{ backgroundColor: activeZoneObj.color }}
              />
              <div>
                <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 leading-tight">
                  {activeZoneObj.label}
                </h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase">
                  CHF {activeZoneObj.price} per seat
                </p>
              </div>
            </div>

            {/* Selected seats list block */}
            {selectedSeats.length === 0 ? (
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center text-xs text-slate-400 select-none">
                No seats selected
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {selectedSeats.map((seatId) => {
                  const [r, s] = seatId.split('-');
                  return (
                    <div 
                      key={seatId} 
                      className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/40 p-2.5 rounded-xl border border-slate-150 dark:border-slate-850"
                    >
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Row {r} · Seat {s}
                      </span>
                      <button 
                        onClick={() => setSelectedSeats(prev => prev.filter(id => id !== seatId))}
                        className="text-slate-400 hover:text-red-500 text-xs font-bold p-1 select-none"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Total display matching Screenshot 2 */}
            <div className="border-t border-dashed border-slate-100 dark:border-slate-800/60 pt-4 flex items-end justify-between">
              <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase select-none">
                TOTAL
              </span>
              <p className="text-3xl font-black text-slate-900 dark:text-white leading-none">
                CHF {currentTotal}
              </p>
            </div>

            {/* Confirm booking button (matching pink-red style of Screenshot 2) */}
            <button
              onClick={handleConfirmOrder}
              disabled={selectedSeats.length === 0}
              className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white shadow-sm transition duration-200 cursor-pointer ${
                selectedSeats.length > 0
                  ? 'bg-[#FF8A8A] hover:bg-[#ff7575]'
                  : 'bg-rose-300 opacity-60 cursor-not-allowed'
              }`}
            >
              Confirm booking
            </button>
          </div>
        </div>

      </div>

      {/* CHECKOUT MODAL POP-UP */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-6 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Secure Checkout</h3>
              <button 
                onClick={() => setIsCheckoutOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <p className="font-semibold text-slate-800 dark:text-slate-100 uppercase text-[10px] tracking-wide">Booking Summary</p>
              <div className="flex justify-between">
                <span>Selected Zone:</span>
                <span className="font-bold text-slate-900 dark:text-white">{activeZoneObj.label}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Seats:</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedSeats.length} seats ({selectedSeats.join(', ')})</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 dark:border-slate-800 pt-2 mt-2 text-sm">
                <span className="font-bold">Total Cost:</span>
                <span className="font-bold text-[#E30613]">CHF {currentTotal}</span>
              </div>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Fan Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 py-2.5 pl-10 pr-3 text-xs rounded-xl focus:outline-none focus:border-[#E30613] text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +41 79 123 45 67"
                    className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 py-2.5 pl-10 pr-3 text-xs rounded-xl focus:outline-none focus:border-[#E30613] text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. john@example.com"
                    className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 py-2.5 pl-10 pr-3 text-xs rounded-xl focus:outline-none focus:border-[#E30613] text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#E30613] hover:bg-[#c40510] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition cursor-pointer mt-2"
              >
                Complete Payment & Book
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL (Swiss Arena themed) */}
      {showBookingSuccess && recentBookings && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl text-center space-y-6 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500 text-emerald-500">
              <CheckCircle className="w-8 h-8" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white font-sans">Booking Confirmed!</h3>
              <p className="text-xs text-slate-500">Your Swiss Arena match-day passes have been generated successfully.</p>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-850 rounded-2xl p-4 text-left font-mono text-xs space-y-2.5">
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="text-slate-400">Venue:</span>
                <span className="text-slate-800 dark:text-slate-100 font-extrabold">Swiss Arena, Zurich</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Section:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-black">{recentBookings.zoneLabel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Seats:</span>
                <span className="text-slate-800 dark:text-slate-100 font-extrabold">{recentBookings.seatCodes.join(', ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Ticket ID:</span>
                <span className="text-amber-500 font-bold">{recentBookings.ticketCode}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 dark:border-slate-800 pt-2">
                <span className="text-slate-400">Total Paid:</span>
                <span className="text-slate-900 dark:text-white font-black">CHF {recentBookings.totalCost}</span>
              </div>
            </div>

            <div className="text-[10px] text-slate-400">
              * A copy of this ticket was saved to your active session. Scan this ticket at the smart turnstiles upon entry!
            </div>

            <button
              onClick={() => setShowBookingSuccess(false)}
              className="w-full py-3 bg-slate-900 hover:bg-slate-850 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition shadow-md cursor-pointer"
            >
              Back to Ticket Center
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
