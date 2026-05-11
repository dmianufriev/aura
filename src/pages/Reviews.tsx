import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Avatar } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { getReviews } from "@/lib/data";
import type { Review } from "@/types";
import { cn } from "@/lib/utils";
import { Star, Bot, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const channelLabels = {
  yandex_maps: "Яндекс.Карты",
  twogis: "2ГИС",
  whatsapp: "WhatsApp",
  direct: "Сайт",
  google: "Google",
};

const statusMeta = {
  pending_review: { label: "На модерации", variant: "muted" as const },
  needs_response: { label: "Нужен ответ", variant: "destructive" as const },
  published: { label: "Опубликован", variant: "success" as const },
  responded: { label: "Ответили", variant: "default" as const },
};

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={cn("h-4 w-4", i < rating ? "fill-amber-400 text-amber-400" : "text-muted")} />
      ))}
    </div>
  );
}

export function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [filter, setFilter] = useState<"all" | "negative" | "pending">("all");
  const [active, setActive] = useState<Review | null>(null);

  useEffect(() => {
    getReviews().then(setReviews);
  }, []);

  const filtered = reviews?.filter((r) => {
    if (filter === "negative") return r.rating <= 3;
    if (filter === "pending") return r.status === "needs_response" || r.status === "pending_review";
    return true;
  });

  const stats = reviews ? {
    total: reviews.length,
    avg: (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1),
    needsResponse: reviews.filter((r) => r.status === "needs_response").length,
    positive: reviews.filter((r) => r.rating >= 4).length,
  } : null;

  function publishReply() {
    if (!active) return;
    toast.success("Ответ опубликован на " + channelLabels[active.channel]);
    setActive(null);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-heading mb-1">Отзывы и AI-модерация</h1>
        <p className="text-muted-foreground">
          AI ловит негатив до публикации — администратор отвечает лично. Позитив автопубликуется на картах.
        </p>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="p-4">
            <div className="text-xs text-muted-foreground mb-1">Средняя оценка</div>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">{stats.avg}</span>
              <Stars rating={Math.round(parseFloat(stats.avg))} />
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-xs text-muted-foreground mb-1">Всего отзывов</div>
            <div className="text-3xl font-bold">{stats.total}</div>
          </Card>
          <Card className="p-4">
            <div className="text-xs text-muted-foreground mb-1">Положительных</div>
            <div className="text-3xl font-bold text-emerald-600">{stats.positive}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{Math.round((stats.positive / stats.total) * 100)}%</div>
          </Card>
          <Card className="p-4 border-red-200 bg-red-50/30">
            <div className="text-xs text-muted-foreground mb-1">Требуют ответа</div>
            <div className="text-3xl font-bold text-red-600">{stats.needsResponse}</div>
          </Card>
        </div>
      )}

      <Card className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 bg-primary/5 border-primary/20">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-md bg-primary/15 text-primary flex items-center justify-center">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="font-medium text-sm">AI-фильтр негатива</div>
            <div className="text-xs text-muted-foreground">Негативные отзывы попадают сюда до публикации — администратор решает, что делать</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Автопубликация ≥4★</span>
            <Switch defaultChecked onCheckedChange={(v) => toast(v ? "Включено" : "Выключено")} />
          </div>
        </div>
      </Card>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
        <TabsList>
          <TabsTrigger value="all">Все ({reviews?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="negative">Негатив (≤3★)</TabsTrigger>
          <TabsTrigger value="pending">Нужна реакция</TabsTrigger>
        </TabsList>
      </Tabs>

      {!filtered ? (
        <div className="space-y-3"><Skeleton className="h-32" /><Skeleton className="h-32" /></div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <Card key={r.id} className={cn("p-5", r.rating <= 2 && "border-red-200 bg-red-50/40")}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-3">
                  <Avatar initials={r.clientAvatar} />
                  <div>
                    <div className="font-medium">{r.clientName}</div>
                    <div className="text-xs text-muted-foreground">
                      {channelLabels[r.channel]} · {r.service} · {r.master.split(" ")[0]} · {r.date}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <Stars rating={r.rating} />
                  <Badge variant={statusMeta[r.status].variant}>{statusMeta[r.status].label}</Badge>
                </div>
              </div>
              <p className="text-sm mb-3">{r.text}</p>
              {r.aiSuggestedReply && (
                <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-primary mb-1.5">
                    <Bot className="h-3.5 w-3.5" /> AI предлагает ответ
                  </div>
                  <p className="text-sm text-foreground/90 italic">"{r.aiSuggestedReply}"</p>
                </div>
              )}
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <Button size="sm" onClick={() => setActive(r)}>Ответить</Button>
                {r.rating >= 4 && r.status !== "published" && (
                  <Button size="sm" variant="outline" onClick={() => toast.success(`Опубликовано на ${channelLabels[r.channel]}`)}>Опубликовать</Button>
                )}
                {r.rating <= 2 && (
                  <Button size="sm" variant="outline" onClick={() => toast("Передано администратору · позвонит клиенту")}>Передать админу</Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent>
          {active && (
            <>
              <DialogHeader>
                <DialogTitle>Ответ на отзыв · {active.clientName}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div className="rounded-lg bg-muted/40 p-3 text-sm">
                  <div className="flex items-center gap-2 mb-2"><Stars rating={active.rating} /> <span className="text-xs text-muted-foreground">{channelLabels[active.channel]}</span></div>
                  <p>{active.text}</p>
                </div>
                <textarea
                  className="w-full min-h-32 rounded-md border border-border bg-card p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  defaultValue={active.aiSuggestedReply ?? "Спасибо большое за отзыв! Будем рады видеть вас снова 🌷"}
                />
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                  Ответ опубликуется автоматически на {channelLabels[active.channel]}
                </div>
                {active.rating <= 2 && (
                  <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs flex gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <span className="text-amber-800">
                      <strong>Рекомендация AI:</strong> предложить компенсацию в личной беседе (звонок), не публично. Это снизит риск эскалации.
                    </span>
                  </div>
                )}
              </div>
              <DialogFooter className="gap-2">
                <DialogClose asChild><Button variant="outline">Отмена</Button></DialogClose>
                <Button onClick={publishReply}>Опубликовать ответ</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
