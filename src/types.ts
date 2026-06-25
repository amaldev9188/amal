export interface StadiumInfo {
  name: string;
  city: string;
  country: string;
  capacity: number;
  builtYear: number;
  address: string;
  description: string;
}

export interface MatchEvent {
  id: string;
  title: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  status: 'upcoming' | 'live' | 'completed';
  score?: { home: number; away: number };
  attendance?: number;
  crowdDensity?: number;
  foodDemand?: 'Low' | 'Moderate' | 'High' | 'Extreme';
  weather?: string;
  parkingStatus?: 'Normal' | 'Busy' | 'Full';
}

export interface Seat {
  id: string;
  section: 'North' | 'South' | 'East' | 'West' | 'VIP' | 'Accessible';
  row: number;
  number: number;
  status: 'Available' | 'Reserved' | 'Booked' | 'Blocked';
  price: number;
  rating: number; // View rating out of 5
  bestView?: boolean;
  familyRecommended?: boolean;
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Burgers' | 'Pizza' | 'Drinks' | 'Desserts' | 'Vegetarian' | 'Kids';
  image: string;
  isAvailable: boolean;
  prepTime: number; // in minutes
  inventory: number;
}

export interface CartItem {
  foodItem: FoodItem;
  quantity: number;
}

export type OrderStatus = 'Received' | 'Preparing' | 'Cooking' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

export interface FoodOrder {
  id: string;
  customerName: string;
  phone: string;
  ticketId: string;
  section: string;
  row: number;
  seatNumber: number;
  status: OrderStatus;
  items: { foodId: string; name: string; quantity: number; price: number }[];
  totalPrice: number;
  createdAt: string;
  estimatedDelivery?: number; // in minutes remaining
}

export interface ParkingArea {
  id: string;
  name: string;
  capacity: number;
  availableSpots: number;
  occupiedSpots: number;
  reservedSpots: number;
}

export type EmergencyType = 'Medical' | 'Security' | 'Lost Child' | 'Lost Item' | 'Suspicious Activity';
export type EmergencyPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type EmergencyStatus = 'Pending' | 'Staff Dispatched' | 'Resolved' | 'Cancelled';

export interface EmergencyTicket {
  id: string;
  type: EmergencyType;
  description: string;
  section: string;
  row: number;
  seat: number;
  priority: EmergencyPriority;
  assignedStaff: string;
  status: EmergencyStatus;
  createdAt: string;
}

export interface FeedbackItem {
  id: string;
  name: string;
  message: string;
  rating: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  aiSummary?: string;
  createdAt: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: 'Food Delivery' | 'Security' | 'Medical First-Aid' | 'Parking Coordinator' | 'Operations Guard';
  status: 'Active' | 'On Break' | 'Dispatched';
  task?: string;
}

export interface CoAdmin {
  id: string;
  name: string;
  email: string;
  permissions: {
    dashboard: boolean;
    bookings: boolean;
    seats: boolean;
    food: boolean;
    orders: boolean;
    emergencies: boolean;
    analytics: boolean;
  };
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'alert' | 'success';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  activeAgent?: string;
  agentName?: string;
  suggestedActions?: string[];
  data?: any;
}
