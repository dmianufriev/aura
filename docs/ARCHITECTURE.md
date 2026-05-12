# Архитектура AURA

> Карта проекта: что где лежит, как данные текут, как роли переключаются, как кастомизация одного файла перерисовывает всё.

---

## 1. Big picture

AURA — это **демо-приложение, имитирующее операционку сервисного бизнеса**. Бэкенда нет: всё работает на статических JSON-моках + Promise-обёртках с искусственной задержкой 200–400 мс.

```
┌─────────────────────────────────────────────────────────────────┐
│                       Браузер (статика)                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  React 19 + Vite + TS + Tailwind                          │  │
│  │                                                            │  │
│  │  ┌──────────┐  ┌──────────────┐  ┌──────────────────┐    │  │
│  │  │  App.tsx │→ │ RoleProvider │→ │ Layout (Sidebar) │    │  │
│  │  └──────────┘  └──────────────┘  └─────────┬────────┘    │  │
│  │                       │                     │              │  │
│  │                       ▼                     ▼              │  │
│  │              ┌────────────────┐    ┌──────────────┐       │  │
│  │              │ localStorage   │    │  Pages × 13  │       │  │
│  │              │ aura.role      │    │  + Routing   │       │  │
│  │              └────────────────┘    └──────┬───────┘       │  │
│  │                                            │                │  │
│  │                                            ▼                │  │
│  │                                  ┌──────────────────┐      │  │
│  │                                  │ lib/data/*       │      │  │
│  │                                  │ (Promise + delay)│      │  │
│  │                                  └─────────┬────────┘      │  │
│  │                                            │                │  │
│  │                                            ▼                │  │
│  │                                  ┌──────────────────┐      │  │
│  │                                  │ data/*.json      │      │  │
│  │                                  │ (моки)           │      │  │
│  │                                  └──────────────────┘      │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
              ┌─────────────────────────────┐
              │  nginx → /var/www/aura/      │
              │  SPA fallback на index.html  │
              └─────────────────────────────┘
```

**Главный принцип:** компоненты НИКОГДА не импортируют JSON напрямую. Они зовут `getDashboardStats()`, `getMasters()` и т.д. из `src/lib/data/index.ts` — это даёт единую точку миграции на реальный API в будущем (просто заменить тело функции на `fetch(...)`).

---

## 2. Структура проекта

