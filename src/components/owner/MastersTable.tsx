import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Master } from "@/types";
import { formatCurrency, formatPercent, cn } from "@/lib/utils";

export function MastersTable({ masters }: { masters: Master[] | null }) {
  if (!masters) {
    return (
      <Card className="p-6">
        <Skeleton className="h-6 w-72 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14" />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="p-6 pb-4">
        <h2 className="text-xl font-bold font-heading">Мастера: кто реально приносит деньги</h2>
        <p className="text-sm text-muted-foreground">Маржа считается с учётом расходников и часов</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted-foreground border-y border-border">
              <th className="px-6 py-3 font-medium">Мастер</th>
              <th className="px-3 py-3 font-medium text-right">Записей</th>
              <th className="px-3 py-3 font-medium text-right">Выручка</th>
              <th className="px-3 py-3 font-medium">Маржа</th>
              <th className="px-3 py-3 font-medium text-right">Загрузка</th>
            </tr>
          </thead>
          <tbody>
            {masters.map((m) => {
              const low = m.margin < 0.3;
              const mid = m.margin >= 0.3 && m.margin < 0.5;
              const marginColor = low ? "bg-red-500" : mid ? "bg-amber-500" : "bg-emerald-500";
              const rowBg = low ? "bg-red-50/60" : "";
              return (
                <tr key={m.id} className={cn("border-b border-border last:border-0", rowBg)}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center text-primary font-semibold text-sm">
                        {m.avatar}
                      </div>
                      <div>
                        <div className="font-medium">{m.name}</div>
                        <div className="text-xs text-muted-foreground">{m.specialty.join(" · ")}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4 text-right tabular-nums">{m.appointmentsCount}</td>
                  <td className="px-3 py-4 text-right tabular-nums font-medium">{formatCurrency(m.revenue)}</td>
                  <td className="px-3 py-4 min-w-[160px]">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                        <div className={cn("h-full rounded-full", marginColor)} style={{ width: `${m.margin * 100}%` }} />
                      </div>
                      <span className={cn("text-sm tabular-nums w-10 text-right", low && "text-red-600 font-semibold")}>
                        {formatPercent(m.margin)}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-4 text-right tabular-nums">{formatPercent(m.load)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
