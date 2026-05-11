import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getCohorts, getDashboardStats, getClients } from "@/lib/data";
import type { CohortRow, Client, DashboardStats } from "@/types";
import { formatCurrency, cn } from "@/lib/utils";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { TrendingUp, Users, Layers, Target } from "lucide-react";

const channelNames: Record<string, string> = {
  phone: "Телефон",
  instagram: "Instagram",
  whatsapp: "WhatsApp",
  recommendations: "Рекомендации",
  twogis: "2ГИС",
  yandex_maps: "Яндекс.Карты",
};

function getCohortColor(retention: number) {
  if (retention >= 80) return "bg-emerald-500/85 text-white";
  if (retention >= 60) return "bg-emerald-400/75 text-white";
  if (retention >= 40) return "bg-amber-300/85";
  if (retention >= 20) return "bg-amber-400/85";
  if (retention > 0) return "bg-red-300/80";
  return "bg-muted text-muted-foreground";
}

export function AnalyticsPage() {
  const [cohorts, setCohorts] = useState<CohortRow[] | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [clients, setClients] = useState<Client[] | null>(null);

  useEffect(() => {
    Promise.all([getCohorts(), getDashboardStats(), getClients()]).then(([c, s, cl]) => {
      setCohorts(c);
      setStats(s);
      setClients(cl);
    });
  }, []);

  if (!cohorts || !stats || !clients) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)}</div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  // LTV распределение
  const ltvBuckets = [
    { range: "0-10к", count: clients.filter((c) => c.ltv <= 10000).length, value: 5000 },
    { range: "10-30к", count: clients.filter((c) => c.ltv > 10000 && c.ltv <= 30000).length, value: 20000 },
    { range: "30-60к", count: clients.filter((c) => c.ltv > 30000 && c.ltv <= 60000).length, value: 45000 },
    { range: "60-100к", count: clients.filter((c) => c.ltv > 60000 && c.ltv <= 100000).length, value: 80000 },
    { range: "100к+", count: clients.filter((c) => c.ltv > 100000).length, value: 150000 },
  ];

  const sourcesData = stats.sources.map((s) => ({
    name: channelNames[s.channel] ?? s.channel,
    "Выручка": s.revenue,
    "Записей": s.appointmentsCount,
  }));

  // ABC по клиентам — сортируем по LTV
  const sorted = [...clients].sort((a, b) => b.ltv - a.ltv);
  const totalLTV = sorted.reduce((s, c) => s + c.ltv, 0);
  let acc = 0;
  const abc = sorted.map((c) => {
    acc += c.ltv;
    const share = acc / totalLTV;
    const cls: "A" | "B" | "C" = share <= 0.8 ? "A" : share <= 0.95 ? "B" : "C";
    return { ...c, share, cls };
  });
  const counts = { A: abc.filter((c) => c.cls === "A").length, B: abc.filter((c) => c.cls === "B").length, C: abc.filter((c) => c.cls === "C").length };

  const radar = [
    { metric: "Удержание (M+1)", value: 65 },
    { metric: "Возврат VIP", value: 92 },
    { metric: "Конверсия записи", value: 78 },
    { metric: "Завершение визита", value: 96 },
    { metric: "Загрузка слотов", value: 76 },
    { metric: "Активная база", value: 81 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-heading mb-1">Аналитика</h1>
        <p className="text-muted-foreground">Cohort retention, LTV, ABC-сегментация, источники и health-score салона.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-4">
          <div className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1"><Users className="h-3.5 w-3.5" /> Активная база</div>
          <div className="text-2xl font-bold">{clients.length}</div>
          <div className="text-xs text-emerald-600 mt-0.5">+12 за месяц</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1"><Target className="h-3.5 w-3.5" /> Retention M+3</div>
          <div className="text-2xl font-bold">42%</div>
          <div className="text-xs text-muted-foreground mt-0.5">средн. по индустрии: 28%</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1"><TrendingUp className="h-3.5 w-3.5" /> Средний LTV</div>
          <div className="text-2xl font-bold">{formatCurrency(Math.round(totalLTV / clients.length))}</div>
          <div className="text-xs text-muted-foreground mt-0.5">VIP-клиент: {formatCurrency(Math.round(abc.filter((c) => c.cls === "A").reduce((s, c) => s + c.ltv, 0) / Math.max(1, counts.A)))}</div>
        </Card>
        <Card className="p-4 bg-primary/5 border-primary/30">
          <div className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1"><Layers className="h-3.5 w-3.5" /> Health Score</div>
          <div className="text-2xl font-bold text-primary">81 / 100</div>
          <div className="text-xs text-primary mt-0.5">Зелёная зона</div>
        </Card>
      </div>

      <Tabs defaultValue="cohort">
        <TabsList>
          <TabsTrigger value="cohort">Cohort retention</TabsTrigger>
          <TabsTrigger value="ltv">LTV</TabsTrigger>
          <TabsTrigger value="abc">ABC-сегментация</TabsTrigger>
          <TabsTrigger value="sources">Источники</TabsTrigger>
          <TabsTrigger value="health">Health</TabsTrigger>
        </TabsList>

        <TabsContent value="cohort">
          <Card className="p-5">
            <div className="mb-4">
              <h2 className="text-lg font-bold font-heading">Retention по когортам</h2>
              <p className="text-xs text-muted-foreground">% клиентов, вернувшихся через N месяцев после первого визита</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr>
                    <th className="text-left py-2 pr-3 font-medium text-muted-foreground">Когорта</th>
                    <th className="text-right py-2 pr-3 font-medium text-muted-foreground">Размер</th>
                    {Array.from({ length: 8 }).map((_, i) => (
                      <th key={i} className="text-center py-2 px-1 font-medium text-muted-foreground">M+{i}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cohorts.map((c) => (
                    <tr key={c.month}>
                      <td className="py-1.5 pr-3 font-medium">{c.month}</td>
                      <td className="py-1.5 pr-3 text-right tabular-nums text-muted-foreground">{c.cohortSize}</td>
                      {c.retention.map((r, i) => (
                        <td key={i} className="py-1.5 px-0.5">
                          <div className={cn("rounded h-9 flex items-center justify-center text-xs font-medium tabular-nums", getCohortColor(r))}>
                            {r}%
                          </div>
                        </td>
                      ))}
                      {Array.from({ length: 8 - c.retention.length }).map((_, i) => (
                        <td key={`empty-${i}`} className="py-1.5 px-0.5"><div className="h-9 bg-muted/20 rounded" /></td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-xs text-muted-foreground mt-3">
              💡 В среднем 35% клиентов теряются после первого визита. Welcome-серия и приветственная скидка дают +12 п.п. на M+1.
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="ltv">
          <Card className="p-5">
            <div className="mb-4">
              <h2 className="text-lg font-bold font-heading">Распределение LTV</h2>
              <p className="text-xs text-muted-foreground">Сколько клиентов в каждой категории дохода</p>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ltvBuckets}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8E1D3" />
                  <XAxis dataKey="range" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v, name) => name === "count" ? [`${v} клиентов`, "Количество"] : v} contentStyle={{ borderRadius: 8 }} />
                  <Bar dataKey="count" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="abc">
          <Card className="p-5">
            <div className="mb-4">
              <h2 className="text-lg font-bold font-heading">ABC-сегментация клиентов</h2>
              <p className="text-xs text-muted-foreground">A — приносят 80% выручки. Береги в первую очередь.</p>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <Card className="p-4 bg-emerald-50 border-emerald-200">
                <div className="flex items-center gap-2 mb-1"><Badge variant="success">A</Badge> <span className="text-xs text-muted-foreground">80% выручки</span></div>
                <div className="text-2xl font-bold">{counts.A}</div>
                <div className="text-xs text-muted-foreground">клиентов</div>
              </Card>
              <Card className="p-4 bg-amber-50 border-amber-200">
                <div className="flex items-center gap-2 mb-1"><Badge variant="warning">B</Badge> <span className="text-xs text-muted-foreground">15% выручки</span></div>
                <div className="text-2xl font-bold">{counts.B}</div>
                <div className="text-xs text-muted-foreground">клиентов</div>
              </Card>
              <Card className="p-4 bg-muted/30">
                <div className="flex items-center gap-2 mb-1"><Badge variant="muted">C</Badge> <span className="text-xs text-muted-foreground">5% выручки</span></div>
                <div className="text-2xl font-bold">{counts.C}</div>
                <div className="text-xs text-muted-foreground">клиентов</div>
              </Card>
            </div>
            <div className="text-xs text-muted-foreground p-3 bg-primary/5 rounded-lg border border-primary/20">
              💡 80% выручки приносят всего {counts.A} клиентов из {clients.length}. Это первая аудитория для VIP-программы и персональных напоминаний.
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="sources">
          <Card className="p-5">
            <div className="mb-4">
              <h2 className="text-lg font-bold font-heading">Источники с выручкой</h2>
              <p className="text-xs text-muted-foreground">Куда тратить рекламный бюджет</p>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sourcesData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8E1D3" />
                  <XAxis type="number" tick={{ fontSize: 12 }} tickFormatter={(v) => `${Math.round(v / 1000)}к`} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={100} />
                  <Tooltip formatter={(v) => formatCurrency(Number(v))} contentStyle={{ borderRadius: 8 }} />
                  <Bar dataKey="Выручка" fill="var(--color-primary)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="health">
          <Card className="p-5">
            <div className="mb-4">
              <h2 className="text-lg font-bold font-heading">Health-радар салона</h2>
              <p className="text-xs text-muted-foreground">Ключевые метрики в одном графике, % от целевого значения</p>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radar}>
                  <PolarGrid stroke="#E8E1D3" />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: "#2A2A2A" }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Radar dataKey="value" stroke="var(--color-primary)" fill="var(--color-primary)" fillOpacity={0.35} />
                  <Tooltip formatter={(v) => `${v}%`} contentStyle={{ borderRadius: 8 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="p-5 bg-primary/5 border-primary/30">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/15 text-primary flex items-center justify-center shrink-0">
            <Target className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="font-semibold font-heading mb-1">AI-инсайт</div>
            <p className="text-sm text-muted-foreground">
              Когорта <strong>фев 26</strong> теряет {35 - 5}% между M+1 и M+2 — это потеря ~{formatCurrency(96000)} выручки в месяц. Рекомендую запустить welcome-серию и +1 напоминание на 35-й день. Прогноз эффекта: +{formatCurrency(58000)}/мес.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
