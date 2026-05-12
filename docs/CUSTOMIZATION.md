# Кастомизация AURA

> Как переименовать «Студию Аура» в другой бизнес и поменять все моки за 1–2 часа.

---

## TL;DR — где что менять

| Хочешь поменять | Файл | Эффект |
|------------------|------|--------|
| Название салона, эмодзи, адрес, телефон | `src/config/salon.config.ts` | Везде в UI |
| Цвета (палитру) | `src/config/salon.config.ts` → `palette` | Везде через CSS vars |
| Мастеров (специалистов) | `src/data/masters.json` | Dashboard, Schedule, Clients, Finance |
| Услуги и их цены | `src/data/services.json` | Schedule, Settings |
| KPI дашборда | `src/data/dashboard.json` | Dashboard |
| AI-инсайты | `src/data/insights.json` | Dashboard |
| Базу клиентов (60 шт) | `src/data/clients.json` | Clients |
| Записи в журнале | `src/data/appointments.json` | Schedule |
| Диалоги AI-инбокса | `src/data/conversations.json` | Inbox |
| Потерянных клиентов | `src/data/lost_clients.json` | Reactivation |
| Сценарии клиентского чата | `src/data/client_scenarios.json` | Client |
| Программы лояльности | `src/data/loyalty.json` + `certificates.json` + `subscriptions.json` | Loyalty |
| Маркетинговые кампании | `src/data/campaigns.json` | Marketing |
| Склад / расходники | `src/data/inventory.json` | Inventory |
| Финансы (P&L, ЗП) | `src/data/finance.json` + `payroll.json` | Finance |
| Cohort retention | `src/data/cohorts.json` | Analytics |
| Отзывы | `src/data/reviews.json` | Reviews |
| Интеграции | `src/data/integrations.json` | Settings |
| Тексты статусов, сегментов, бейджей | в самих компонентах (.tsx) | UI |
| Логика | компоненты в `src/pages/` и `src/components/` | Поведение |

---

## 1. salon.config.ts — главный файл кастомизации

```typescript
// src/config/salon.config.ts
import type { SalonConfig } from "@/types";

export const salonConfig: SalonConfig = {
  name: "Студия Аура",
  emoji: "💎",
  address: "Москва, ул. Пятницкая, 25",
  phone: "+7 (495) 123-45-67",
  averageCheck: 5990,
  adminSalary: 60000,
  palette: {
    primary: "#B8956A",      // золото
    accent: "#2A2A2A",       // графит
    background: "#FAF7F2",   // кремовый
  },
};
```

**После правки** запусти `npm run dev` — изменения подтянутся, всё перекрасится.

### Палитра

Хорошие пары:
- **Премиум-салон красоты:** `#B8956A` золото + `#2A2A2A` графит + `#FAF7F2` крем (по умолчанию)
- **Стоматология:** `#0072C6` синий медицинский + `#1A1A1A` + `#F4F7FB`
- **Фитнес:** `#FF5A1F` оранж + `#0F1419` + `#FAFAFA`
- **Барбершоп:** `#8B5A2B` коричневый + `#1A1A1A` + `#F5F2EE`
- **Медцентр:** `#00A693` бирюза + `#1A2B3C` + `#F8FAFA`
- **Автосервис:** `#E63946` красный + `#1D3557` + `#F1FAEE`

Проверь контрастность primary с белым текстом — у тёмных оттенков нормально, у светлых нужен тёмный foreground.

---

## 2. Регенерация моков целиком

Если хочешь пересоздать **все моки разом** под новый бизнес, отредактируй два скрипта:

### `scripts/gen-mocks.mjs`
Генерирует базовые моки старой версии: `masters`, `dashboard`, `insights`, `conversations`, `lost_clients`, `client_scenarios`.

### `scripts/gen-mocks-extra.mjs`
Генерирует расширенные моки: `services`, `clients`, `appointments`, `loyalty`, `certificates`, `subscriptions`, `campaigns`, `inventory`, `payroll`, `finance`, `cohorts`, `reviews`, `integrations`.

После правок запусти:
```bash
node scripts/gen-mocks.mjs
node scripts/gen-mocks-extra.mjs
```

→ Все JSON в `src/data/` будут пересозданы.

---

## 3. Кастомизация по разделам

### 3.1 Сменить специалистов (Masters)

Открой `src/data/masters.json`:

```json
[
  {
    "id": "m1",
    "name": "Алина Сафронова",
    "specialty": ["Стрижки", "Окрашивание", "Мелирование"],
    "revenue": 412000,
    "margin": 0.64,
    "load": 0.89,
    "appointmentsCount": 67,
    "avatar": "АС"
  }
]
```

