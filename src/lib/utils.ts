import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, withSign = false): string {
  const sign = withSign && amount > 0 ? "+" : "";
  return `${sign}${amount.toLocaleString("ru-RU")} ₽`;
}

export function formatPercent(value: number, withSign = false): string {
  const percent = Math.round(value * 100);
  const sign = withSign && percent > 0 ? "+" : "";
  return `${sign}${percent}%`;
}

export function formatDelta(value: number): string {
  const percent = (value * 100).toFixed(1).replace(".", ",");
  const sign = value > 0 ? "+" : "";
  return `${sign}${percent}%`;
}

export function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}
