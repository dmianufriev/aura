import { motion } from "framer-motion";

export function TypingIndicator() {
  return (
    <div className="bg-muted self-start rounded-2xl px-4 py-3 flex items-center gap-1.5 max-w-[60%]">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="block h-1.5 w-1.5 rounded-full bg-muted-foreground/60"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}