Для другой ниши просто меняй имена и `specialty`:
- Стоматология: `["Терапия", "Хирургия", "Имплантация"]`
- Фитнес: `["Кардио", "Силовые", "Растяжка"]`
- Авто: `["Двигатель", "Электрика", "Подвеска"]`

Цифры (`revenue`, `margin`, `load`, `appointmentsCount`) можно оставить, но желательно адаптировать порядок к нише (см. `ADAPT_TO_NICHE.md`).

`avatar` — две буквы инициалов. Используется в UI как fallback вместо фото.

### 3.2 Сменить услуги (Services)

`src/data/services.json`:

```json
[
  {
    "id": "s1",
    "name": "Стрижка женская",
    "category": "Парикмахер",
    "price": 3500,
    "duration": 60,
    "cogs": 200
  }
]
```

`cogs` (cost of goods sold) — себестоимость для расчёта маржи в `/settings → услуги`.

### 3.3 Сменить дашборд

`src/data/dashboard.json` — KPI + источники + revenueByDay:

```json
{
  "revenue": 1240000,
  "appointmentsCount": 207,
  "averageCheck": 5990,
  "newClients": 38,
  "deltas": { "revenue": 0.124, "appointmentsCount": 0.082, ... },
  "revenueByDay": [...30 точек...],
  "sources": [
    { "channel": "instagram", "appointmentsCount": 47, "revenue": 281000 },
    ...
  ]
}
```

### 3.4 Сменить AI-инсайты

`src/data/insights.json`:

```json
[
  {
    "id": "i1",
    "title": "Поднять цену на окрашивание на 500 ₽",
    "amountDelta": 18000,
    "reasoning": "Загрузка услуги 89%, ценовая эластичность позволяет",
    "icon": "trending-up"
  }
]
```

Иконки: `"trending-up" | "users" | "mail"`. Если нужны другие — добавь маппинг в `src/components/owner/InsightsList.tsx`.

### 3.5 Сменить базу клиентов

`src/data/clients.json` — 60 объектов. Поля:

```typescript
{
  id, name, phone, avatar, email, birthday,
  firstVisit, lastVisit,
  totalVisits, totalSpent, averageCheck, ltv,
  segment: "vip" | "regular" | "new" | "sleeping" | "lost",
  favoriteMaster, favoriteMasterAvatar,
  preferredServices: ["...","..."],
  bonusBalance, depositBalance,
  notes?, blacklisted?, noShowCount,
  visitHistory: [{ date, service, master, amount, rating? }, ...]
}
```

Для другой ниши проще всего отредактировать **скрипт-генератор** `scripts/gen-mocks-extra.mjs` — там список имён/фамилий и логика сегментации.

### 3.6 Сменить сценарии клиентского чата

`src/data/client_scenarios.json` — самое объёмное. Структура одного сценария:

```json
{
  "id": "booking",
  "title": "Записаться",
  "icon": "calendar-plus",
  "initialMessages": [
    {
      "from": "bot",
      "text": "Привет! Помогу записаться. На какую услугу?",
      "quickReplies": ["Стрижка", "Окрашивание", "Маникюр", "Косметология"]
    }
  ],
  "steps": [
    {
      "trigger": "Стрижка",
      "responses": [
        { "from": "user", "text": "Стрижка" },
        { "from": "bot", "text": "К какому мастеру?", "typingDelay": 1100,
          "quickReplies": ["Алина (зв-чт)", "Полина (пт-сб)"] }
      ]
    },
    {
      "trigger": "Алина (зв-чт)",
      "responses": [
        { "from": "user", "text": "Алина" },
        { "from": "bot", "text": "Алина свободна: завтра 14:30, послезавтра 11:00",
          "typingDelay": 1100,
          "quickReplies": ["Завтра 14:30", "Послезавтра 11:00"] }
      ]
    },
    {
      "trigger": "Завтра 14:30",
      "responses": [
        { "from": "user", "text": "Завтра 14:30" },
        { "from": "bot", "text": "Записываю...", "typingDelay": 1400 },
        { "from": "bot", "text": "Готово! Алина, стрижка, завтра 14:30",
          "confirmCard": { "title": "Запись подтверждена", "details": "Алина · Стрижка · Завтра 14:30" } }
      ]
    }
  ]
}
```

**Логика:**
- `initialMessages` — что бот говорит при старте сценария
- `steps[i].trigger` — текст quick reply, который запускает шаг
- `steps[i].responses` — массив реплик подряд (user + bot + ...)
- `typingDelay` — мс анимации typing-индикатора перед репликой
- `confirmCard` — финальная зелёная карточка, завершает сценарий

### 3.7 Сменить кампании Marketing

