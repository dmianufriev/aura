/**
 * AURA — Конфигурация салона.
 *
 * ЭТО ЕДИНСТВЕННЫЙ ФАЙЛ, который правят при форке под другого клиента.
 * После правки запустите `npm run dev` — изменения подтянутся.
 *
 * Для смены моковых цифр (мастера, услуги, диалоги) редактируйте
 * файлы в src/data/*.json по тем же типам из src/types/index.ts.
 */
import type { SalonConfig } from "@/types";

export const salonConfig: SalonConfig = {
  name: "Студия Аура",
  emoji: "💎",
  address: "Москва, ул. Пятницкая, 25",
  phone: "+7 (495) 123-45-67",
  averageCheck: 5990,
  adminSalary: 60000,
  palette: {
    primary: "#B8956A",
    accent: "#2A2A2A",
    background: "#FAF7F2",
  },
};
