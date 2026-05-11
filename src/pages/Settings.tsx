import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { getMasters, getServices, getIntegrations } from "@/lib/data";
import type { IntegrationItem, Master, Service } from "@/types";
import { salonConfig } from "@/config/salon.config";
import { formatCurrency, cn } from "@/lib/utils";
import { Bot, Bell, Building2, Scissors, Users as UsersIcon, Cable, Plug } from "lucide-react";
import { toast } from "sonner";

export function SettingsPage() {
  const [masters, setMasters] = useState<Master[] | null>(null);
  const [services, setServices] = useState<Service[] | null>(null);
  const [integrations, setIntegrations] = useState<IntegrationItem[] | null>(null);

  useEffect(() => {
    Promise.all([getMasters(), getServices(), getIntegrations()]).then(([m, s, i]) => {
      setMasters(m);
      setServices(s);
      setIntegrations(i);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-heading mb-1">Настройки</h1>
        <p className="text-muted-foreground">Салон, услуги, мастера, AI-поведение, интеграции, уведомления.</p>
      </div>

      <Tabs defaultValue="salon">
        <TabsList className="overflow-x-auto flex-wrap justify-start h-auto">
          <TabsTrigger value="salon"><Building2 className="h-4 w-4 mr-1.5" /> Салон</TabsTrigger>
          <TabsTrigger value="services"><Scissors className="h-4 w-4 mr-1.5" /> Услуги</TabsTrigger>
          <TabsTrigger value="masters"><UsersIcon className="h-4 w-4 mr-1.5" /> Мастера</TabsTrigger>
          <TabsTrigger value="ai"><Bot className="h-4 w-4 mr-1.5" /> AI-бот</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="h-4 w-4 mr-1.5" /> Уведомления</TabsTrigger>
          <TabsTrigger value="integrations"><Plug className="h-4 w-4 mr-1.5" /> Интеграции</TabsTrigger>
        </TabsList>

        <TabsContent value="salon" className="space-y-4">
          <Card className="p-5 space-y-4">
            <h2 className="text-lg font-bold font-heading">Карточка салона</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Название</label>
                <Input defaultValue={salonConfig.name} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Эмодзи-логотип</label>
                <Input defaultValue={salonConfig.emoji} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Телефон</label>
                <Input defaultValue={salonConfig.phone} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Адрес</label>
                <Input defaultValue={salonConfig.address} />
              </div>
            </div>
          </Card>
          <Card className="p-5 space-y-4">
            <h2 className="text-lg font-bold font-heading">Палитра бренда</h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { name: "Primary", value: salonConfig.palette.primary },
                { name: "Accent", value: salonConfig.palette.accent },
                { name: "Background", value: salonConfig.palette.background },
              ].map((c) => (
                <div key={c.name}>
                  <label className="text-xs text-muted-foreground mb-1 block">{c.name}</label>
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-md border border-border" style={{ backgroundColor: c.value }} />
                    <Input defaultValue={c.value} className="font-mono text-xs" />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">При деплое палитра автоматически применится ко всему интерфейсу.</p>
          </Card>
          <div className="flex justify-end">
            <Button onClick={() => toast.success("Настройки салона сохранены")}>Сохранить</Button>
          </div>
        </TabsContent>

        <TabsContent value="services">
          {!services ? <Skeleton className="h-96" /> : (
            <Card className="overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="text-lg font-bold font-heading">Каталог услуг</h2>
                <Button size="sm" onClick={() => toast.success("Услуга добавлена")}>+ Добавить услугу</Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-muted-foreground border-b border-border bg-muted/30">
                      <th className="px-4 py-3 font-medium">Услуга</th>
                      <th className="px-4 py-3 font-medium">Категория</th>
                      <th className="px-4 py-3 font-medium text-right">Цена</th>
                      <th className="px-4 py-3 font-medium text-right">Длительность</th>
                      <th className="px-4 py-3 font-medium text-right">Себестоимость</th>
                      <th className="px-4 py-3 font-medium text-right">Маржа</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((s) => {
                      const margin = (s.price - s.cogs) / s.price;
                      return (
                        <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                          <td className="px-4 py-3 font-medium">{s.name}</td>
                          <td className="px-4 py-3 text-muted-foreground">{s.category}</td>
                          <td className="px-4 py-3 text-right tabular-nums">{formatCurrency(s.price)}</td>
                          <td className="px-4 py-3 text-right text-muted-foreground">{s.duration} мин</td>
                          <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{formatCurrency(s.cogs)}</td>
                          <td className={cn("px-4 py-3 text-right tabular-nums font-medium", margin > 0.7 ? "text-emerald-600" : margin > 0.5 ? "text-amber-600" : "text-red-600")}>
                            {Math.round(margin * 100)}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="masters">
          {!masters ? <Skeleton className="h-60" /> : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {masters.map((m) => (
                <Card key={m.id} className="p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <Avatar initials={m.avatar} size="lg" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold font-heading">{m.name}</div>
                      <div className="text-xs text-muted-foreground">{m.specialty.join(" · ")}</div>
                    </div>
                    <Switch defaultChecked onCheckedChange={(v) => toast(v ? `${m.name.split(" ")[0]} активен` : `${m.name.split(" ")[0]} в отпуске`)} />
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div>
                      <div className="text-muted-foreground">Записей</div>
                      <div className="font-semibold">{m.appointmentsCount}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Выручка</div>
                      <div className="font-semibold">{formatCurrency(m.revenue)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Загрузка</div>
                      <div className="font-semibold">{Math.round(m.load * 100)}%</div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => toast("Открыто расписание")}>График работы</Button>
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => toast("Открыт расчёт ЗП")}>Ставка и %</Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <Card className="p-5 space-y-4">
            <h2 className="text-lg font-bold font-heading flex items-center gap-2"><Bot className="h-5 w-5 text-primary" /> Поведение AI-бота</h2>
            {[
              { label: "Отвечать в WhatsApp / Instagram Direct / Telegram", on: true },
              { label: "Автоматически создавать запись при достаточной уверенности", on: true },
              { label: "Просить предоплату при онлайн-записи (от 20%)", on: false },
              { label: "Передавать диалог человеку при негативе или цене 10к+", on: true },
              { label: "Отправлять напоминания за 24 ч и 2 ч", on: true },
              { label: "Автоматическая реактивация спящих (30/60/90 дней)", on: true },
              { label: "Фильтр негативных отзывов до публикации", on: true },
            ].map((rule) => (
              <div key={rule.label} className="flex items-center justify-between gap-3 py-2 border-b border-border last:border-0">
                <span className="text-sm">{rule.label}</span>
                <Switch defaultChecked={rule.on} onCheckedChange={() => toast.success("Правило обновлено")} />
              </div>
            ))}
          </Card>
          <Card className="p-5 space-y-3">
            <h3 className="font-semibold">Базовый тон общения</h3>
            <textarea
              className="w-full min-h-32 rounded-md border border-border bg-card p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              defaultValue="Тёплый, дружелюбный, на «вы», но без лишнего пафоса. Можно эмодзи 1-2 на сообщение. Имена клиентов используем при первом контакте и при подтверждении."
            />
            <div className="flex justify-end">
              <Button onClick={() => toast.success("Тон обновлён")}>Сохранить</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-3">
          {[
            { label: "Напоминание клиенту за 24 ч до визита", channel: "WhatsApp" },
            { label: "Напоминание клиенту за 2 ч до визита", channel: "WhatsApp" },
            { label: "Запрос отзыва через 2 ч после визита", channel: "Telegram" },
            { label: "Поздравление с днём рождения (за 3 дня)", channel: "WhatsApp" },
            { label: "Напоминание мастеру о визите за 30 мин", channel: "Push" },
            { label: "Уведомление администратору о no-show", channel: "Telegram" },
          ].map((n, i) => (
            <Card key={i} className="p-4 flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">{n.label}</div>
                <div className="text-xs text-muted-foreground">Канал: {n.channel}</div>
              </div>
              <Switch defaultChecked onCheckedChange={(v) => toast(v ? "Включено" : "Выключено")} />
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="integrations">
          {!integrations ? <Skeleton className="h-60" /> : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {integrations.map((it) => (
                <Card key={it.id} className="p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center text-xl">{it.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate flex items-center gap-2">
                      {it.name}
                      {it.connected && <Badge variant="success" className="text-[10px]">Подключено</Badge>}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">{it.description}</div>
                  </div>
                  <Button
                    size="sm"
                    variant={it.connected ? "outline" : "default"}
                    onClick={() => toast.success(it.connected ? `${it.name} отключено` : `${it.name} подключено`)}
                  >
                    {it.connected ? "Отключить" : <><Cable className="h-3 w-3" /> Подключить</>}
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
