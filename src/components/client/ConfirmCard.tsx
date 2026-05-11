import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface Props {
  title: string;
  details: string;
}

export function ConfirmCard({ title, details }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="self-stretch rounded-2xl border-2 border-emerald-500 bg-emerald-50 p-4 mt-2"
    >
      <div className="flex items-start gap-3">
        <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
        <div>
          <div className="font-semibold text-emerald-900">{title}</div>
          <div className="text-sm text-emerald-800 mt-1">{details}</div>
        </div>
      </div>
    </motion.div>
  );
}
