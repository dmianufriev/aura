import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Users, Mail, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { Insight } from "@/types";
import { formatCurrency } from "@/lib/utils";

const ICONS = { "trending-up": TrendingUp, users: Users, mail: Mail };

export function InsightsList({ insights }: { insights: Insight[] | null }) {
  if (!insights) {
    return (
      <div>
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-44" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-bold font-heading">3 действия от AI</h2>
        <p className="text-sm text-muted-foreground">Готовые решения с суммой в рублях</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {insights.map((ins) => {
          const Icon = ICONS[ins.icon] ?? TrendingUp;
          return (
            <Card key={ins.id} className="p-5 flex flex-col">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                <Icon className="h-6 w-6" />
              </div>
              <div className="text-base font-semibold mb-2 font-heading">{ins.title}</div>
              <div className="text-2xl font-bold text-emerald-600 mb-2">
                {formatCurrency(ins.amountDelta, true)} / мес
              </div>
              <p className="text-sm text-muted-foreground flex-1">{ins.reasoning}</p>
              {ins.actionLink && (
                <Button asChild className="mt-4 w-full" size="sm">
                  <Link to={ins.actionLink}>
                    {ins.actionLabel ?? "Перейти"}
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
