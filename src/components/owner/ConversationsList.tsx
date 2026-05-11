import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import type { Conversation } from "@/types";
import { Camera, MessageCircle, Send, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

const channelMeta = {
  whatsapp: { icon: MessageCircle, label: "WhatsApp", color: "text-emerald-600" },
  instagram: { icon: Camera, label: "Instagram", color: "text-pink-600" },
  telegram: { icon: Send, label: "Telegram", color: "text-sky-600" },
} as const;

const statusMeta = {
  booked: { label: "Записан", variant: "success" as const },
  in_progress: { label: "В процессе", variant: "default" as const },
  needs_human: { label: "Нужен человек", variant: "warning" as const },
};

export function ConversationsList({ conversations }: { conversations: Conversation[] | null }) {
  const [filter, setFilter] = useState<"all" | Conversation["status"]>("all");
  const [active, setActive] = useState<Conversation | null>(null);

  if (!conversations) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
    );
  }

  const filtered = filter === "all" ? conversations : conversations.filter((c) => c.status === filter);

  return (
    <>
      <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">Все ({conversations.length})</TabsTrigger>
          <TabsTrigger value="booked">Записались</TabsTrigger>
          <TabsTrigger value="in_progress">В процессе</TabsTrigger>
          <TabsTrigger value="needs_human">Нужен человек</TabsTrigger>
        </TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <Card className="p-10 text-center text-muted-foreground">Нет диалогов по этому фильтру</Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((c) => {
            const ch = channelMeta[c.channel];
            const ChIcon = ch.icon;
            const st = statusMeta[c.status];
            return (
              <Card
                key={c.id}
                role="button"
                tabIndex={0}
                onClick={() => setActive(c)}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setActive(c)}
                className="p-4 hover:bg-muted/30 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/15 flex items-center justify-center text-primary font-semibold shrink-0">
                    {c.clientAvatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium truncate">{c.clientName}</span>
                      <ChIcon className={cn("h-3.5 w-3.5", ch.color)} />
                    </div>
                    <p className="text-sm truncate">{c.lastMessage}</p>
                    <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                      <Bot className="h-3 w-3" />
                      {c.lastReply}
                    </p>
                  </div>
                  <div className="text-right shrink-0 flex flex-col items-end gap-1">
                    <span className="text-xs text-muted-foreground">{c.time}</span>
                    <Badge variant={st.variant}>{st.label}</Badge>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Sheet open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <SheetContent>
          {active && (
            <>
              <SheetHeader>
                <SheetTitle>{active.clientName}</SheetTitle>
                <SheetDescription>
                  {channelMeta[active.channel].label} · {statusMeta[active.status].label}
                </SheetDescription>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto -mx-6 px-6 mt-4 space-y-3">
                {active.messages.map((m, i) => (
                  <div
                    key={i}
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-2.5",
                      m.from === "client"
                        ? "bg-muted self-start mr-auto"
                        : "bg-primary/10 self-end ml-auto"
                    )}
                  >
                    {m.from === "ai" && (
                      <div className="text-xs text-primary font-medium mb-1 flex items-center gap-1">
                        <Bot className="h-3 w-3" /> AI
                      </div>
                    )}
                    <div className="text-sm whitespace-pre-wrap">{m.text}</div>
                    <div className="text-[10px] text-muted-foreground mt-1">{m.time}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
