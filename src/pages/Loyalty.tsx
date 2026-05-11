import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { getLoyalty, getCertificates, getSubscriptions } from "@/lib/data";
import type { LoyaltyProgram, Certificate, Subscription } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Gift, Wallet, Award, RefreshCw, Plus } from "lucide-react";
import { toast } from "sonner";

const kindIcons = {
  bonus: Gift,
  deposit: Wallet,
  certificate: Award,
  subscription: RefreshCw,
};

export function LoyaltyPage() {
  const [programs, setPrograms] = useState<LoyaltyProgram[] | null>(null);
  const [certs, setCerts] = useState<Certificate[] | null>(null);
  const [subs, setSubs] = useState<Subscription[] | null>(null);

  useEffect(() => {
    Promise.all([getLoyalty(), getCertificates(), getSubscriptions()]).then(([p, c, s]) => {
      setPrograms(p);
      setCerts(c);
      setSubs(s);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading mb-1">Программы лояльности</h1>
          <p className="text-muted-foreground">
            Бонусы, депозиты, подарочные сертификаты, абонементы. AI стимулирует возврат и повышает средний чек.
          </p>
        </div>
        <Button onClick={() => toast.success("Открыт мастер создания программы")}><Plus className="h-4 w-4" /> Создать программу</Button>
      </div>

      {!programs ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-44" /><Skeleton className="h-44" />
          <Skeleton className="h-44" /><Skeleton className="h-44" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {programs.map((p) => {
            const Icon = kindIcons[p.kind];
            return (
              <Card key={p.id} className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold font-heading">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.rule}</div>
                    </div>
                  </div>
                  <Switch defaultChecked={p.active} onCheckedChange={(v) => toast(v ? `${p.name} включена` : `${p.name} выключена`)} />
                </div>
                <p className="text-sm text-muted-foreground mb-4">{p.description}</p>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className="text-xs text-muted-foreground">Участников</div>
                    <div className="text-lg font-bold">{p.participants || "—"}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Выдано</div>
                    <div className="text-lg font-bold">{formatCurrency(p.totalIssued)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Использовано</div>
                    <div className="text-lg font-bold text-emerald-600">{formatCurrency(p.redeemed)}</div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Tabs defaultValue="certificates" className="mt-6">
        <TabsList>
          <TabsTrigger value="certificates">Сертификаты</TabsTrigger>
          <TabsTrigger value="subscriptions">Абонементы</TabsTrigger>
        </TabsList>
        <TabsContent value="certificates" className="space-y-3">
          {!certs ? (
            <Skeleton className="h-60" />
          ) : (
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-muted-foreground border-b border-border bg-muted/30">
                      <th className="px-4 py-3 font-medium">Код</th>
                      <th className="px-4 py-3 font-medium">Номинал</th>
                      <th className="px-4 py-3 font-medium">Купил</th>
                      <th className="px-4 py-3 font-medium">Получатель</th>
                      <th className="px-4 py-3 font-medium">Выдан</th>
                      <th className="px-4 py-3 font-medium">Действует до</th>
                      <th className="px-4 py-3 font-medium">Статус</th>
                    </tr>
                  </thead>
                  <tbody>
                    {certs.map((c) => (
                      <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                        <td className="px-4 py-3 font-mono text-xs">{c.code}</td>
                        <td className="px-4 py-3 font-semibold">{formatCurrency(c.amount)}</td>
                        <td className="px-4 py-3">{c.buyerName}</td>
                        <td className="px-4 py-3 text-muted-foreground">{c.recipientName ?? "Себе"}</td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">{c.issuedAt}</td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">{c.expiresAt}</td>
                        <td className="px-4 py-3">
                          <Badge variant={c.status === "active" ? "success" : c.status === "expired" ? "destructive" : "muted"}>
                            {c.status === "active" ? "Активен" : c.status === "expired" ? "Истёк" : "Использован"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-3 border-t border-border bg-muted/20 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Всего сертификатов: {certs.length}</span>
                <Button size="sm" onClick={() => toast.success("Сертификат создан · ссылка отправлена покупателю")}><Plus className="h-3.5 w-3.5" /> Выдать сертификат</Button>
              </div>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="subscriptions" className="space-y-3">
          {!subs ? (
            <Skeleton className="h-60" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subs.map((s) => (
                <Card key={s.id} className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar initials={s.clientAvatar} />
                    <div className="min-w-0">
                      <div className="font-medium truncate">{s.clientName}</div>
                      <div className="text-xs text-muted-foreground truncate">{s.packName}</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Использовано</span>
                      <span className="font-medium">{s.usedVisits} из {s.totalVisits}</span>
                    </div>
                    <Progress value={(s.usedVisits / s.totalVisits) * 100} />
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Осталось</span>
                      <span className={s.remainingDays < 30 ? "text-amber-600 font-medium" : ""}>{s.remainingDays} дн</span>
                    </div>
                    <div className="text-sm font-semibold">{formatCurrency(s.paidAmount)}</div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
