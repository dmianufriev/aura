import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LostClientsTable } from "@/components/owner/LostClientsTable";
import { ReactivationDialog } from "@/components/owner/ReactivationDialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getLostClients } from "@/lib/data";
import type { LostClient } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Send } from "lucide-react";

type Segment = "all" | "30+" | "60+" | "90+";

export function ReactivationPage() {
  const [clients, setClients] = useState<LostClient[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [segment, setSegment] = useState<Segment>("all");
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    getLostClients()
      .then(setClients)
      .catch((e) => setError(e instanceof Error ? e.message : "Ошибка загрузки"));
  }, []);

  const filtered = useMemo(() => {
    if (!clients) return null;
    if (segment === "all") return clients;
    return clients.filter((c) => c.segment === segment);
  }, [clients, segment]);

  const totalPotential = useMemo(() => {
    if (!clients) return 0;
    return clients.reduce((sum, c) => sum + c.averageCheck, 0);
  }, [clients]);

  if (error) {
    return (
      <Alert variant="destructive" className="my-8">
        <AlertTitle>Ошибка</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const counts = {
    all: clients?.length ?? 0,
    "30+": clients?.filter((c) => c.segment === "30+").length ?? 0,
    "60+": clients?.filter((c) => c.segment === "60+").length ?? 0,
    "90+": clients?.filter((c) => c.segment === "90+").length ?? 0,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-heading mb-2">Возврат клиентов</h1>
        <p className="text-muted-foreground">
          AI знает, кто перестал ходить, и одной кнопкой возвращает их персонализированной рассылкой.
        </p>
      </div>

      <Card className="p-6 bg-primary/5 border-primary/30">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="text-4xl font-bold font-heading">{counts.all} потерянных клиентов</div>
            <div className="text-lg text-muted-foreground mt-1">
              Потенциал: <span className="text-foreground font-semibold">{formatCurrency(totalPotential)}</span>
            </div>
          </div>
          <Button
            size="lg"
            onClick={() => setDialogOpen(true)}
            disabled={!clients}
          >
            <Send className="h-5 w-5" />
            Запустить волну рассылок
          </Button>
        </div>
      </Card>

      <Tabs value={segment} onValueChange={(v) => setSegment(v as Segment)}>
        <TabsList>
          <TabsTrigger value="all">Все {counts.all}</TabsTrigger>
          <TabsTrigger value="30+">30+ дней ({counts["30+"]})</TabsTrigger>
          <TabsTrigger value="60+">60+ дней ({counts["60+"]})</TabsTrigger>
          <TabsTrigger value="90+">90+ дней ({counts["90+"]})</TabsTrigger>
        </TabsList>
      </Tabs>

      <LostClientsTable clients={filtered} />

      {clients && (
        <ReactivationDialog open={dialogOpen} onOpenChange={setDialogOpen} clients={clients} />
      )}
    </div>
  );
}
