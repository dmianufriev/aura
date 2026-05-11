import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getAppointments, getMasters } from "@/lib/data";
import type { Appointment, AppointmentStatus, Master } from "@/types";
import { formatCurrency, cn } from "@/lib/utils";
import { Plus, ChevronLeft, ChevronRight, Clock, Phone, MessageCircle, Bot, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const HOURS = Array.from({ length: 11 }, (_, i) => i + 10); // 10-20

const statusMeta: Record<AppointmentStatus, { label: string; color: string }> = {
  confirmed: { label: "Подтверждён", color: "bg-primary/15 border-l-4 border-primary text-foreground" },
  pending: { label: "Ожидает", color: "bg-amber-100 border-l-4 border-amber-500 text-foreground" },
  completed: { label: "Завершён", color: "bg-emerald-100 border-l-4 border-emerald-500 text-foreground" },
  no_show: { label: "Не пришёл", color: "bg-red-100 border-l-4 border-red-500 text-foreground line-through" },
  cancelled: { label: "Отменён", color: "bg-muted border-l-4 border-border text-muted-foreground line-through" },
};

const sourceLabels: Record<string, string> = {
  online: "Сайт",
  whatsapp: "WhatsApp",
  admin: "Админ",
  instagram: "Instagram",
  telegram: "Telegram",
  walk_in: "Самотёк",
};

export function SchedulePage() {
  const [appointments, setAppointments] = useState<Appointment[] | null>(null);
  const [masters, setMasters] = useState<Master[] | null>(null);
  const [active, setActive] = useState<Appointment | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [day, setDay] = useState(0);

  useEffect(() => {
    Promise.all([getAppointments(), getMasters()]).then(([a, m]) => {
      setAppointments(a);
      setMasters(m);
    });
  }, []);

  function getAppt(masterId: string, hour: number) {
    if (!appointments) return null;
    return appointments.find(
      (a) => a.masterId === masterId && a.startHour === hour
    );
  }

  function getSlotSpan(appt: Appointment) {
    return Math.max(1, Math.ceil(appt.duration / 60));
  }

  function bookSlot() {
    setCreateOpen(false);
    toast.success("Запись создана", { description: "Клиенту отправлено подтверждение в WhatsApp" });
  }

  const totalBooked = appointments?.filter((a) => a.status === "confirmed" || a.status === "completed").length ?? 0;
  const totalRevenue = appointments?.filter((a) => a.status !== "no_show" && a.status !== "cancelled").reduce((s, a) => s + a.price, 0) ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading mb-1">Журнал записи</h1>
          <p className="text-muted-foreground">
            Свободные окна, переносы, контроль no-show. Drag-and-drop в продакшене.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Tabs value="day" className="hidden md:block">
            <TabsList>
              <TabsTrigger value="day">День</TabsTrigger>
              <TabsTrigger value="week" disabled>Неделя</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" /> Новая запись
          </Button>
        </div>
      </div>

      <Card className="p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => setDay((d) => d - 1)} aria-label="Назад">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-lg font-semibold font-heading">
            {day === 0 ? "Сегодня" : day === -1 ? "Вчера" : day === 1 ? "Завтра" : `+${day} дн`}
            <span className="text-muted-foreground font-normal text-base ml-2">
              11 мая, понедельник
            </span>
          </div>
          <Button variant="outline" size="icon" onClick={() => setDay((d) => d + 1)} aria-label="Вперёд">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <div>
            <span className="text-muted-foreground">Записей: </span>
            <span className="font-semibold">{totalBooked}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Выручка дня: </span>
            <span className="font-semibold text-emerald-600">{formatCurrency(totalRevenue)}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Загрузка: </span>
            <span className="font-semibold">76%</span>
          </div>
        </div>
      </Card>

      {!appointments || !masters ? (
        <Skeleton className="h-[600px]" />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[700px]">
              <div className="grid border-b border-border bg-muted/30" style={{ gridTemplateColumns: `60px repeat(${masters.length}, 1fr)` }}>
                <div className="p-3 text-xs font-medium text-muted-foreground">Час</div>
                {masters.map((m) => (
                  <div key={m.id} className="p-3 border-l border-border">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/15 text-primary text-xs font-semibold flex items-center justify-center">
                        {m.avatar}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium truncate text-sm">{m.name.split(" ")[0]}</div>
                        <div className="text-xs text-muted-foreground truncate">{m.specialty[0]}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {HOURS.map((hour) => (
                <div
                  key={hour}
                  className="grid border-b border-border last:border-0"
                  style={{ gridTemplateColumns: `60px repeat(${masters.length}, 1fr)`, minHeight: 56 }}
                >
                  <div className="p-2 text-xs text-muted-foreground border-r border-border">
                    {hour}:00
                  </div>
                  {masters.map((m) => {
                    const appt = getAppt(m.id, hour);
                    if (appt) {
                      const span = getSlotSpan(appt);
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setActive(appt)}
                          className={cn(
                            "border-l border-border p-2 text-left text-xs cursor-pointer hover:opacity-90 transition-opacity",
                            statusMeta[appt.status].color
                          )}
                          style={{ minHeight: 56 * span }}
                        >
                          <div className="font-semibold truncate">{appt.clientName}</div>
                          <div className="truncate opacity-80">{appt.serviceName}</div>
                          <div className="flex items-center gap-1 mt-1 text-[10px] opacity-70">
                            <Clock className="h-2.5 w-2.5" />
                            {String(appt.startHour).padStart(2, "0")}:{String(appt.startMinute).padStart(2, "0")} · {appt.duration} мин
                          </div>
                        </button>
                      );
                    }
                    // is this slot blocked by previous multi-hour appt?
                    const prev = appointments.find(
                      (a) => a.masterId === m.id && a.startHour < hour && a.startHour + Math.ceil(a.duration / 60) > hour
                    );
                    if (prev) return <div key={m.id} className="border-l border-border" />;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setCreateOpen(true)}
                        className="border-l border-border hover:bg-primary/5 transition-colors text-xs text-muted-foreground/0 hover:text-muted-foreground"
                      >
                        <Plus className="h-3 w-3 mx-auto opacity-0 hover:opacity-50" />
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      <Sheet open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <SheetContent>
          {active && (
            <>
              <SheetHeader>
                <SheetTitle>Запись #{active.id}</SheetTitle>
                <SheetDescription>
                  <Badge variant={active.status === "no_show" ? "destructive" : "default"}>
                    {statusMeta[active.status].label}
                  </Badge>
                  {active.isPrepaid && <Badge variant="success" className="ml-2">Предоплата</Badge>}
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-4 mt-4 overflow-y-auto -mx-6 px-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/15 flex items-center justify-center text-primary font-semibold">
                    {active.clientAvatar}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{active.clientName}</div>
                    <div className="text-xs text-muted-foreground">через {sourceLabels[active.source]}</div>
                  </div>
                  <Button variant="outline" size="icon" onClick={() => toast("Звоним клиенту…")}>
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => toast("Открыто в WhatsApp")}>
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>

                <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Услуга</span><span className="font-medium">{active.serviceName}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Мастер</span><span>{active.masterName}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Время</span><span>{String(active.startHour).padStart(2, "0")}:{String(active.startMinute).padStart(2, "0")} ({active.duration} мин)</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Цена</span><span className="font-semibold">{formatCurrency(active.price)}</span></div>
                </div>

                {active.note && (
                  <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm flex gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <span className="text-amber-800">{active.note}</span>
                  </div>
                )}

                <div className="rounded-lg border border-border p-3">
                  <div className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Bot className="h-4 w-4 text-primary" />
                    AI-помощник
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    Отправлю напоминание за 24 ч и 2 ч. Если клиент не подтвердит за 6 ч — спрошу администратора.
                  </p>
                  <Button size="sm" variant="outline" className="w-full" onClick={() => toast.success("Напоминание поставлено в очередь")}>
                    Отправить напоминание сейчас
                  </Button>
                </div>

                <div className="flex flex-col gap-2 pb-6">
                  <Button onClick={() => { toast.success("Запись подтверждена"); setActive(null); }}>Подтвердить</Button>
                  <Button variant="outline" onClick={() => { toast("Открыт перенос записи"); }}>Перенести</Button>
                  <Button variant="destructive" onClick={() => { toast.error("Запись отменена · клиент получит уведомление"); setActive(null); }}>Отменить</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Новая запись</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Клиент</label>
              <Input placeholder="Поиск по имени или телефону..." defaultValue="Анна Петрова" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Услуга</label>
                <Input defaultValue="Окрашивание" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Мастер</label>
                <Input defaultValue="Алина Сафронова" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Дата</label>
                <Input type="date" defaultValue="2026-05-11" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Время</label>
                <Input type="time" defaultValue="14:30" />
              </div>
            </div>
            <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 text-sm">
              <div className="font-medium mb-1">💡 AI рекомендует</div>
              <div className="text-xs text-muted-foreground">
                Алина свободна также 16:00 и 18:00. С учётом загрузки 89% — рекомендую 18:00 (более свободный слот).
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <DialogClose asChild><Button variant="outline">Отмена</Button></DialogClose>
            <Button onClick={bookSlot}>Создать запись</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
