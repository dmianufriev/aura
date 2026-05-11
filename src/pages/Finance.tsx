import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { getFinance, getPayroll } from "@/lib/data";
import type { FinanceSnapshot, PayrollRow } from "@/types";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, PieChart, Pie, Cell } from "recharts";
import { Wallet, TrendingUp, TrendingDown, Download, Send } from "lucide-react";
import { toast } from "sonner";

const COLORS = ["#B8956A", "#8E6D45", "#D4B58C", "#F1ECE3", "#A78A66", "#695238"];

export function FinancePage() {
  const [fin, setFin] = useState<FinanceSnapshot | null>(null);
  const [payroll, setPayroll] = useState<PayrollRow[] | null>(null);

  useEffect(() => {
    Promise.all([getFinance(), getPayroll()]).then(([f, p]) => {
      setFin(f);
      setPayroll(p);
    });
  }, []);

  if (!fin || !payroll) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3"><Skeleton className="h-28" /><Skeleton className="h-28" /><Skeleton className="h-28" /><Skeleton className="h-28" /></div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  const totalPayout = payroll.reduce((s, p) => s + p.payout, 0);
  const cashFlow = fin.cashflowByDay.map((d) => ({
    date: new Date(d.date).toLocaleDateString("ru-RU", { day: "numeric", month: "short" }),
    "Поступления": d.income,
    "Расходы": -d.expense,
    "Баланс": d.income - d.expense,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold font-heading mb-1">Финансы</h1>
          <p className="text-muted-foreground">Прибыль, расходы, зарплаты мастеров, прогноз. Выгрузка для бухгалтерии.</p>
        </div>
        <Button variant="outline" onClick={() => toast.success("Excel-выгрузка готова · отправлена бухгалтеру")}>
          <Download className="h-4 w-4" /> Выгрузить в 1С / Excel
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-5">
          <div className="text-xs text-muted-foreground mb-1">Выручка месяца</div>
          <div className="text-3xl font-bold font-heading">{formatCurrency(fin.monthRevenue)}</div>
          <div className="text-xs text-emerald-600 mt-1 flex items-center gap-1"><TrendingUp className="h-3 w-3" /> +12,4% к прошлому</div>
        </Card>
        <Card className="p-5">
          <div className="text-xs text-muted-foreground mb-1">Расходы</div>
          <div className="text-3xl font-bold font-heading">{formatCurrency(fin.monthRevenue - fin.monthProfit)}</div>
          <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><TrendingDown className="h-3 w-3" /> −2,1%</div>
        </Card>
        <Card className="p-5 bg-emerald-50 border-emerald-200">
          <div className="text-xs text-muted-foreground mb-1">Чистая прибыль</div>
          <div className="text-3xl font-bold font-heading text-emerald-700">{formatCurrency(fin.monthProfit)}</div>
          <div className="text-xs text-emerald-600 mt-1">Маржа: {formatPercent(fin.marginPercent)}</div>
        </Card>
        <Card className="p-5 bg-primary/5 border-primary/30">
          <div className="text-xs text-muted-foreground mb-1">Прогноз на следующий месяц</div>
          <div className="text-3xl font-bold font-heading text-primary">{formatCurrency(fin.forecastNextMonth)}</div>
          <div className="text-xs text-primary mt-1">+8% по AI-модели</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-5 lg:col-span-2">
          <div className="mb-4">
            <h2 className="text-lg font-bold font-heading">Денежный поток</h2>
            <p className="text-xs text-muted-foreground">Поступления (выручка) vs. Расходы (расходники, ЗП, аренда, налоги)</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={cashFlow} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E1D3" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#6B6B6B" }} interval={4} />
                <YAxis tick={{ fontSize: 11, fill: "#6B6B6B" }} tickFormatter={(v) => `${Math.round(v / 1000)}к`} />
                <Tooltip
                  formatter={(value) => formatCurrency(Math.abs(Number(value)))}
                  contentStyle={{ borderRadius: 8, border: "1px solid #E8E1D3" }}
                />
                <Legend />
                <Bar dataKey="Поступления" fill="#16A34A" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Расходы" fill="#DC2626" radius={[0, 0, 2, 2]} />
                <Line type="monotone" dataKey="Баланс" stroke="var(--color-primary)" strokeWidth={2} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-4">
            <h2 className="text-lg font-bold font-heading">Структура расходов</h2>
            <p className="text-xs text-muted-foreground">За май</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={fin.expensesBreakdown} dataKey="amount" nameKey="category" innerRadius={50} outerRadius={90} paddingAngle={2}>
                  {fin.expensesBreakdown.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => formatCurrency(Number(v))} contentStyle={{ borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-2">
            {fin.expensesBreakdown.map((e, i) => (
              <div key={e.category} className="flex items-center text-xs">
                <span className="w-3 h-3 rounded-sm mr-2" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="flex-1 truncate text-muted-foreground">{e.category}</span>
                <span className="tabular-nums font-medium">{formatCurrency(e.amount)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Tabs defaultValue="payroll">
        <TabsList>
          <TabsTrigger value="payroll">Зарплата мастеров</TabsTrigger>
          <TabsTrigger value="expenses">Прочие расходы</TabsTrigger>
        </TabsList>
        <TabsContent value="payroll">
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground border-b border-border bg-muted/30">
                    <th className="px-4 py-3 font-medium">Мастер</th>
                    <th className="px-4 py-3 font-medium text-right">Записей</th>
                    <th className="px-4 py-3 font-medium text-right">Выручка мастера</th>
                    <th className="px-4 py-3 font-medium text-right">Ставка</th>
                    <th className="px-4 py-3 font-medium text-right">Бонус</th>
                    <th className="px-4 py-3 font-medium text-right">К выплате</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {payroll.map((p) => (
                    <tr key={p.masterId} className="border-b border-border last:border-0">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar initials={p.masterAvatar} />
                          <span className="font-medium">{p.masterName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">{p.appointments}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{formatCurrency(p.revenue)}</td>
                      <td className="px-4 py-3 text-right">{formatPercent(p.ratePercent)}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{p.bonus > 0 ? formatCurrency(p.bonus) : "—"}</td>
                      <td className="px-4 py-3 text-right tabular-nums font-semibold">{formatCurrency(p.payout)}</td>
                      <td className="px-4 py-3 text-right">
                        <Button size="sm" variant="outline" onClick={() => toast.success(`${formatCurrency(p.payout)} переведено · ${p.masterName.split(" ")[0]}`)}>
                          <Send className="h-3 w-3" /> Выплатить
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-border font-semibold bg-muted/30">
                    <td className="px-4 py-3">Итого к выплате</td>
                    <td colSpan={4} />
                    <td className="px-4 py-3 text-right tabular-nums text-lg">{formatCurrency(totalPayout)}</td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="expenses">
          <Card className="overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b border-border bg-muted/30">
                  <th className="px-4 py-3 font-medium">Категория</th>
                  <th className="px-4 py-3 font-medium text-right">Сумма</th>
                  <th className="px-4 py-3 font-medium text-right">% от выручки</th>
                </tr>
              </thead>
              <tbody>
                {fin.expensesBreakdown.map((e) => (
                  <tr key={e.category} className="border-b border-border last:border-0">
                    <td className="px-4 py-3">{e.category}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-medium">{formatCurrency(e.amount)}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground tabular-nums">
                      {formatPercent(e.amount / fin.monthRevenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="p-5 bg-primary/5 border-primary/30">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/15 text-primary flex items-center justify-center shrink-0">
            <Wallet className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="font-semibold font-heading mb-1">AI-прогноз и совет</div>
            <p className="text-sm text-muted-foreground mb-3">
              По текущей записи и историческим коэффициентам — июнь принесёт <strong>~{formatCurrency(fin.forecastNextMonth)}</strong> выручки. Чтобы держать маржу выше 28%, не превышайте ФОТ <strong>{formatCurrency(Math.round(fin.forecastNextMonth * 0.42))}</strong>.
            </p>
            <Button size="sm" onClick={() => toast("Отчёт сохранён")}>Сохранить отчёт</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
