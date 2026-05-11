import { cn } from "@/lib/utils";

interface Props {
  initials: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
};

export function Avatar({ initials, size = "md", className }: Props) {
  return (
    <div
      className={cn(
        "rounded-full bg-primary/15 text-primary font-semibold flex items-center justify-center shrink-0",
        sizes[size],
        className
      )}
    >
      {initials}
    </div>
  );
}
