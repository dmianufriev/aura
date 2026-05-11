import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { LostClient } from "@/types";
import { formatCurrency } from "@/lib/utils";

export function LostClientsTable({ clients }: { clients: LostClient[] | null }) {
  if (!clients) {
    return (
      <Card className="p-6">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-12" />
          ))}
        </div>
      </Card>
    );
  }

  if (clients.length === 0) {
    return <Card className="p-10 text-center text-muted-foreground">Все клиенты активны — отличная работа!</Card>;
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted-foreground border-b border-border">
              <th className="px-4 py-3 font-medium w-10">
                <input type="checkbox" defaultChecked className="rounded" />
              </th>
              <th className="px-4 py-3 font-medium">Клиент</th>
              <th className="px-4 py-3 font-medium">Последняя услуга</th>
              <th className="px-4 py-3 font-medium text-right">Дней назад</th>
              <th className="px-4 py-3 font-medium text-right">Средний чек</th>
              <th className="px-4 py-3 font-medium">Сообщение для отправки</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3">
                  <input type="checkbox" defaultChecked className="rounded" />
                </td>
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.lastService}</td>
                <td className="px-4 py-3 text-right tabular-nums">{c.daysSinceLastVisit}</td>
                <td className="px-4 py-3 text-right tabular-nums">{formatCurrency(c.averageCheck)}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground max-w-[300px] truncate" title={c.recommendedMessage}>
                  {c.recommendedMessage}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
