export interface SalonConfig {
  name: string;
  emoji: string;
  address: string;
  phone: string;
  averageCheck: number;
  adminSalary: number;
  palette: {
    primary: string;
    accent: string;
    background: string;
  };
}

export interface Master {
  id: string;
  name: string;
  specialty: string[];
  revenue: number;
  margin: number;
  load: number;
  appointmentsCount: number;
  avatar: string;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: number;
  cogs: number;
}

export type Channel =
  | "instagram"
  | "whatsapp"
  | "twogis"
  | "recommendations"
  | "yandex_maps"
  | "phone"
  | "telegram";

export interface DashboardStats {
  period: "today" | "week" | "month";
  revenue: number;
  appointmentsCount: number;
  averageCheck: number;
  newClients: number;
  returningClients: number;
  deltas: {
    revenue: number;
    appointmentsCount: number;
    averageCheck: number;
    newClients: number;
  };
  revenueByDay: { date: string; amount: number }[];
  sources: { channel: Channel; appointmentsCount: number; revenue: number }[];
}

export interface Insight {
  id: string;
  title: string;
  amountDelta: number;
  reasoning: string;
  actionLink?: string;
  actionLabel?: string;
  icon: "trending-up" | "users" | "mail";
}

export interface Conversation {
  id: string;
  clientName: string;
  clientAvatar: string;
  channel: "whatsapp" | "instagram" | "telegram";
  lastMessage: string;
  lastReply: string;
  time: string;
  status: "booked" | "in_progress" | "needs_human";
  messages: Message[];
}

export interface Message {
  from: "client" | "ai";
  text: string;
  time: string;
}

export interface LostClient {
  id: string;
  name: string;
  lastService: string;
  daysSinceLastVisit: number;
  averageCheck: number;
  recommendedMessage: string;
  segment: "30+" | "60+" | "90+";
}

export type ScenarioId = "booking" | "reschedule" | "reactivation" | "faq";

export interface ChatBubble {
  from: "bot" | "user";
  text: string;
  typingDelay?: number;
  quickReplies?: string[];
  confirmCard?: { title: string; details: string };
}

export interface ChatStep {
  trigger: string;
  responses: ChatBubble[];
}

export interface ClientScenario {
  id: ScenarioId;
  title: string;
  icon: string;
  initialMessages: ChatBubble[];
  steps: ChatStep[];
}

// --- New entities ---

export type ClientSegment = "vip" | "regular" | "new" | "sleeping" | "lost";

export interface Client {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  email?: string;
  birthday: string;
  firstVisit: string;
  lastVisit: string;
  totalVisits: number;
  totalSpent: number;
  averageCheck: number;
  ltv: number;
  segment: ClientSegment;
  favoriteMaster: string;
  favoriteMasterAvatar: string;
  preferredServices: string[];
  bonusBalance: number;
  depositBalance: number;
  notes?: string;
  blacklisted?: boolean;
  noShowCount: number;
  visitHistory: VisitHistory[];
}

export interface VisitHistory {
  date: string;
  service: string;
  master: string;
  amount: number;
  rating?: number;
}

export type AppointmentStatus = "confirmed" | "pending" | "completed" | "no_show" | "cancelled";
export type AppointmentSource = "online" | "admin" | "walk_in" | "whatsapp" | "instagram" | "telegram";

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  clientAvatar: string;
  masterId: string;
  masterName: string;
  serviceName: string;
  startHour: number; // 10-21
  startMinute: number; // 0/15/30/45
  duration: number; // minutes
  price: number;
  status: AppointmentStatus;
  source: AppointmentSource;
  isPrepaid?: boolean;
  note?: string;
}

export type LoyaltyKind = "bonus" | "deposit" | "certificate" | "subscription";

export interface LoyaltyProgram {
  id: string;
  kind: LoyaltyKind;
  name: string;
  description: string;
  rule: string;
  participants: number;
  totalIssued: number;
  redeemed: number;
  totalValueRub: number;
  active: boolean;
}

export interface Certificate {
  id: string;
  code: string;
  amount: number;
  buyerName: string;
  recipientName?: string;
  issuedAt: string;
  expiresAt: string;
  status: "active" | "redeemed" | "expired";
}

export interface Subscription {
  id: string;
  clientName: string;
  clientAvatar: string;
  packName: string;
  totalVisits: number;
  usedVisits: number;
  remainingDays: number;
  paidAmount: number;
}

export type MarketingTrigger =
  | "first_visit"
  | "birthday"
  | "after_visit"
  | "sleeping_30"
  | "sleeping_60"
  | "sleeping_90"
  | "anniversary"
  | "manual";

export type MarketingChannel = "whatsapp" | "telegram" | "sms" | "email";

export interface MarketingCampaign {
  id: string;
  name: string;
  trigger: MarketingTrigger;
  channel: MarketingChannel;
  audienceSize: number;
  sentCount: number;
  openRate: number;
  conversionRate: number;
  revenue: number;
  active: boolean;
  template: string;
  abTest?: {
    variantA: { name: string; openRate: number; conversion: number };
    variantB: { name: string; openRate: number; conversion: number };
    winner: "A" | "B" | null;
  };
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  unit: string;
  inStock: number;
  parLevel: number;
  costPerUnit: number;
  monthConsumption: number;
  expiryDate?: string;
  expiringSoon?: boolean;
  lowStock?: boolean;
  supplier?: string;
}

export interface PayrollRow {
  masterId: string;
  masterName: string;
  masterAvatar: string;
  appointments: number;
  revenue: number;
  ratePercent: number;
  bonus: number;
  payout: number;
}

export interface FinanceSnapshot {
  monthRevenue: number;
  monthCOGS: number;
  monthPayroll: number;
  monthRent: number;
  monthMarketing: number;
  monthOther: number;
  monthTaxes: number;
  monthProfit: number;
  marginPercent: number;
  forecastNextMonth: number;
  cashflowByDay: { date: string; income: number; expense: number }[];
  expensesBreakdown: { category: string; amount: number }[];
}

export interface Review {
  id: string;
  clientName: string;
  clientAvatar: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  service: string;
  master: string;
  date: string;
  channel: "yandex_maps" | "twogis" | "whatsapp" | "direct" | "google";
  status: "pending_review" | "published" | "needs_response" | "responded";
  aiSuggestedReply?: string;
}

export interface CohortRow {
  month: string;
  cohortSize: number;
  retention: number[]; // % per month index
}

export interface IntegrationItem {
  id: string;
  name: string;
  description: string;
  category: "messengers" | "crm" | "payments" | "marketing" | "analytics";
  connected: boolean;
  icon: string;
}

export class DataNotFoundError extends Error {
  constructor(entity: string, id: string) {
    super(`${entity} с id "${id}" не найден`);
    this.name = "DataNotFoundError";
  }
}
