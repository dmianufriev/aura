import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Props {
  from: "bot" | "user";
  text: string;
}

export function ChatMessage({ from, text }: Props) {
  const isBot = from === "bot";
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={cn(
        "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap",
        isBot
          ? "bg-muted self-start rounded-bl-sm"
          : "bg-primary text-primary-foreground self-end rounded-br-sm"
      )}
    >
      {text}
    </motion.div>
  );
}