```
aura/
├── src/
│   ├── main.tsx                    # ReactDOM.render + импорт шрифтов
│   ├── App.tsx                     # BrowserRouter + RoleProvider + Layout
│   ├── index.css                   # Tailwind directives + базовые стили
│   │
│   ├── config/
│   │   └── salon.config.ts         # ⚡ ЕДИНСТВЕННЫЙ файл для кастомизации
│   │
│   ├── types/
│   │   └── index.ts                # Все TypeScript-типы для моков
│   │
│   ├── data/                       # Моки (JSON, генерятся скриптами)
│   │   ├── masters.json            # 4 специалиста
│   │   ├── services.json           # 12 услуг с маржой
│   │   ├── clients.json            # 60 клиентов с историей
│   │   ├── appointments.json       # Записи на сегодня
│   │   ├── dashboard.json          # KPI + источники
│   │   ├── insights.json           # 3 AI-инсайта
│   │   ├── conversations.json      # 12 диалогов AI-инбокса
│   │   ├── lost_clients.json       # 47 спящих клиентов
│   │   ├── client_scenarios.json   # 4 интерактивных сценария чата
│   │   ├── loyalty.json            # 4 программы лояльности
│   │   ├── certificates.json       # 15 подарочных сертификатов
│   │   ├── subscriptions.json      # 12 активных абонементов
│   │   ├── campaigns.json          # 7 маркетинговых кампаний
│   │   ├── inventory.json          # 15 SKU склада
│   │   ├── payroll.json            # Ведомость зарплаты
│   │   ├── finance.json            # P&L + cashflow + расходы
│   │   ├── cohorts.json            # Cohort retention 8×8
│   │   ├── reviews.json            # 10 отзывов
│   │   └── integrations.json       # 12 интеграций для Settings
│   │
│   ├── lib/
│   │   ├── data/
│   │   │   └── index.ts            # 22 async-функции getX()
│   │   └── utils.ts                # cn, formatCurrency, formatPercent, sleep
│   │
│   ├── contexts/
│   │   └── RoleContext.tsx         # useRole() + localStorage 'aura.role'
│   │
│   ├── components/
│   │   ├── ui/                     # 13 примитивов (Button, Card, Tabs, ...)
│   │   ├── layout/
│   │   │   ├── Header.tsx          # Sticky хедер + переключатель ролей + поиск
│   │   │   ├── Sidebar.tsx         # Левое меню с группировкой по разделам
│   │   │   └── PhoneFrame.tsx      # Рамка телефона для роли "Клиент"
│   │   ├── owner/                  # Компоненты главной (KPI, график, мастера, инсайты)
│   │   └── client/                 # Чат-движок (стейт-машина, typing, confirm)
│   │
│   └── pages/                      # 13 страниц = 12 owner + 1 client
│       ├── Dashboard.tsx
│       ├── Schedule.tsx
│       ├── Clients.tsx
│       ├── Inbox.tsx
│       ├── Reactivation.tsx
│       ├── Marketing.tsx
│       ├── Reviews.tsx
│       ├── Loyalty.tsx
│       ├── Finance.tsx
│       ├── Inventory.tsx
│       ├── Analytics.tsx
│       ├── Settings.tsx
│       └── Client.tsx              # Мобильный чат-mockup
│
├── scripts/                        # Скрипты пересоздания моков
│   ├── gen-mocks.mjs               # masters, dashboard, insights, conversations, lost_clients, scenarios
│   └── gen-mocks-extra.mjs         # services, clients, appointments, loyalty, certs, subs, campaigns, inventory, payroll, finance, cohorts, reviews, integrations
│
├── deploy/
│   ├── nginx-subdomain.conf.example
│   ├── nginx-path.conf.example
│   └── deploy.sh
│
├── docs/                           # ← Эта документация
│   ├── ARCHITECTURE.md
│   ├── FEATURES.md
│   ├── CUSTOMIZATION.md
│   └── ADAPT_TO_NICHE.md
│
└── public/, dist/, package.json, tailwind.config.js, vite.config.ts, tsconfig*.json
```

---

## 3. Жизненный цикл данных

### Шаг 1: импорт моков → типизация

```typescript
// src/lib/data/index.ts
import dashboardJson from "@/data/dashboard.json";
import type { DashboardStats } from "@/types";

export async function getDashboardStats(): Promise<DashboardStats> {
  await sleep(180 + Math.floor(Math.random() * 180));   // имитация сети
  return dashboardJson as DashboardStats;
}
```

Каждый JSON-файл типизирован → если структура моков сломалась, `tsc` упадёт на build.

### Шаг 2: страница потребляет данные

```typescript
// src/pages/Dashboard.tsx
export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    getDashboardStats().then(setStats);
  }, []);

  if (!stats) return <Skeleton />;
  return <KpiCards stats={stats} />;
}
```

**3 состояния для каждой страницы:** Loading (Skeleton) → Loaded → Error (Alert).

### Шаг 3: компонент рендерит

```typescript
// src/components/owner/KpiCards.tsx
export function KpiCards({ stats }: { stats: DashboardStats | null }) {
  if (!stats) return <SkeletonGrid />;
  return <Grid>{...формат через formatCurrency()}</Grid>;
}
```

### Куда мигрировать на реальный API

В будущем нужно только заменить тело функций в `src/lib/data/index.ts`:

```typescript
export async function getDashboardStats(): Promise<DashboardStats> {
  const res = await fetch("/api/dashboard", { headers: authHeaders() });
  if (!res.ok) throw new Error("API error");
  return res.json();
}
```

Компоненты не меняются вообще.

---

## 4. Переключение ролей и роутинг

### Контекст роли

