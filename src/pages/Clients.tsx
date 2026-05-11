import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Avatar } from "@/components/ui/avatar";
import { getClients } from "@/lib/data";
import type { Client, ClientSegment } from "@/types";
import { formatCurrency, cn } from "@/lib/utils";
import { Search, Plus, Phone, MessageCircle, Star, Gift, AlertTriangle, Cake } from "lucide-react";
import { toast } from "sonner";

const segmentMeta: Record<ClientSegment, { label: string; variant: "default" | "success" | "warning" | "destructive" | "muted" }> = {
  vip: { label: "VIP", variant: "warning" },
  regular: { label: "Постоянный", variant: "success" },
  new: { label: "Новый", variant: "default" },
  sleeping: { label: "Спящий", variant: "muted" },
  lost: { label: "Потерян", variant: "destructive" },
};

export function ClientsPage() {
  const [clients, setClients] = useState<Client[] | null>(null);
  const [filter, setFilter] = useState<"all" | ClientSegment>("all");
  const [search, setSearch] = useState("");
  const [active, setActive] = useState<Client | null>(null);

  useEffect(() => {
    getClients().then(setClients);
  }, []);

  const filtered = useMemo(() => {
    if (!clients) return null;
    return clients.filter((c) => {
      if (filter !== "all" && c.segment !== filter) return false;
      if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.phone.includes(search)) return false;
      return true;
    });
  }, [clients, filter, search]);

  const counts = useMemo(() => {
    if (!clients) return { all: 0, vip: 0, regular: 0, new: 0, sleeping: 0, lost: 0 };
    return {
      all: clients.length,
      vip: clients.filter((c) => c.segment === "vip").length,
      regular: clients.filter((c) => c.segment === "regular").length,
      new: clients.filter((c) => c.segment === "new").length,
      sleeping: clients.filter((c) => c.segment === "sleeping").length,
      lost: clients.filter((c) => c.segment === "lost").length,
    };
  }, [clients]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading mb-1">Клиенты</h1>
          <p className="text-muted-foreground">
            База с LTV, сегментами, историей визитов и предпочтениями. AI сам помечает «спящих» и «VIP».
          </p>
        </div>
        <Button onClick={() => toast.success("Новый клиент добавлен")}><Plus className="h-4 w-4" /> Создать клиента</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {(["vip", "regular", "new", "sleeping", "lost"] as ClientSegment[]).map((seg) => (
          <Card key={seg} className="p-4">
            <div className="text-xs text-muted-foreground mb-1">{segmentMeta[seg].label}</div>
            <div className="text-2xl font-bold font-heading">{counts[seg]}</div>
          </Card>
        ))}
      </div>

      <Card className="p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Поиск по имени, телефону..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
            <TabsList>
              <TabsTrigger value="all">Все</TabsTrigger>
              <TabsTrigger value="vip">VIP</TabsTrigger>
              <TabsTrigger value="regular">Постоянные</TabsTrigger>
              <TabsTrigger value="sleeping">Спящие</TabsTrigger>
              <TabsTrigger value="lost">Потеряны</TabsTrigger>
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
                  <th className="px-4 py-3 font-medium">Клиент</th>
                  <th className="px-4 py-3 font-medium">Сегмент</th>
                  <th className="px-4 py-3 font-medium text-right">Визитов</th>
                  <th className="px-4 py-3 font-medium text-right">Средний чек</th>
                  <th className="px-4 py-3 font-medium text-right">LTV</th>
                  <th className="px-4 py-3 font-medium text-right">Бонусы</th>
                  <th className="px-4 py-3 font-medium">Любимый мастер</th>
                  <th className="px-4 py-3 font-medium">Последний визит</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 30).map((c) => (
                  <tr
                    key={c.id}
                    className={cn("border-b border-border last:border-0 hover:bg-muted/30 cursor-pointer", c.blacklisted && "bg-red-50/40")}
                    onClick={() => setActive(c)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar initials={c.avatar} />
                        <div className="min-w-0">
                          <div className="font-medium truncate flex items-center gap-1.5">
                            {c.name}
                            {c.blacklisted && <AlertTriangle className="h-3 w-3 text-red-500" />}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">{c.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><Badge variant={segmentMeta[c.segment].variant}>{segmentMeta[c.segment].label}</Badge></td>
                    <td className="px-4 py-3 text-right tabular-nums">{c.totalVisits}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{formatCurrency(c.averageCheck)}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-medium">{formatCurrency(c.ltv)}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{c.bonusBalance > 0 ? formatCurrency(c.bonusBalance) : "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{c.favoriteMaster.split(" ")[0]}</td>
                    <td className="px-4 py-3 text-muted-foreground">{c.lastVisit}</td>
                    <td className="px-4 py-3 text-right">
                      <Button size="sm" variant="ghost">Открыть →</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length > 30 && (
            <div className="p-4 text-center text-sm text-muted-foreground border-t border-border">
              Показано 30 из {filtered.length}. Используйте поиск, чтобы найти нужного клиента.
            </div>
          )}
        </Card>
      )}

      <Sheet open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <SheetContent className="sm:max-w-lg">
          {active && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  {active.name}
                  <Badge variant={segmentMeta[active.segment].variant}>{segmentMeta[active.segment].label}</Badge>
                </SheetTitle>
                <SheetDescription>{active.phone} · {active.email}</SheetDescription>
              </SheetHeader>
              <div className="overflow-y-auto -mx-6 px-6 mt-4 space-y-4 pb-6">
                <div className="flex items-start gap-3">
                  <Avatar initials={active.avatar} size="lg" />
                  <div className="flex-1 space-y-1 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Cake className="h-3.5 w-3.5" /> {active.birthday}
                    </div>
                    <div className="text-muted-foreground">Первый визит: {active.firstVisit}</div>
                    <div className="text-muted-foreground">Любимый мастер: {active.favoriteMaster}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Card className="p-3"><div className="text-xs text-muted-foreground">Визитов</div><div className="text-xl font-bold">{active.totalVisits}</div></Card>
                  <Card className="p-3"><div className="text-xs text-muted-foreground">Средний чек</div><div className="text-xl font-bold">{formatCurrency(active.averageCheck)}</div></Card>
                  <Card className="p-3"><div className="text-xs text-muted-foreground">LTV</div><div className="text-xl font-bold text-emerald-600">{formatCurrency(active.ltv)}</div></Card>
                  <Card className="p-3"><div className="text-xs text-muted-foreground">Бонусы / Депозит</div><div className="text-xl font-bold">{formatCurrency(active.bonusBalance)}</div><div className="text-xs text-muted-foreground">+ {formatCurrency(active.depositBalance)} депозит</div></Card>
                </div>

                {active.notes && (
                  <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
                    <strong>📌 Заметка администратора:</strong> {active.notes}
                  </div>
                )}

                <div>
                  <div className="text-sm font-semibold mb-2">Предпочитаемые услуги</div>
                  <div className="flex flex-wrap gap-2">
                    {active.preferredServices.map((s) => (
                      <Badge key={s} variant="outline">{s}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-semibold mb-2 flex items-center justify-between">
                    История визитов
                    <span className="text-xs text-muted-foreground font-normal">всего {active.totalVisits}</span>
                  </div>
                  <div className="space-y-2">
                    {active.visitHistory.map((v, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm border-b border-border pb-2 last:border-0">
                        <div className="text-xs text-muted-foreground w-20">{v.date}</div>
                        <div className="flex-1 min-w-0 truncate">{v.service}</div>
                        <div className="text-xs text-muted-foreground truncate">{v.master.split(" ")[0]}</div>
                        <div className="text-right font-medium tabular-nums w-20">{formatCurrency(v.amount)}</div>
                        {v.rating && (
                          <div className="flex items-center gap-0.5 text-amber-500">
                            <Star className="h-3 w-3 fill-current" />
                            {v.rating}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                  <Button onClick={() => toast.success("Запись создаётся…")}><Plus className="h-4 w-4" /> Записать</Button>
                  <Button variant="outline" onClick={() => toast("Открыто в WhatsApp")}><MessageCircle className="h-4 w-4" /> Написать</Button>
                  <Button variant="outline" onClick={() => toast("Звоним…")}><Phone className="h-4 w-4" /> Позвонить</Button>
                  <Button variant="outline" onClick={() => toast.success("Бонусы начислены")}><Gift className="h-4 w-4" /> Начислить бонусы</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
