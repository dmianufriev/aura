import dashboardJson from "@/data/dashboard.json";
import mastersJson from "@/data/masters.json";
import insightsJson from "@/data/insights.json";
import conversationsJson from "@/data/conversations.json";
import lostClientsJson from "@/data/lost_clients.json";
import scenariosJson from "@/data/client_scenarios.json";
import {
  DataNotFoundError,
  type ClientScenario,
  type Conversation,
  type DashboardStats,
  type Insight,
  type LostClient,
  type Master,
  type ScenarioId,
} from "@/types";
import { sleep } from "@/lib/utils";

function delay() {
  return 200 + Math.floor(Math.random() * 200);
}

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
