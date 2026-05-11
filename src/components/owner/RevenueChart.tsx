import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import type { DashboardStats } from "@/types";
import { formatCurrency } from "@/lib/utils";

export function RevenueChart({ stats }: { stats: DashboardStats | null }) {
  if (!stats) {
    return (
      <Card className="p-6">
        <Skeleton className="h-6 w-48 mb-4" />
        <Skeleton className="h-[320px] w-full" />
      </Card>
    );
  }

  const data = stats.revenueByDay.map((d) => ({
    date: new Date(d.date).toLocaleDateString("ru-RU", { day: "numeric", month: "short" }),
    amount: d.amount,
  }));

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold font-heading">Выручка за 30 дней</h2>
        <p className="text-sm text-muted-foreground">Динамика по дням</p>
      </div>
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8E1D3" />
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#6B6B6B" }} interval={4} />
            <YAxis
              tick={{ fontSize: 12, fill: "#6B6B6B" }}
              tickFormatter={(v) => `${Math.round(v / 1000)}к`}
            />
            <Tooltip
              formatter={(value) =>
                [formatCurrency(Number(value)), "Выручка"] as [string, string]
              }
              labelStyle={{ color: "#2A2A2A" }}
              contentStyle={{ borderRadius: 8, border: "1px solid #E8E1D3" }}
            />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="var(--color-primary)"
              strokeWidth={2}
              fill="url(#revGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