`src/contexts/RoleContext.tsx`:
- Состояние `role: "owner" | "client"`
- Сохраняется в `localStorage` под ключом `aura.role`
- Hook `useRole()` доступен везде

### Layout решает, что показывать

`src/App.tsx` → `Layout`:
- Если `role === "client"` → fullwidth страница `Client.tsx` (без sidebar)
- Если `role === "owner"` → Header + Sidebar + main с маршрутами

### Маршруты владельца (12 разделов)

| Путь | Компонент | Раздел в sidebar |
|------|-----------|------------------|
| `/` | DashboardPage | Управление → Дашборд |
| `/schedule` | SchedulePage | Управление → Журнал записи |
| `/clients` | ClientsPage | Управление → Клиенты |
| `/inbox` | InboxPage | AI & Маркетинг → AI-Инбокс |
| `/reactivation` | ReactivationPage | AI & Маркетинг → Возврат |
| `/marketing` | MarketingPage | AI & Маркетинг → Маркетинг |
| `/reviews` | ReviewsPage | AI & Маркетинг → Отзывы |
| `/loyalty` | LoyaltyPage | Финансы → Лояльность |
| `/finance` | FinancePage | Финансы → Финансы |
| `/inventory` | InventoryPage | Финансы → Склад |
| `/analytics` | AnalyticsPage | Финансы → Аналитика |
| `/settings` | SettingsPage | Прочее → Настройки |

### Маршрут клиента

| Путь | Компонент |
|------|-----------|
| `/client` | ClientPage (чат-mockup в рамке телефона) |

Переключение «Владелец / Клиент» в Header вызывает `navigate("/client")` или `navigate("/")` + обновляет роль в Context.

---

## 5. Дизайн-система: палитра через CSS-переменные

Палитра задаётся **одним файлом** `src/config/salon.config.ts`:

```typescript
export const salonConfig: SalonConfig = {
  palette: {
    primary: "#B8956A",     // акцент (кнопки, активные иконки)
    accent: "#2A2A2A",      // текст, графит
    background: "#FAF7F2",  // фон страницы
  },
};
```

В `App.tsx` при старте применяется к `:root`:

```typescript
useEffect(() => {
  document.documentElement.style.setProperty("--color-primary", salonConfig.palette.primary);
  // ...
}, []);
```

Tailwind в `tailwind.config.js` подхватывает переменные:

```javascript
colors: {
  primary: { DEFAULT: "var(--color-primary)", foreground: "#FFFFFF" },
  accent: { DEFAULT: "var(--color-accent)" },
  background: "var(--color-background)",
}
```

→ Меняешь `salon.config.ts` → все кнопки, бейджи, графики Recharts (`stroke="var(--color-primary)"`) автоматически перекрашиваются.

---

## 6. Взаимосвязи разделов

Один и тот же объект (например, **Клиент**) появляется в нескольких разделах. Здесь — что откуда тянется:

```
                          ┌─────────────────┐
                          │  Клиент (cl12)  │
                          │  имя/телефон/   │
                          │  LTV/история    │
                          └────────┬────────┘
                                   │
        ┌──────────────────────────┼──────────────────────────┐
        │                          │                          │
        ▼                          ▼                          ▼
   ┌────────┐               ┌─────────────┐           ┌──────────┐
   │ Список │               │ AI-Инбокс   │           │ Маркетинг│
   │клиентов│               │ (диалог)    │           │ (триггер)│
   └────┬───┘               └─────────────┘           └────┬─────┘
        │                                                   │
        │ click → sheet с деталями                          │
        │                                                   │
        ▼                                                   ▼
   ┌──────────────┐                                  ┌──────────────┐
   │ История      │                                  │ "После визита"
   │ визитов      │                                  │ кампания шлёт│
   │ (с услугой,  │                                  │ персональное │
   │ мастером,    │                                  │ сообщение    │
   │ оценкой)     │                                  └──────────────┘
   └──────┬───────┘
          │
          ▼
   ┌──────────────┐
   │  Журнал      │ — запись клиента к мастеру
   │  (slot)      │
   └──────────────┘
```

**Ключевые сущности и где они связаны:**

