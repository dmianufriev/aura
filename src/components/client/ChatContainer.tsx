import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatMessage } from "./ChatMessage";
import { QuickReplies } from "./QuickReplies";
import { TypingIndicator } from "./TypingIndicator";
import { ConfirmCard } from "./ConfirmCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogHeader, DialogClose } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { getScenarios } from "@/lib/data";
import type { ChatBubble, ClientScenario, ScenarioId } from "@/types";
import { salonConfig } from "@/config/salon.config";
import { RefreshCw } from "lucide-react";

interface DisplayItem {
  id: string;
  type: "msg" | "confirm";
  from?: "bot" | "user";
  text?: string;
  confirm?: { title: string; details: string };
}

export function ChatContainer() {
  const [scenarios, setScenarios] = useState<ClientScenario[] | null>(null);
  const [scenarioId, setScenarioId] = useState<ScenarioId>("booking");
  const [items, setItems] = useState<DisplayItem[]>([]);
  const [quickReplies, setQuickReplies] = useState<string[] | null>(null);
  const [typing, setTyping] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [confirmSwitch, setConfirmSwitch] = useState<ScenarioId | null>(null);
  const idCounter = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getScenarios().then((s) => {
      setScenarios(s);
    });
  }, []);

  const current = useMemo(
    () => scenarios?.find((s) => s.id === scenarioId) ?? null,
    [scenarios, scenarioId]
  );

  useEffect(() => {
    if (!current) return;
    resetScenario(current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.id]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [items, typing, quickReplies]);

  function nextId() {
    idCounter.current += 1;
    return `m-${idCounter.current}`;
  }

  function resetScenario(sc: ClientScenario) {
    setItems([]);
    setQuickReplies(null);
    setTyping(false);
    setCompleted(false);
    const initialItems: DisplayItem[] = sc.initialMessages.map((m) => ({
      id: nextId(),
      type: "msg",
      from: m.from,
      text: m.text,
    }));
    setItems(initialItems);
    const last = sc.initialMessages[sc.initialMessages.length - 1];
    if (last?.quickReplies?.length) {
      setQuickReplies(last.quickReplies);
    }
  }

  async function playResponses(responses: ChatBubble[]) {
    let nextQuickReplies: string[] | null = null;
    let confirmCard: { title: string; details: string } | null = null;

    for (const r of responses) {
      if (r.from === "user") {
        setItems((prev) => [
          ...prev,
          { id: nextId(), type: "msg", from: "user", text: r.text },
        ]);
        continue;
      }
      if (r.typingDelay) {
        setTyping(true);
        await new Promise((res) => setTimeout(res, r.typingDelay));
        setTyping(false);
      }
      setItems((prev) => [
        ...prev,
        { id: nextId(), type: "msg", from: "bot", text: r.text },
      ]);
      if (r.quickReplies?.length) nextQuickReplies = r.quickReplies;
      if (r.confirmCard) confirmCard = r.confirmCard;
    }

    if (confirmCard) {
      setItems((prev) => [
        ...prev,
        { id: nextId(), type: "confirm", confirm: confirmCard! },
      ]);
      setQuickReplies(null);
      setCompleted(true);
    } else {
      setQuickReplies(nextQuickReplies);
    }
  }

  async function onReply(option: string) {
    if (!current || typing) return;
    setQuickReplies(null);
    const step = current.steps.find((s) => s.trigger === option);
    if (!step) {
      setItems((prev) => [
        ...prev,
        { id: nextId(), type: "msg", from: "user", text: option },
        { id: nextId(), type: "msg", from: "bot", text: "Хм, не понял. Давайте начнём заново 🙂" },
      ]);
      setCompleted(true);
      return;
    }
    await playResponses(step.responses);
  }

  function tryChangeScenario(next: ScenarioId) {
    if (next === scenarioId) return;
    if (items.length > 0 && !completed) {
      setConfirmSwitch(next);
    } else {
      setScenarioId(next);
    }
  }

  function restart() {
    if (current) resetScenario(current);
  }

  return (
    <>
      <div className="border-b border-border bg-card px-4 py-3 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center text-xl">
          {salonConfig.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold truncate">{salonConfig.name}</div>
          <div className="text-xs text-emerald-600 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
            онлайн · отвечает мгновенно
          </div>
        </div>
      </div>

      <div className="px-3 pt-3 pb-2 border-b border-border bg-card">
        <Tabs value={scenarioId} onValueChange={(v) => tryChangeScenario(v as ScenarioId)}>
          <TabsList className="grid grid-cols-4 w-full h-9">
            {scenarios ? (
              scenarios.map((s) => (
                <TabsTrigger key={s.id} value={s.id} className="text-xs">
                  {s.title}
                </TabsTrigger>
              ))
            ) : (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-7 mx-1" />
              ))
            )}
          </TabsList>
        </Tabs>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2 bg-[#FAF7F2]">
        <AnimatePresence initial={false}>
          {items.map((it) =>
            it.type === "msg" ? (
              <ChatMessage key={it.id} from={it.from!} text={it.text!} />
            ) : (
              <ConfirmCard key={it.id} title={it.confirm!.title} details={it.confirm!.details} />
            )
          )}
          {typing && (
            <motion.div key="typing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <TypingIndicator />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="border-t border-border bg-card px-3 py-3 min-h-[64px]">
        {completed ? (
          <Button variant="outline" className="w-full" onClick={restart}>
            <RefreshCw className="h-4 w-4" />
            Начать заново
          </Button>
        ) : quickReplies ? (
          <QuickReplies options={quickReplies} disabled={typing} onSelect={onReply} />
        ) : (
          <div className="text-xs text-muted-foreground text-center pt-1.5">
            {typing ? "AI печатает..." : "Жмите кнопку выше"}
          </div>
        )}
      </div>

      <Dialog open={confirmSwitch !== null} onOpenChange={(o) => !o && setConfirmSwitch(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Начать заново?</DialogTitle>
            <DialogDescription>
              Если переключитесь на другой сценарий, текущий прогресс будет потерян.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button variant="outline">Остаться</Button>
            </DialogClose>
            <Button
              onClick={() => {
                if (confirmSwitch) {
                  setScenarioId(confirmSwitch);
                  setConfirmSwitch(null);
                }
              }}
            >
              Переключить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
