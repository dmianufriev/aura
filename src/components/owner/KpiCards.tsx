import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Wallet, Calendar, Receipt, UserPlus } from "lucide-react";
import type { DashboardStats } from "@/types";
import { formatCurrency, formatDelta, cn } from "@/lib/utils";

interface Props {
  stats: DashboardStats | null;
}

export function KpiCards({ stats }: Props) {
  if (!stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  const items = [
    { icon: Wallet, label: "Выручка месяц", value: formatCurrency(stats.revenue), delta: stats.deltas.revenue },
    { icon: Calendar, label: "Записей", value: stats.appointmentsCount.toLocaleString("ru-RU"), delta: stats.deltas.appointmentsCount },
    { icon: Receipt, label: "Средний чек", value: formatCurrency(stats.averageCheck), delta: stats.deltas.averageCheck },
    { icon: UserPlus, label: "Новых клиентов", value: stats.newClients.toString(), delta: stats.deltas.newClients },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((it) => (
        <Card key={it.label} className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-md bg-primary/10 flex items-center justify-center text-primary">
              <it.icon className="h-5 w-5" />
            </div>
            <div className="text-sm text-muted-foreground">{it.label}</div>
          </div>
          <div className="text-3xl font-bold font-heading mb-1">{it.value}</div>
          <div className={cn("text-sm font-medium", it.delta >= 0 ? "text-emerald-600" : "text-red-600")}>
            {formatDelta(it.delta)} к прошлому месяцу
          </div>
        </Card>
      ))}
    </div>
  );
}