`src/data/campaigns.json`. Триггеры:
- `first_visit` — после первого визита
- `birthday` — день рождения
- `after_visit` — после любого визита
- `sleeping_30 / 60 / 90` — спящие
- `anniversary` — годовщина первого визита
- `manual` — ручная отправка

A/B-тест опционален:

```json
"abTest": {
  "variantA": { "name": "Без скидки", "openRate": 0.83, "conversion": 0.31 },
  "variantB": { "name": "Со скидкой 10%", "openRate": 0.87, "conversion": 0.38 },
  "winner": "B"
}
```

### 3.8 Сменить склад

`src/data/inventory.json` — категории и расходники под нишу:

| Ниша | Категории |
|------|-----------|
| Салон красоты | Окрашивание / Уход / Ногти / Косметология / Брови / Ресницы / Расходники |
| Стоматология | Материалы / Импланты / Анестезия / Гигиена / Инструменты |
| Фитнес | Полотенца / Вода / Спортпит (если продаёт) |
| Барбершоп | Бритвы / Лезвия / Полотенца / Уход (для продажи) |
| Авто | Запчасти / Масла / Расходники / Шины |

Поля:
```typescript
{
  id, name, category, unit, // "шт", "тюб", "мл", "уп"
  inStock, parLevel, costPerUnit, monthConsumption,
  expiryDate?, expiringSoon?, lowStock?, supplier?
}
```

### 3.9 Сменить отзывы

`src/data/reviews.json` — структура каждого:
```typescript
{
  id, clientName, clientAvatar,
  rating: 1 | 2 | 3 | 4 | 5,
  text, service, master, date,
  channel: "yandex_maps" | "twogis" | "whatsapp" | "direct" | "google",
  status: "pending_review" | "published" | "needs_response" | "responded",
  aiSuggestedReply?: string  // если есть — AI предложит ответ
}
```

---

## 4. Добавление нового раздела

Пример: добавим раздел **«Подарочные сертификаты — конструктор»** (свой URL `/gifts`).

### Шаг 1. Создай тип (если нужно)
Уже есть `Certificate` в `src/types/index.ts` — можно использовать.

### Шаг 2. Data layer
Уже есть `getCertificates()` в `src/lib/data/index.ts`.

### Шаг 3. Создай страницу
`src/pages/GiftBuilder.tsx`:
```typescript
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function GiftBuilderPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-heading">Конструктор сертификатов</h1>
      <Card className="p-6 space-y-4">
        <Input placeholder="Номинал" defaultValue="5000" />
        <Input placeholder="Кому" defaultValue="Подруге" />
        <Button onClick={() => toast.success("Сертификат создан · ссылка отправлена")}>Создать</Button>
      </Card>
    </div>
  );
}
```

### Шаг 4. Добавь маршрут
В `src/App.tsx`:
```typescript
import { GiftBuilderPage } from "@/pages/GiftBuilder";
// ...
<Route path="/gifts" element={<PageContainer><GiftBuilderPage /></PageContainer>} />
```

### Шаг 5. Пункт в Sidebar
В `src/components/layout/Sidebar.tsx` в массив `sections` добавь:
```typescript
{ to: "/gifts", label: "Конструктор сертификатов", icon: Gift }
```

→ Раздел появится в меню, перейдёт по клику, работает.

---

## 5. Что меняется при смене языка

Тексты — hardcoded в JSX компонентов и в моках. Чтобы поддержать i18n:

1. Установи `react-i18next`
2. Вынеси все строки в `src/locales/ru.json` / `en.json` / `kz.json`
3. Замени `<h1>Дашборд</h1>` → `<h1>{t("dashboard.title")}</h1>`

Моки оставить как есть — это контент, не интерфейс. Локализуй обёртки.

---

## 6. Проверка перед сдачей клиенту

Чек-лист после кастомизации под нового клиента:

- [ ] `salon.config.ts` обновлён — название, телефон, адрес, эмодзи
- [ ] Палитра меняется через DevTools → :root → CSS vars применилась
- [ ] `npm run build` собирает без warnings
- [ ] `npx tsc -b` не выдаёт ошибок
- [ ] Все 13 страниц открываются без 404
- [ ] При F5 на `/clients` страница не падает (SPA-фолбэк в nginx)
- [ ] Переключатель «Владелец / Клиент» работает в обе стороны
- [ ] Состояние роли сохраняется при обновлении (localStorage)
- [ ] Все toast'ы появляются при кликах
- [ ] AI-инсайты на дашборде упоминают **актуальную** для клиента боль (зарплата админа клиента, его кол-во потерянных)
- [ ] В Settings → Интеграции отмечены те, что реально подключены у клиента
- [ ] Лого + эмодзи + цвета соответствуют реальному бренду
- [ ] В `index.html` обновлены `<title>` и meta og:title / og:description
