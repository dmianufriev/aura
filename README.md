# AURA — Демо AI-операционки для салона красоты

> Кликабельный сайт-демо, который за 90 секунд показывает владельцу салона: AI отвечает в директе и WhatsApp, считает прибыль по мастерам и сам возвращает потерянных клиентов. Открой → пройди сценарий «Владелец → Клиент» → форкни и продай за 150к.

**Демо:** https://ai-for-expert.ru/aura/

![AURA preview](https://img.shields.io/badge/stack-React%20%2B%20Vite%20%2B%20TS%20%2B%20Tailwind-B8956A?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-2A2A2A?style=flat-square)

---

## Что внутри

- 📊 **Дашборд владельца** — KPI, график выручки, рейтинг мастеров по марже (с подсветкой убыточного)
- 💡 **3 AI-инсайта** с конкретными суммами «сделай X → получишь Y ₽»
- 📨 **AI-Инбокс** — 12 диалогов из WhatsApp / Instagram / Telegram, AI отвечает сам
- 🔄 **Возврат клиентов** — 47 потерявшихся клиентов + рассылка с превью и тостом результата
- 📱 **Роль «Клиент»** — мобильный чат-mockup с 4 сценариями (запись / перенос / реактивация / FAQ)

**Стек:** React 19 + Vite + TypeScript + Tailwind + кастомные shadcn-style компоненты + Recharts + framer-motion.
**Бэкенда нет** — всё работает на типизированных моковых JSON.

---

## Быстрый старт

```bash
git clone https://github.com/dmianufriev/aura.git
cd aura
npm install
npm run dev
```

Откроется на http://localhost:5173

---

## Кастомизация под клиента (~20 минут)

**Шаг 1.** Открой `src/config/salon.config.ts` — поменяй название, эмодзи, адрес, телефон, палитру.

```ts
export const salonConfig: SalonConfig = {
  name: "Салон вашего клиента",
  emoji: "✨",
  address: "Город, улица, дом",
  phone: "+7 (XXX) XXX-XX-XX",
  averageCheck: 7000,
  adminSalary: 65000,
  palette: {
    primary: "#C04A6B",     // основной акцент
    accent: "#1A1A1A",      // тексты
    background: "#FCF6F0",  // фон
  },
};
```

Палитра применяется через CSS-переменные — Tailwind-конфиг трогать не нужно.

**Шаг 2.** Подправь моковые данные в `src/data/`:

- `masters.json` — имена и цифры мастеров (можно взять из CRM клиента)
- `dashboard.json` — выручка, источники, точки графика
- `insights.json` — 3 AI-инсайта с суммами
- `conversations.json` — 12 диалогов для инбокса
- `lost_clients.json` — потерянные клиенты (47 шт)
- `client_scenarios.json` — 4 сценария мобильного чата

Структуры зафиксированы в `src/types/index.ts`. Можно пересоздать всё разом из шаблона: `node scripts/gen-mocks.mjs`.

**Шаг 3.** Запусти dev и проверь — `npm run dev`. Когда всё ок:

```bash
npm run build       # → dist/
```

---

## Деплой на VPS

### Вариант А: поддомен (например, `aura.example.ru`)

1. В DNS добавь A-запись `aura.example.ru` → IP сервера.
2. На сервере: `mkdir -p /var/www/aura`
3. Локально: `VITE_BASE=/ npm run build && rsync -av dist/ root@VPS:/var/www/aura/`
4. Возьми `deploy/nginx-subdomain.conf.example`, замени домен, положи в sites-available и активируй. Затем `certbot --nginx -d aura.example.ru`.

### Вариант Б: путь на существующем домене (`https://example.ru/aura/`)

```bash
VITE_BASE=/aura/ npm run build
rsync -av dist/ root@VPS:/var/www/aura/
```

В конфиг nginx своего домена добавь блок из `deploy/nginx-path.conf.example`.

### Готовый скрипт

`deploy/deploy.sh` собирает с указанным base и заливает по SSH alias:

```bash
SSH_TARGET=server2 VITE_BASE_PATH=/aura/ bash deploy/deploy.sh
```

---

## Скрипты

- `npm run dev` — разработка на http://localhost:5173
- `npm run build` — production-сборка в `dist/` (укажи `VITE_BASE=/aura/` для path-деплоя)
- `npm run preview` — локальный просмотр продакшен-сборки
- `node scripts/gen-mocks.mjs` — пересоздать все моковые JSON из шаблона

---

## Структура

```
aura/
├── src/
│   ├── App.tsx                        # Router + RoleProvider + установка CSS-переменных
│   ├── config/salon.config.ts         # ⚡ Единственный файл для форка
│   ├── data/*.json                    # Моки (правят при кастомизации)
│   ├── lib/data/index.ts              # Data layer (Promise + sleep)
│   ├── lib/utils.ts                   # cn, formatCurrency, formatDelta, sleep
│   ├── types/index.ts                 # Все типы
│   ├── contexts/RoleContext.tsx       # useRole() + localStorage
│   ├── components/
│   │   ├── ui/                        # Button, Card, Tabs, Dialog, Sheet, Alert, ...
│   │   ├── layout/                    # Header, PhoneFrame
│   │   ├── owner/                     # KPI, Chart, Masters, Insights, ConversationsList, LostClientsTable, ReactivationDialog
│   │   └── client/                    # ChatContainer (стейт-машина), ChatMessage, QuickReplies, TypingIndicator, ConfirmCard
│   └── pages/                         # Dashboard, Inbox, Reactivation, Client
├── deploy/
│   ├── nginx-subdomain.conf.example
│   ├── nginx-path.conf.example
│   └── deploy.sh
└── scripts/gen-mocks.mjs              # Детерминированный генератор моков
```

---

## Лицензия

MIT — бери, форкай, продавай клиентам. Атрибуция приветствуется, но не обязательна.

Шаблон создан в рамках демо-кейса AI-операционки для салонов красоты.
