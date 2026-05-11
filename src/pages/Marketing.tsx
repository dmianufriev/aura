import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { getCampaigns } from "@/lib/data";
import type { MarketingCampaign } from "@/types";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { Megaphone, MessageCircle, Send, Mail, Smartphone, Plus, Zap, TrendingUp } from "lucide-react";
import { toast } from "sonner";

const channelMeta = {
  whatsapp: { icon: MessageCircle, label: "WhatsApp", color: "text-emerald-600" },
  telegram: { icon: Send, label: "Telegram", color: "text-sky-600" },
  sms: { icon: Smartphone, label: "SMS", color: "text-violet-600" },
  email: { icon: Mail, label: "Email", color: "text-amber-600" },
};

const triggerLabels: Record<MarketingCampaign["trigger"], string> = {
  first_visit: "После первого визита",
  birthday: "День рождения",
  after_visit: "После любого визита",
  sleeping_30: "30 дней без визита",
  sleeping_60: "60 дней без визита",
  sleeping_90: "90 дней без визита",
  anniversary: "Годовщина первого визита",
  manual: "Ручная отправка",
};

export function MarketingPage() {
  const [campaigns, setCampaigns] = useState<MarketingCampaign[] | null>(null);
  const [active, setActive] = useState<MarketingCampaign | null>(null);

  useEffect(() => {
    getCampaigns().then(setCampaigns);
  }, []);

  const totalRevenue = campaigns?.reduce((s, c) => s + c.revenue, 0) ?? 0;
  const totalSent = campaigns?.reduce((s, c) => s + c.sentCount, 0) ?? 0;
  const avgConv = campaigns && campaigns.length > 0 ? campaigns.reduce((s, c) => s + c.conversionRate, 0) / campaigns.length : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold font-heading mb-1">Маркетинговые кампании</h1>
          <p className="text-muted-foreground">
            Автоматические триггерные сообщения. AI отслеживает события и сам отправляет нужное в нужный момент.
          </p>
        </div>
        <Button onClick={() => toast.success("Открыт конструктор новой кампании")}><Plus className="h-4 w-4" /> Новая кампания</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="p-4">
          <div className="text-xs text-muted-foreground mb-1">Отправлено за месяц</div>
          <div className="text-3xl font-bold font-heading">{totalSent.toLocaleString("ru-RU")}</div>
          <div className="text-xs text-emerald-600 mt-1">+18,4% к прошлому</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground mb-1">Средняя конверсия</div>
          <div className="text-3xl font-bold font-heading">{formatPercent(avgConv)}</div>
          <div className="text-xs text-muted-foreground mt-1">по индустрии: 12-18%</div>
        </Card>
        <Card className="p-4 bg-primary/5 border-primary/30">
          <div className="text-xs text-muted-foreground mb-1">Принесли выручки</div>
          <div className="text-3xl font-bold font-heading text-primary">{formatCurrency(totalRevenue)}</div>
          <div className="text-xs text-emerald-600 mt-1 flex items-center gap-1"><TrendingUp className="h-3 w-3" /> +{formatCurrency(Math.round(totalRevenue * 0.22))} к прошлому</div>
        </Card>
      </div>

      {!campaigns ? (
        <div className="space-y-3"><Skeleton className="h-28" /><Skeleton className="h-28" /><Skeleton className="h-28" /></div>
      ) : (
        <div className="space-y-3">
          {campaigns.map((c) => {
            const ch = channelMeta[c.channel];
            const ChIcon = ch.icon;
            return (
              <Card key={c.id} className="p-5 hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="h-11 w-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Megaphone className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-semibold font-heading">{c.name}</span>
                        {c.abTest && <Badge variant="warning"><Zap className="h-3 w-3 mr-0.5" /> A/B</Badge>}
                      </div>
                      <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1"><ChIcon className={`h-3 w-3 ${ch.color}`} /> {ch.label}</span>
                        <span>·</span>
                        <span>{triggerLabels[c.trigger]}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 lg:grid-cols-4 gap-3 lg:gap-6 text-sm">
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">Аудитория</div>
                      <div className="font-semibold tabular-nums">{c.audienceSize}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">Open</div>
                      <div className="font-semibold tabular-nums">{formatPercent(c.openRate)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">Конверсия</div>
                      <div className="font-semibold tabular-nums text-emerald-600">{formatPercent(c.conversionRate)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">Выручка</div>
                      <div className="font-semibold tabular-nums">{formatCurrency(c.revenue)}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch defaultChecked={c.active} onCheckedChange={(v) => toast(v ? "Кампания включена" : "Кампания на паузе")} />
                    <Button size="sm" variant="outline" onClick={() => setActive(c)}>Открыть</Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-xl">
          {active && (
            <>
              <DialogHeader>
                <DialogTitle>{active.name}</DialogTitle>
                <DialogDescription>{triggerLabels[active.trigger]} · {channelMeta[active.channel].label}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <div className="text-xs font-medium mb-2 text-muted-foreground">Текст сообщения</div>
                  <div className="rounded-lg bg-muted/40 p-4 text-sm whitespace-pre-wrap">{active.template}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Переменные: <code className="bg-muted px-1 rounded">{`{имя}`}</code>, <code className="bg-muted px-1 rounded">{`{мастер}`}</code>, <code className="bg-muted px-1 rounded">{`{услуга}`}</code>
                  </div>
                </div>

                {active.abTest && (
                  <div>
                    <div className="text-xs font-medium mb-2 text-muted-foreground flex items-center gap-1"><Zap className="h-3 w-3" /> A/B-тест</div>
                    <div className="grid grid-cols-2 gap-3">
                      {(["variantA", "variantB"] as const).map((key) => {
                        const v = active.abTest![key];
                        const isWinner = active.abTest!.winner === (key === "variantA" ? "A" : "B");
                        return (
                          <div key={key} className={`rounded-lg p-3 border ${isWinner ? "border-emerald-500 bg-emerald-50" : "border-border"}`}>
                            <div className="text-xs font-medium mb-1 flex items-center justify-between">
                              {key === "variantA" ? "Вариант A" : "Вариант B"} — {v.name}
                              {isWinner && <Badge variant="success">Победитель</Badge>}
                            </div>
                            <div className="text-xs space-y-0.5">
                              <div>Open: <span className="font-semibold">{formatPercent(v.openRate)}</span></div>
                              <div>Конверсия: <span className="font-semibold">{formatPercent(v.conversion)}</span></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-3 text-center">
                  <Card className="p-3"><div className="text-xs text-muted-foreground">Отправлено</div><div className="text-xl font-bold">{active.sentCount}</div></Card>
                  <Card className="p-3"><div className="text-xs text-muted-foreground">Конверсия</div><div className="text-xl font-bold text-emerald-600">{formatPercent(active.conversionRate)}</div></Card>
                  <Card className="p-3"><div className="text-xs text-muted-foreground">Выручка</div><div className="text-xl font-bold">{formatCurrency(active.revenue)}</div></Card>
                </div>
              </div>
              <DialogFooter className="gap-2">
                <DialogClose asChild><Button variant="outline">Закрыть</Button></DialogClose>
                <Button variant="outline" onClick={() => toast.success("Текст обновлён")}>Редактировать</Button>
                <Button onClick={() => { toast.success("Тестовое сообщение отправлено вам"); }}>Тестовая отправка</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
