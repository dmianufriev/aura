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
  price: number;
  duration: number;
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

export class DataNotFoundError extends Error {
  constructor(entity: string, id: string) {
    super(`${entity} с id "${id}" не найден`);
    this.name = "DataNotFoundError";
  }
}
