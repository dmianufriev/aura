import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { getInventory } from "@/lib/data";
import type { InventoryItem } from "@/types";
import { formatCurrency, cn } from "@/lib/utils";
import { Search, Package, AlertTriangle, Clock, Plus, ShoppingCart, TrendingDown } from "lucide-react";
import { toast } from "sonner";

type Filter = "all" | "low" | "expiring";

export function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[] | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    getInventory().then(setItems);
  }, []);

  const filtered = useMemo(() => {
    if (!items) return null;
    return items.filter((it) => {
      if (filter === "low" && !it.lowStock) return false;
      if (filter === "expiring" && !it.expiringSoon) return false;
      if (search && !it.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [items, filter, search]);

  const stats = useMemo(() => {
    if (!items) return { total: 0, low: 0, expiring: 0, value: 0, monthCost: 0 };
    return {
      total: items.length,
      low: items.filter((i) => i.lowStock).length,
      expiring: items.filter((i) => i.expiringSoon).length,
      value: items.reduce((s, i) => s + i.inStock * i.costPerUnit, 0),
      monthCost: items.reduce((s, i) => s + i.monthConsumption * i.costPerUnit, 0),
    };
  }, [items]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading mb-1">Склад и расходники</h1>
          <p className="text-muted-foreground">
            Автосписание при оказании услуги. AI сам пишет в чат поставщику, когда подходит уровень par.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => toast.success("Заказ отправлен поставщику BeautyProf")}><ShoppingCart className="h-4 w-4" /> Заказать недостающее</Button>
          <Button onClick={() => toast.success("Позиция добавлена")}><Plus className="h-4 w-4" /> Добавить позицию</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card className="p-4"><div className="text-xs text-muted-foreground">Позиций</div><div className="text-2xl font-bold">{stats.total}</div></Card>
        <Card className="p-4 border-red-200 bg-red-50/30"><div className="text-xs text-muted-foreground">Низкий остаток</div><div className="text-2xl font-bold text-red-600">{stats.low}</div></Card>
        <Card className="p-4 border-amber-200 bg-amber-50/30"><div className="text-xs text-muted-foreground">Скоро истекут</div><div className="text-2xl font-bold text-amber-600">{stats.expiring}</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">Стоимость склада</div><div className="text-2xl font-bold">{formatCurrency(stats.value)}</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">Расход за месяц</div><div className="text-2xl font-bold">{formatCurrency(stats.monthCost)}</div></Card>
      </div>

      <Card className="p-4 flex items-center justify-between gap-3 bg-primary/5 border-primary/20">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-md bg-primary/15 text-primary flex items-center justify-center">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <div className="font-medium text-sm">Автосписание при оказании услуги</div>
            <div className="text-xs text-muted-foreground">При завершении визита расходники списываются по карте услуги</div>
          </div>
        </div>
        <Switch defaultChecked onCheckedChange={(v) => toast(v ? "Автосписание включено" : "Автосписание выключено")} />
      </Card>

      <Card className="p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Поиск..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
            <TabsList>
              <TabsTrigger value="all">Все</TabsTrigger>
              <TabsTrigger value="low">Низкий остаток</TabsTrigger>
              <TabsTrigger value="expiring">Истекают</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </Card>

      {!filtered ? (
        <Skeleton className="h-96" />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b border-border bg-muted/30">
                  <th className="px-4 py-3 font-medium">Позиция</th>
                  <th className="px-4 py-3 font-medium">Категория</th>
                  <th className="px-4 py-3 font-medium">Остаток</th>
                  <th className="px-4 py-3 font-medium text-right">Стоимость</th>
                  <th className="px-4 py-3 font-medium text-right">Расход / мес</th>
                  <th className="px-4 py-3 font-medium">Поставщик</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((it) => (
                  <tr key={it.id} className={cn("border-b border-border last:border-0", it.lowStock && "bg-red-50/40")}>
                    <td className="px-4 py-3">
                      <div className="font-medium flex items-center gap-2">
                        {it.name}
                        {it.expiringSoon && <Badge variant="warning"><Clock className="h-3 w-3 mr-0.5" /> Истекает</Badge>}
                      </div>
                      {it.expiryDate && <div className="text-xs text-muted-foreground">срок до {it.expiryDate}</div>}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{it.category}</td>
                    <td className="px-4 py-3 min-w-[180px]">
                      <div className="flex items-center gap-2">
                        <Progress value={Math.min(100, (it.inStock / (it.parLevel * 1.5)) * 100)} indicatorClassName={it.lowStock ? "bg-red-500" : ""} />
                        <span className={cn("text-sm tabular-nums", it.lowStock && "text-red-600 font-semibold")}>
                          {it.inStock} {it.unit}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">par: {it.parLevel} {it.unit}</div>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">{formatCurrency(it.inStock * it.costPerUnit)}</td>
                    <td className="px-4 py-3 text-right tabular-nums flex items-center justify-end gap-1">
                      <TrendingDown className="h-3 w-3 text-muted-foreground" />
                      {it.monthConsumption} {it.unit}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{it.supplier}</td>
                    <td className="px-4 py-3 text-right">
                      <Button size="sm" variant="outline" onClick={() => toast.success(`Заказано: ${it.name}`)}>Заказать</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Card className="p-5 bg-primary/5 border-primary/30">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/15 text-primary flex items-center justify-center shrink-0">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="font-semibold font-heading mb-1">AI-предложение</div>
            <p className="text-sm text-muted-foreground mb-3">
              По текущему расходу краска <strong>L'Oréal Majirel 6.0</strong> закончится через 6 дней. Рекомендую заказать 20 тюбиков у BeautyProf — это покроет 5 недель. Сумма: 19 600 ₽.
            </p>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => toast.success("Заказ оформлен · доставка завтра")}>Заказать 20 шт</Button>
              <Button size="sm" variant="outline" onClick={() => toast("Отложено")}>Напомнить позже</Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
