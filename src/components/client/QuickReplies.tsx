import { motion } from "framer-motion";

interface Props {
  options: string[];
  disabled?: boolean;
  onSelect: (option: string) => void;
}

export function QuickReplies({ options, disabled, onSelect }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className="flex flex-wrap gap-2 px-1 pt-1"
    >
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onSelect(opt)}
          disabled={disabled}
          className="px-3 py-2 rounded-full border border-primary/40 text-sm text-primary hover:bg-primary/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {opt}
        </button>
      ))}
    </motion.div>
  );
}
