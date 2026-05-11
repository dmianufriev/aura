import { useEffect, useState } from "react";
import { KpiCards } from "@/components/owner/KpiCards";
import { RevenueChart } from "@/components/owner/RevenueChart";
import { MastersTable } from "@/components/owner/MastersTable";
import { InsightsList } from "@/components/owner/InsightsList";
import { getDashboardStats, getMasters, getInsights } from "@/lib/data";
import type { DashboardStats, Master, Insight } from "@/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { salonConfig } from "@/config/salon.config";
import { formatCurrency } from "@/lib/utils";

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [masters, setMasters] = useState<Master[] | null>(null);
  const [insights, setInsights] = useState<Insight[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getDashboardStats(), getMasters(), getInsights()])
      .then(([s, m, i]) => {
        setStats(s);
        setMasters(m);
        setInsights(i);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Не удалось загрузить данные"));
  }, []);

  if (error) {
    return (
      <Alert variant="destructive" className="my-8">
        <AlertTitle>Ошибка загрузки</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold font-heading mb-2">Привет, {salonConfig.name} 👋</h1>
        <p className="text-muted-foreground">
          AI заменил администратора ({formatCurrency(salonConfig.adminSalary)}/мес) и работает 24/7. Вот что у вас сейчас в салоне.
        </p>
      </div>

      <KpiCards stats={stats} />
      <RevenueChart stats={stats} />
      <MastersTable masters={masters} />
      <InsightsList insights={insights} />
    </div>
  );
}