- **Master** появляется в: Dashboard (рейтинг по марже), Schedule (колонки), Clients (любимый мастер), Finance (ведомость ЗП), Settings (карточки), Inventory (косвенно — расходники мастера).
- **Service** появляется в: Schedule (что записано), Clients (предпочитаемые), Loyalty (абонементы на N услуг), Inventory (автосписание расходника), Settings (каталог с маржой).
- **Client** — пронизывает всё: Schedule, Clients, Inbox, Reactivation, Marketing, Reviews, Loyalty.
- **Insight** (AI-инсайт) — связывает Dashboard ↔ Reactivation (через `actionLink`).

Полная карта всех 13 разделов и их моков — в [FEATURES.md](FEATURES.md).

---

## 7. Стек компонентов: layered

Снизу вверх:

```
┌─ Layer 4: PAGES (пиксели + бизнес-логика страницы)
│   Dashboard, Schedule, Clients, ...
│
├─ Layer 3: FEATURE COMPONENTS
│   KpiCards, RevenueChart, MastersTable, ChatContainer, ...
│
├─ Layer 2: UI PRIMITIVES (shadcn-style)
│   Button, Card, Badge, Tabs, Dialog, Sheet, Input, Switch, Progress, Avatar, ...
│
├─ Layer 1: LIBRARY PRIMITIVES
│   Radix UI (модалки/табы/sheet), Recharts (графики), framer-motion (анимации), lucide-react (иконки)
│
└─ Layer 0: PLATFORM
    React 19, Tailwind 3, TS strict
```

**Правило одного компонента:** один файл = один экспорт = до 250 строк. Если разрастается — выделять подкомпоненты.

---

## 8. Деплой: статика + nginx SPA-фолбэк

`vite build` собирает `dist/` со статикой. nginx раздаёт её с правилом `try_files $uri $uri/ /index.html` — это нужно, чтобы прямые URL (`/aura/clients`) не отдавали 404 при F5.

Текущий деплой использует path-based `/aura/`. Если хочешь поддомен `aura.example.ru`:
1. DNS A-запись на IP
2. Билд с `VITE_BASE=/`
3. Отдельный server-блок nginx + Certbot

Скрипт `deploy/deploy.sh` инкапсулирует это.

---

## 9. Что НЕ реализовано (и почему)

- **Реальный бэкенд** — это демо для продажи внедрения. Реальный API делается под клиента отдельно.
- **Авторизация** — нет логина, демо открытое.
- **Реальные платежи** — оплата сертификата/предоплата эмулируется тостом.
- **WhatsApp/Instagram API** — реальные интеграции делаются на стороне клиента (WABA, чат-боты).
- **Drag-and-drop в Schedule** — в продакшене делается через `dnd-kit`, в демо клик по слоту открывает диалог создания записи.
- **Виртуализация таблиц** — клиентов 60, помещается без `react-virtual`. При 5000+ нужно подключить.
- **i18n** — все тексты на русском, hardcoded. Для мультиязычности — `react-i18next`.

---

## 10. Перформанс и размеры

- Bundle: **617 KB JS** (156 KB gzip), CSS 58 KB (18 KB gzip)
- Чанки: `recharts` 426 KB (lazy для графиков) + `framer-motion` 132 KB + основное 617 KB
- Шрифты: 12 файлов woff2 (Inter + Manrope), preload через `@fontsource`
- Lighthouse: Performance >90, Accessibility >90 (по чек-листу SPEC)

Дальнейшая оптимизация: code-splitting по маршрутам (`React.lazy`), уменьшение Recharts (если использовать только Area/Bar — собрать кастомным).

---

## Дальше

- [FEATURES.md](FEATURES.md) — детальное описание каждого из 13 разделов
- [CUSTOMIZATION.md](CUSTOMIZATION.md) — кастомизация: палитра, моки, добавление разделов
- [ADAPT_TO_NICHE.md](ADAPT_TO_NICHE.md) — готовые конфиги под 6 ниш (стоматология, фитнес, барбершоп, медцентр, автосервис, репетитор)
