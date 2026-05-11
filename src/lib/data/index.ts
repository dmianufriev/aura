import dashboardJson from "@/data/dashboard.json";
import mastersJson from "@/data/masters.json";
import insightsJson from "@/data/insights.json";
import conversationsJson from "@/data/conversations.json";
import lostClientsJson from "@/data/lost_clients.json";
import scenariosJson from "@/data/client_scenarios.json";
import clientsJson from "@/data/clients.json";
import appointmentsJson from "@/data/appointments.json";
import servicesJson from "@/data/services.json";
import loyaltyJson from "@/data/loyalty.json";
import certificatesJson from "@/data/certificates.json";
import subscriptionsJson from "@/data/subscriptions.json";
import campaignsJson from "@/data/campaigns.json";
import inventoryJson from "@/data/inventory.json";
import payrollJson from "@/data/payroll.json";
import financeJson from "@/data/finance.json";
import cohortsJson from "@/data/cohorts.json";
import reviewsJson from "@/data/reviews.json";
import integrationsJson from "@/data/integrations.json";
import {
  DataNotFoundError,
  type Appointment,
  type Certificate,
  type Client,
  type ClientScenario,
  type CohortRow,
  type Conversation,
  type DashboardStats,
  type FinanceSnapshot,
  type Insight,
  type IntegrationItem,
  type InventoryItem,
  type LoyaltyProgram,
  type LostClient,
  type MarketingCampaign,
  type Master,
  type PayrollRow,
  type Review,
  type ScenarioId,
  type Service,
  type Subscription,
} from "@/types";
import { sleep } from "@/lib/utils";

const delay = () => 180 + Math.floor(Math.random() * 180);

export async function getDashboardStats(): Promise<DashboardStats> {
  await sleep(delay());
  return dashboardJson as DashboardStats;
}
export async function getMasters(): Promise<Master[]> {
  await sleep(delay());
  return mastersJson as Master[];
}
export async function getInsights(): Promise<Insight[]> {
  await sleep(delay());
  return insightsJson as Insight[];
}
export async function getConversations(): Promise<Conversation[]> {
  await sleep(delay());
  return conversationsJson as Conversation[];
}
export async function getConversationById(id: string): Promise<Conversation> {
  await sleep(delay());
  const found = (conversationsJson as Conversation[]).find((c) => c.id === id);
  if (!found) throw new DataNotFoundError("Conversation", id);
  return found;
}
export async function getLostClients(segment?: "30+" | "60+" | "90+"): Promise<LostClient[]> {
  await sleep(delay());
  const all = lostClientsJson as LostClient[];
  return segment ? all.filter((c) => c.segment === segment) : all;
}
export async function getScenarios(): Promise<ClientScenario[]> {
  await sleep(delay());
  return scenariosJson as ClientScenario[];
}
export async function getScenarioById(id: ScenarioId): Promise<ClientScenario> {
  await sleep(delay());
  const found = (scenariosJson as ClientScenario[]).find((s) => s.id === id);
  if (!found) throw new DataNotFoundError("Scenario", id);
  return found;
}
export async function getClients(): Promise<Client[]> {
  await sleep(delay());
  return clientsJson as Client[];
}
export async function getAppointments(): Promise<Appointment[]> {
  await sleep(delay());
  return appointmentsJson as Appointment[];
}
export async function getServices(): Promise<Service[]> {
  await sleep(delay());
  return servicesJson as Service[];
}
export async function getLoyalty(): Promise<LoyaltyProgram[]> {
  await sleep(delay());
  return loyaltyJson as LoyaltyProgram[];
}
export async function getCertificates(): Promise<Certificate[]> {
  await sleep(delay());
  return certificatesJson as Certificate[];
}
export async function getSubscriptions(): Promise<Subscription[]> {
  await sleep(delay());
  return subscriptionsJson as Subscription[];
}
export async function getCampaigns(): Promise<MarketingCampaign[]> {
  await sleep(delay());
  return campaignsJson as MarketingCampaign[];
}
export async function getInventory(): Promise<InventoryItem[]> {
  await sleep(delay());
  return inventoryJson as InventoryItem[];
}
export async function getPayroll(): Promise<PayrollRow[]> {
  await sleep(delay());
  return payrollJson as PayrollRow[];
}
export async function getFinance(): Promise<FinanceSnapshot> {
  await sleep(delay());
  return financeJson as FinanceSnapshot;
}
export async function getCohorts(): Promise<CohortRow[]> {
  await sleep(delay());
  return cohortsJson as CohortRow[];
}
export async function getReviews(): Promise<Review[]> {
  await sleep(delay());
  return reviewsJson as Review[];
}
export async function getIntegrations(): Promise<IntegrationItem[]> {
  await sleep(delay());
  return integrationsJson as IntegrationItem[];
}
