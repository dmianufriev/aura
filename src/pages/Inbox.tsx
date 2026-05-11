import { useEffect, useState } from "react";
import { ConversationsList } from "@/components/owner/ConversationsList";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getConversations } from "@/lib/data";
import type { Conversation } from "@/types";

export function InboxPage() {
  const [items, setItems] = useState<Conversation[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getConversations()
      .then(setItems)
      .catch((e) => setError(e instanceof Error ? e.message : "Ошибка загрузки"));
  }, []);

  if (error) {
    return (
      <Alert variant="destructive" className="my-8">
        <AlertTitle>Ошибка</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-heading mb-2">AI-Инбокс</h1>
        <p className="text-muted-foreground">
          Бот сам отвечает клиентам в WhatsApp, Instagram и Telegram. Человек подключается только когда нужно.
        </p>
      </div>

      <Card className="p-5 border-primary/40 bg-primary/5">
        <div className="grid grid-cols-3 gap-4 text-center sm:text-left">
          <div>
            <div className="text-2xl font-bold font-heading">103</div>
            <div className="text-xs text-muted-foreground">диалога за 30 дней</div>
          </div>
          <div>
            <div className="text-2xl font-bold font-heading text-emerald-600">67</div>
            <div className="text-xs text-muted-foreground">записей оформлено</div>
          </div>
          <div>
            <div className="text-2xl font-bold font-heading">0</div>
            <div className="text-xs text-muted-foreground">пропущенных сообщений</div>
          </div>
        </div>
      </Card>

      <ConversationsList conversations={items} />
    </div>
  );
}
