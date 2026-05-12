# AURA — Демо AI-операционки для сервисного бизнеса

> Кликабельная демонстрация операционки с AI-инбоксом, дашбордом, журналом записи, маркетингом, программами лояльности, складом, финансами, аналитикой и клиентским чатом. 13 разделов, всё кликается, всё работает на типизированных моках.
>
> **Подходит под любую нишу с записью к специалистам** — салон красоты, стоматология, фитнес, барбершоп, медцентр, автосервис, репетитор, ветклиника, тату-салон. Адаптация — 1-2 часа правки одного конфига + моков. Готовые конфиги под 6 ниш есть в [docs/ADAPT_TO_NICHE.md](docs/ADAPT_TO_NICHE.md).

**Демо:** https://ai-for-expert.ru/aura/
**Стек:** React 19 + Vite + TypeScript + Tailwind + shadcn-style + Recharts + framer-motion
**Бэкенда нет** — всё на JSON-моках через типизированный data layer.

![Stack](https://img.shields.io/badge/stack-React%20%2B%20Vite%20%2B%20TS%20%2B%20Tailwind-B8956A?style=flat-square)
![Sections](https://img.shields.io/badge/sections-13-2A2A2A?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-2A2A2A?style=flat-square)

---

## 📚 Документация

| Документ | О чём |
|----------|-------|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Архитектура: структура проекта, жизненный цикл данных, role context, роутинг, дизайн-система, взаимосвязи |
| [docs/FEATURES.md](docs/FEATURES.md) | Каталог всех 13 разделов — что моки, какие кнопки, какие связи |
| [docs/CUSTOMIZATION.md](docs/CUSTOMIZATION.md) | Кастомизация: палитра, моки, новый раздел, локализация, чек-лист |
| [docs/ADAPT_TO_NICHE.md](docs/ADAPT_TO_NICHE.md) | **6 готовых конфигов**: стоматология, фитнес, барбершоп, медцентр, автосервис, школа английского |

Сначала открой [ARCHITECTURE.md](docs/ARCHITECTURE.md) — там карта проекта и принципы. Потом [FEATURES.md](docs/FEATURES.md) — что есть в каждом разделе. Когда соберёшься продавать клиенту — [ADAPT_TO_NICHE.md](docs/ADAPT_TO_NICHE.md).

---

## Что внутри (13 разделов)

### 📊 Управление
- **Дашборд (`/`)** — KPI, график выручки за 30 дней, рейтинг мастеров по марже (с подсветкой убыточного), 3 AI-инсайта в ₽
- **Журнал записи (`/schedule`)** — календарь 4 мастера × 11 часов, цветные блоки по статусу (confirmed/pending/completed/no_show), детальный sheet с записью + AI-помощником
- **Клиенты (`/clients`)** — 60 клиентов с сегментацией (VIP/Постоянный/Спящий/Потерян), LTV, история визитов, любимый мастер, бонусы, чёрный список

### 🤖 AI & Маркетинг
- **AI-Инбокс (`/inbox`)** — 12 диалогов из WhatsApp/Instagram/Telegram с раскрытием полной переписки
- **Возврат клиентов (`/reactivation`)** — 47 потерянных клиентов в 3 сегментах + диалог с превью рассылки + тост результата
- **Маркетинг (`/marketing`)** — 7 триггерных кампаний (welcome/birthday/sleeping 30-60-90), **A/B-тесты**, статистика выручки
- **Отзывы (`/reviews`)** — AI-фильтр негатива до публикации, автоответы ≥4★, шаблоны ответов от AI для негатива

### 💰 Финансы и склад
- **Лояльность (`/loyalty`)** — 4 программы (кэшбэк/депозит+15%/сертификаты/абонементы) + 15 сертификатов + 12 активных абонементов с прогрессом
- **Финансы (`/finance`)** — P&L (выручка / расходы / прибыль / прогноз), cashflow, structure pie, **ведомость зарплаты с кнопкой «Выплатить»**, выгрузка в 1С
- **Склад (`/inventory`)** — 15 SKU, прогресс-бары остатков, метки low-stock/expiring, par-level, автосписание, AI-заказы у поставщика
- **Аналитика (`/analytics`)** — cohort retention heatmap 8×8, LTV buckets, ABC-сегментация, источники выручки, **Health Radar**

### ⚙️ Прочее
- **Настройки (`/settings`)** — 6 вкладок: салон / услуги (с маржой) / мастера / **AI-бот (7 правил)** / уведомления / **12 интеграций** (WhatsApp/Instagram/Telegram/1С/Сбер/Яндекс.Карты/2ГИС/...)

### 📱 Клиентская роль
- **Клиентский чат (`/client`)** — мобильный mockup в рамке iPhone, 4 интерактивных сценария (запись / перенос / реактивация / FAQ), typing-индикатор, confirm-карточки

---

## Быстрый старт

```bash
git clone https://github.com/dmianufriev/aura.git
cd aura
npm install
npm run dev
```

Откроется на http://localhost:5173. По умолчанию — роль «Владелец», дашборд. Переключатель ролей сверху справа.

---

## Кастомизация под клиента (~20 минут)

**Шаг 1.** `src/config/salon.config.ts` — название, эмодзи, адрес, телефон, палитра:

```ts
export const salonConfig: SalonConfig = {
  name: "Клиника Dental Pro",
  emoji: "🦷",
  address: "Москва, Кутузовский 36",
  phone: "+7 (495) 555-77-88",
  averageCheck: 18500,
  adminSalary: 75000,
  palette: {
    primary: "#0072C6",
    accent: "#1A2B3C",
    background: "#F4F7FB",
  },
};
```

Палитра автоматически применяется через CSS-переменные ко всему UI — кнопки, бейджи, графики Recharts.

**Шаг 2.** Подправь моки в `src/data/` под нишу клиента (см. [docs/CUSTOMIZATION.md](docs/CUSTOMIZATION.md) и [docs/ADAPT_TO_NICHE.md](docs/ADAPT_TO_NICHE.md)).

**Шаг 3.** Регенерация моков (опционально, если хочешь перегенерировать всё разом):
```bash
node scripts/gen-mocks.mjs        # masters, dashboard, insights, conversations, lost_clients, scenarios
node scripts/gen-mocks-extra.mjs  # services, clients, appointments, loyalty, certs, subs, campaigns, inventory, payroll, finance, cohorts, reviews, integrations
```

**Шаг 4.** Билд и деплой:
```bash
VITE_BASE=/aura/ npm run build
rsync -av dist/ root@VPS:/var/www/aura/
```

---

## Адаптация под другую нишу — готовые конфиги

В [docs/ADAPT_TO_NICHE.md](docs/ADAPT_TO_NICHE.md) лежат **готовые блоки `salon.config.ts` + `masters.json` + `services.json` + специфичные AI-инсайты** под 6 ниш:

| Ниша | Эмодзи | Палитра | Особенности |
|------|--------|---------|-------------|
| 🦷 Стоматология | синий медицинский | Депозиты, медкарта, окно возврата 6 мес |
| 💪 Фитнес-клуб | оранжевый | Абонементы как основной продукт, групповые тренировки |
| 💈 Барбершоп | коричневый | Цикл возврата 3-4 нед, чаевые |
| 🏥 Медцентр | бирюзовый | Страховые ДМС, диспансеризация, профосмотры |
| 🔧 Автосервис | красный | Машины клиента, шиномонтаж сезонный, ТО по пробегу |
| 📚 Репетитор / школа | фиолетовый | Уровни студента, прогресс по программе, конверсия с пробного |

Можно использовать как шаблоны под другие ниши — медцентр → ветклиника → массажный салон → психолог → юрист → бухгалтерское обслуживание.

---

## Деплой на VPS

### Вариант А: путь на существующем домене (`https://example.ru/aura/`)
```bash
VITE_BASE=/aura/ npm run build
rsync -av dist/ root@VPS:/var/www/aura/
```
+ блок `location /aura/` из [deploy/nginx-path.conf.example](deploy/nginx-path.conf.example) в существующий nginx-конфиг.

### Вариант Б: поддомен (`aura.example.ru`)
1. DNS A-запись `aura.example.ru` → IP сервера
2. `VITE_BASE=/ npm run build && rsync -av dist/ root@VPS:/var/www/aura/`
3. Шаблон [deploy/nginx-subdomain.conf.example](deploy/nginx-subdomain.conf.example) в `sites-available`
4. `certbot --nginx -d aura.example.ru`

### Готовый скрипт
```bash
SSH_TARGET=server2 VITE_BASE_PATH=/aura/ bash deploy/deploy.sh
```

---

## Скрипты

| Команда | Что делает |
|---------|-----------|
| `npm run dev` | Разработка на http://localhost:5173 |
| `npm run build` | Production-сборка в `dist/` (используй `VITE_BASE=/aura/` для path-деплоя) |
| `npm run preview` | Локальный просмотр продакшен-сборки |
| `node scripts/gen-mocks.mjs` | Пересоздать базовые моки (dashboard, masters, insights, ...) |
| `node scripts/gen-mocks-extra.mjs` | Пересоздать расширенные моки (clients, finance, inventory, ...) |
| `bash deploy/deploy.sh` | Билд + загрузка на сервер по SSH |

---

## Минимальная структура

```
aura/
├── src/
│   ├── config/salon.config.ts        # ⚡ Единственный файл для брендинга
│   ├── data/                         # 19 JSON-моков
│   ├── lib/data/index.ts             # 22 async-функции getX()
│   ├── types/index.ts                # Все типы
│   ├── contexts/RoleContext.tsx      # useRole() + localStorage
│   ├── components/
│   │   ├── ui/                       # Button, Card, Tabs, Dialog, Sheet, ...
│   │   ├── layout/                   # Header, Sidebar, PhoneFrame
│   │   ├── owner/                    # KPI, RevenueChart, MastersTable, ...
│   │   └── client/                   # ChatContainer, ChatMessage, ...
│   ├── pages/                        # 13 страниц
│   └── App.tsx                       # Router + RoleProvider + Layout
├── scripts/
│   ├── gen-mocks.mjs
│   └── gen-mocks-extra.mjs
├── deploy/
│   ├── nginx-subdomain.conf.example
│   ├── nginx-path.conf.example
│   └── deploy.sh
├── docs/                             # ← Документация
│   ├── ARCHITECTURE.md
│   ├── FEATURES.md
│   ├── CUSTOMIZATION.md
│   └── ADAPT_TO_NICHE.md
└── package.json, vite.config.ts, tailwind.config.js, tsconfig*.json
```

---

## Зачем это нужно (бизнес-смысл)

Это **демо для продажи внедрения**. Реальный сервисный бизнес (салон, клиника, фитнес) платит **100-150к разово** за форк + кастомизацию под себя + интеграции с реальной CRM/мессенджерами + деплой. Окупаемость для клиента — 2.5 месяца только на зарплате администратора, которого заменяет AI-инбокс.

**Угол атаки против YClients/Altegio/DIKIDI** (рыночные лидеры):
- 🔥 Маржа по мастеру — никто из CRM не считает реальную прибыль с учётом расходников
- 🔥 AI-инбокс с ответами в WhatsApp — у YClients нет, у Беауи-Бот есть только рассылки
- 🔥 Автовозврат спящих с конкретными ₽ — у других есть как «программа лояльности», а не как трекаемая воронка
- 🔥 Готовые AI-инсайты «сделай X — получишь Y ₽» вместо просто графиков

**Подробнее** — в [docs/FEATURES.md](docs/FEATURES.md) (раздел «Маршрут пользователя на демо»).

---

## Лицензия

MIT — бери, форкай, продавай клиентам. Атрибуция приветствуется, но не обязательна.

Шаблон создан как демо-кейс операционки для сервисных бизнесов с записью к специалистам.
