import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { LostClient } from "@/types";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  clients: LostClient[];
}

const TEMPLATES = {
  "30+": {
    label: "30+ дней",
    text: "{имя}, давно вас не было ✨ Записать вас к Алине на стрижку на этой неделе?",
    tone: "Дружелюбное напоминание, без скидки",
  },
  "60+": {
    label: "60+ дней",
    text: "{имя}, прошло 2 месяца с последнего визита. Дарим скидку 15% на любую услугу до пятницы — записать?",
    tone: "Мягкий стимул, скидка 15%",
  },
  "90+": {
    label: "90+ дней",
    text: "{имя}, скучаем 💔 Возвращайтесь — для вас 20% от общего чека на этой неделе.",
    tone: "Последняя попытка, скидка 20%",
  },
} as const;

export function ReactivationDialog({ open, onOpenChange, clients }: Props) {
  const bySegment = {
    "30+": clients.filter((c) => c.segment === "30+"),
    "60+": clients.filter((c) => c.segment === "60+"),
    "90+": clients.filter((c) => c.segment === "90+"),
  };

  function send() {
    onOpenChange(false);
    toast.success("47 сообщений отправлено", {
      description: "Ожидаемый возврат: 12 клиентов · +71 880 ₽",
      duration: 6000,
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Запустить волну рассылок</DialogTitle>
          <DialogDescription>
            Превью сообщений по группам. Бот отправит каждому клиенту персонализированный текст с подстановкой имени.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="30+">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="30+">
              30+ ({bySegment["30+"].length})
            </TabsTrigger>
            <TabsTrigger value="60+">
              60+ ({bySegment["60+"].length})
            </TabsTrigger>
            <TabsTrigger value="90+">
              90+ ({bySegment["90+"].length})
            </TabsTrigger>
          </TabsList>

          {(["30+", "60+", "90+"] as const).map((seg) => (
            <TabsContent key={seg} value={seg} className="space-y-3 mt-4">
              <div className="rounded-lg bg-muted/50 p-4">
                <div className="text-xs text-muted-foreground mb-2">{TEMPLATES[seg].tone}</div>
                <div className="text-sm whitespace-pre-wrap">{TEMPLATES[seg].text}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-2">
                  Получат сообщение ({bySegment[seg].length}):
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {bySegment[seg].slice(0, 8).map((c) => (
                    <span key={c.id} className="text-xs bg-card border border-border rounded-full px-2.5 py-1">
                      {c.name.split(" ")[0]}
                    </span>
                  ))}
                  {bySegment[seg].length > 8 && (
                    <span className="text-xs text-muted-foreground py-1">+{bySegment[seg].length - 8} ещё</span>
                  )}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <DialogFooter className="gap-2 mt-2">
          <DialogClose asChild>
            <Button variant="outline">Отмена</Button>
          </DialogClose>
          <Button onClick={send}>Отправить (демо)</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
