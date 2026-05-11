// Генератор детерминированных моков. Запускается один раз для пересборки JSON.
// node scripts/gen-mocks.mjs
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.resolve(__dirname, "..", "src", "data");
mkdirSync(DATA, { recursive: true });

// ---------- Masters ----------
const masters = [
  {
    id: "m1",
    name: "Алина Сафронова",
    specialty: ["Стрижки", "Окрашивание", "Мелирование"],
    revenue: 412000,
    margin: 0.64,
    load: 0.89,
    appointmentsCount: 67,
    avatar: "АС",
  },
  {
    id: "m2",
    name: "Мария Орлова",
    specialty: ["Косметология", "Чистки", "Уходы"],
    revenue: 318000,
    margin: 0.58,
    load: 0.76,
    appointmentsCount: 53,
    avatar: "МО",
  },
  {
    id: "m3",
    name: "Полина Левина",
    specialty: ["Маникюр", "Педикюр", "Дизайн"],
    revenue: 285000,
    margin: 0.51,
    load: 0.82,
    appointmentsCount: 48,
    avatar: "ПЛ",
  },
  {
    id: "m4",
    name: "Катя Романова",
    specialty: ["Брови", "Ресницы"],
    revenue: 225000,
    margin: 0.12,
    load: 0.41,
    appointmentsCount: 39,
    avatar: "КР",
  },
];
writeFileSync(path.join(DATA, "masters.json"), JSON.stringify(masters, null, 2));

// ---------- Dashboard ----------
const totalRev = masters.reduce((s, m) => s + m.revenue, 0);
function seeded(i, mod, base) {
  return base + ((i * 9301 + 49297) % mod);
}
const revenueByDay = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(2026, 3, 11 + i);
  const day = date.getDay();
  const base = day === 0 || day === 6 ? 55000 : 38000;
  const wobble = seeded(i, 18000, 0);
  return {
    date: date.toISOString().slice(0, 10),
    amount: base + wobble,
  };
});
const dashboard = {
  period: "month",
  revenue: totalRev,
  appointmentsCount: masters.reduce((s, m) => s + m.appointmentsCount, 0),
  averageCheck: 5990,
  newClients: 38,
  returningClients: 169,
  deltas: {
    revenue: 0.124,
    appointmentsCount: 0.082,
    averageCheck: 0.041,
    newClients: -0.053,
  },
  revenueByDay,
  sources: [
    { channel: "phone", appointmentsCount: 51, revenue: 309000 },
    { channel: "instagram", appointmentsCount: 47, revenue: 281000 },
    { channel: "whatsapp", appointmentsCount: 38, revenue: 224000 },
    { channel: "recommendations", appointmentsCount: 31, revenue: 186000 },
    { channel: "twogis", appointmentsCount: 22, revenue: 132000 },
    { channel: "yandex_maps", appointmentsCount: 18, revenue: 108000 },
  ],
};
writeFileSync(path.join(DATA, "dashboard.json"), JSON.stringify(dashboard, null, 2));

// ---------- Insights ----------
const insights = [
  {
    id: "i1",
    title: "Поднять цену на окрашивание на 500 ₽",
    amountDelta: 18000,
    reasoning:
      "Загрузка услуги 89%, исторически клиенты не отказывались при росте цены на 5-7%. Ценовая эластичность позволяет.",
    icon: "trending-up",
  },
  {
    id: "i2",
    title: "Перевести 12 ч/нед с Кати на Алину",
    amountDelta: 120000,
    reasoning:
      "У Алины маржа 64% при загрузке 89%, у Кати маржа 12% при загрузке 41%. Перенос часов окупится за 2 недели.",
    icon: "users",
  },
  {
    id: "i3",
    title: "Запустить рассылку 47 пропавшим клиентам",
    amountDelta: 210000,
    reasoning:
      "Среди потерянных — 12 с чеком 8000+ ₽ и стабильной историей. Ожидаемая конверсия возврата 25%.",
    actionLink: "/reactivation",
    actionLabel: "Перейти к рассылке",
    icon: "mail",
  },
];
writeFileSync(path.join(DATA, "insights.json"), JSON.stringify(insights, null, 2));

// ---------- Conversations (12 диалогов) ----------
const conversations = [
  {
    id: "c1",
    clientName: "Анна Петрова",
    clientAvatar: "АП",
    channel: "whatsapp",
    lastMessage: "Можно записаться на стрижку в субботу?",
    lastReply: "Конечно! Алина свободна в субботу с 14:00. Записать?",
    time: "14:32",
    status: "booked",
    messages: [
      { from: "client", text: "Здравствуйте! Можно записаться на стрижку в субботу?", time: "14:30" },
      { from: "ai", text: "Привет, Анна! Конечно. К Алине свободно: 14:00, 16:30, 18:00. Какое время удобно?", time: "14:31" },
      { from: "client", text: "Давайте 14:00", time: "14:32" },
      { from: "ai", text: "Записала вас. Алина, стрижка, суббота 16 мая, 14:00. Напомню накануне 🙂", time: "14:32" },
    ],
  },
  {
    id: "c2",
    clientName: "Ольга Сидорова",
    clientAvatar: "ОС",
    channel: "instagram",
    lastMessage: "Сколько стоит окрашивание длинных волос?",
    lastReply: "От 8500 ₽. Зависит от техники и оттенка. Записать на консультацию?",
    time: "13:18",
    status: "in_progress",
    messages: [
      { from: "client", text: "Сколько стоит окрашивание длинных волос?", time: "13:15" },
      { from: "ai", text: "Окрашивание у нас от 8500 ₽. Зависит от длины, оттенка и техники (балаяж/омбре/тон в тон). Точную цену скажу после короткой консультации — она бесплатна. Записать?", time: "13:18" },
    ],
  },
  {
    id: "c3",
    clientName: "Мария Кузнецова",
    clientAvatar: "МК",
    channel: "telegram",
    lastMessage: "Нужно перенести запись с пятницы на понедельник",
    lastReply: "Готово! Перенесла на понедельник 18 мая, 16:00 к Полине.",
    time: "12:44",
    status: "booked",
    messages: [
      { from: "client", text: "Привет, нужно перенести запись с пятницы на понедельник", time: "12:40" },
      { from: "ai", text: "Здравствуйте, Мария! Вижу вашу запись: маникюр у Полины, пт 15 мая 17:00. На понедельник свободно 11:00, 14:00 и 16:00. Какое подходит?", time: "12:41" },
      { from: "client", text: "16:00", time: "12:43" },
      { from: "ai", text: "Готово! Маникюр у Полины, понедельник 18 мая, 16:00. Жду 💅", time: "12:44" },
    ],
  },
  {
    id: "c4",
    clientName: "Елена Воронова",
    clientAvatar: "ЕВ",
    channel: "whatsapp",
    lastMessage: "А мастер Алина делает мужские стрижки?",
    lastReply: "Нет, у Алины только женские. Мужские — у Дениса, записать?",
    time: "11:58",
    status: "in_progress",
    messages: [
      { from: "client", text: "А мастер Алина делает мужские стрижки?", time: "11:55" },
      { from: "ai", text: "У Алины только женские стрижки. Мужские мы делаем у Дениса — он отлично работает с короткими и фейдами. Записать на этой неделе?", time: "11:58" },
    ],
  },
  {
    id: "c5",
    clientName: "Татьяна Белова",
    clientAvatar: "ТБ",
    channel: "instagram",
    lastMessage: "Хочу записаться к лучшему колористу",
    lastReply: "Лучший колорист — Алина. Завтра 11:00 или послезавтра 15:30?",
    time: "11:12",
    status: "booked",
    messages: [
      { from: "client", text: "Хочу записаться к лучшему колористу!", time: "11:10" },
      { from: "ai", text: "Это Алина — рейтинг 4.9 из 5, специализация: окрашивание и мелирование. Завтра 11:00 или послезавтра 15:30?", time: "11:11" },
      { from: "client", text: "Завтра 11:00 подойдёт", time: "11:12" },
      { from: "ai", text: "Записала! Алина, окрашивание, завтра 11:00. Жду 🌸", time: "11:12" },
    ],
  },
  {
    id: "c6",
    clientName: "Светлана Дроздова",
    clientAvatar: "СД",
    channel: "telegram",
    lastMessage: "Можно ли отменить запись и вернуть предоплату?",
    lastReply: "Передаю администратору, перезвонит в течение 15 минут.",
    time: "10:47",
    status: "needs_human",
    messages: [
      { from: "client", text: "Можно ли отменить запись и вернуть предоплату?", time: "10:45" },
      { from: "ai", text: "Понимаю, Светлана. Этот вопрос решает администратор лично — перезвонит в течение 15 минут с номера +7 (495) 123-45-67. Я уже передала ситуацию.", time: "10:47" },
    ],
  },
  {
    id: "c7",
    clientName: "Виктория Зайцева",
    clientAvatar: "ВЗ",
    channel: "whatsapp",
    lastMessage: "Адрес у вас тот же на Пятницкой?",
    lastReply: "Да, Пятницкая 25, второй этаж. Карта и парковка — здесь...",
    time: "10:14",
    status: "in_progress",
    messages: [
      { from: "client", text: "Адрес у вас тот же на Пятницкой?", time: "10:12" },
      { from: "ai", text: "Да! Москва, Пятницкая 25, 2 этаж. Парковка во дворе, домофон 17. Карта: https://yandex.ru/maps/aura", time: "10:14" },
    ],
  },
  {
    id: "c8",
    clientName: "Наталья Громова",
    clientAvatar: "НГ",
    channel: "instagram",
    lastMessage: "У меня сегодня в 19:00 запись, можно опоздать на 10 минут?",
    lastReply: "Конечно, предупредила Марию. Жду вас!",
    time: "09:58",
    status: "booked",
    messages: [
      { from: "client", text: "У меня сегодня в 19:00 запись, можно опоздать на 10 минут?", time: "09:55" },
      { from: "ai", text: "Конечно, не переживайте. Я уже предупредила Марию — она в курсе. Жду вас в 19:10!", time: "09:58" },
    ],
  },
  {
    id: "c9",
    clientName: "Ирина Лебедева",
    clientAvatar: "ИЛ",
    channel: "whatsapp",
    lastMessage: "Скучаю по вашей Алине, давно не была",
    lastReply: "Алина тоже соскучилась! Дарим вам -15% на возвращение...",
    time: "Вчера",
    status: "booked",
    messages: [
      { from: "client", text: "Скучаю по вашей Алине, давно не была 🙈", time: "вчера 19:00" },
      { from: "ai", text: "Ирина, рады, что написали! Вы у нас не были 71 день. Алина приготовила вам -15% на любую услугу на этой неделе. Записать?", time: "вчера 19:01" },
      { from: "client", text: "Да, на стрижку и тонирование", time: "вчера 19:05" },
      { from: "ai", text: "Записала: Алина, стрижка + тонирование, среда 14 мая, 13:00. Цена со скидкой: 9 350 ₽. Жду! 🌷", time: "вчера 19:06" },
    ],
  },
  {
    id: "c10",
    clientName: "Юлия Морозова",
    clientAvatar: "ЮМ",
    channel: "telegram",
    lastMessage: "А есть свободные окна на завтра вечером?",
    lastReply: "Завтра вечером: Мария 18:00, Полина 19:30. Что выбираете?",
    time: "Вчера",
    status: "in_progress",
    messages: [
      { from: "client", text: "А есть свободные окна на завтра вечером?", time: "вчера 17:30" },
      { from: "ai", text: "Что вас интересует? На завтра вечером свободно: Мария (косметология) 18:00, Полина (маникюр) 19:30. Что подходит?", time: "вчера 17:31" },
    ],
  },
  {
    id: "c11",
    clientName: "Дарья Соколова",
    clientAvatar: "ДС",
    channel: "instagram",
    lastMessage: "Делаете ли вы коррекцию формы бровей нитью?",
    lastReply: "Да, делаем у Кати. Стоимость 1500 ₽, длится 30 мин.",
    time: "Вчера",
    status: "in_progress",
    messages: [
      { from: "client", text: "Делаете ли вы коррекцию формы бровей нитью?", time: "вчера 14:20" },
      { from: "ai", text: "Да, делаем у Кати. Тридинг (нить) — 1500 ₽, длится 30 минут, без боли. Записать на эту неделю?", time: "вчера 14:21" },
    ],
  },
  {
    id: "c12",
    clientName: "Антон Кравцов",
    clientAvatar: "АК",
    channel: "telegram",
    lastMessage: "Дочка хочет наращивание ресниц на выпускной",
    lastReply: "У Кати свободно за день до выпускного — записать?",
    time: "2 дня назад",
    status: "needs_human",
    messages: [
      { from: "client", text: "Дочка хочет наращивание ресниц на выпускной 23 мая. Поможете?", time: "9 мая, 11:00" },
      { from: "ai", text: "Конечно! Лучше всего сделать за 1-2 дня. У Кати свободно 22 мая в 12:00 и 16:00. Какое подходит?", time: "9 мая, 11:02" },
      { from: "client", text: "Ей 16, можно ли без родителя?", time: "9 мая, 11:05" },
      { from: "ai", text: "По нашим правилам — с 16 лет можно без родителя, но нужно подтверждение от вас в письменной форме при первом визите. Передаю администратору, он уточнит детали.", time: "9 мая, 11:06" },
    ],
  },
];
writeFileSync(path.join(DATA, "conversations.json"), JSON.stringify(conversations, null, 2));

// ---------- Lost Clients (47) ----------
const firstNames = [
  "Анна","Мария","Ольга","Татьяна","Светлана","Ирина","Юлия","Дарья",
  "Алёна","Виктория","Наталья","Екатерина","Елена","Лариса","Полина","Кристина",
  "Ксения","Анастасия","Софья","Алина","Александра","Валентина","Надежда","Лидия",
  "Зоя","Ангелина","Маргарита","Любовь","Галина","Раиса","Зинаида","Тамара",
  "Вероника","Карина","Эльвира","Алла","Нина","Лилия","Жанна","Стелла",
  "Регина","Эльмира","Дина","Инна","Майя","Снежана","Виолетта"
];
const surnames = [
  "Петрова","Иванова","Сидорова","Смирнова","Кузнецова","Попова","Соколова","Лебедева",
  "Козлова","Новикова","Морозова","Волкова","Соловьёва","Васильева","Зайцева","Павлова",
  "Семёнова","Голубева","Виноградова","Богданова","Воробьёва","Фёдорова","Михайлова","Беляева",
  "Тарасова","Белова","Комарова","Орлова","Киселёва","Макарова","Андреева","Ковалёва",
  "Ильина","Гусева","Титова","Кудрявцева","Баранова","Куликова","Алексеева","Степанова",
  "Яковлева","Сорокина","Сергеева","Романова","Захарова","Борисова","Королёва"
];
const services = [
  { name: "Окрашивание", check: 8500 },
  { name: "Стрижка", check: 3500 },
  { name: "Маникюр", check: 2800 },
  { name: "Косметология", check: 6500 },
  { name: "Брови", check: 2000 },
  { name: "Мелирование", check: 12000 },
  { name: "Укладка", check: 1800 },
  { name: "Педикюр", check: 3200 },
];
function msg30(name) {
  return `${name}, давно вас не было ✨ Записать вас к Алине на стрижку на этой неделе?`;
}
function msg60(name) {
  return `${name}, прошло 2 месяца с последнего визита. Дарим скидку 15% на любую услугу до пятницы — записать?`;
}
function msg90(name) {
  return `${name}, скучаем 💔 Возвращайтесь — для вас 20% от общего чека на этой неделе.`;
}
const lostClients = [];
// 12 в 30+
for (let i = 0; i < 12; i++) {
  const name = `${firstNames[i]} ${surnames[i]}`;
  const svc = services[i % services.length];
  lostClients.push({
    id: `lc${i + 1}`,
    name,
    lastService: svc.name,
    daysSinceLastVisit: 32 + (i % 25),
    averageCheck: svc.check,
    recommendedMessage: msg30(firstNames[i]),
    segment: "30+",
  });
}
// 19 в 60+
for (let i = 12; i < 31; i++) {
  const name = `${firstNames[i]} ${surnames[i]}`;
  const svc = services[i % services.length];
  lostClients.push({
    id: `lc${i + 1}`,
    name,
    lastService: svc.name,
    daysSinceLastVisit: 62 + ((i - 12) % 25),
    averageCheck: svc.check,
    recommendedMessage: msg60(firstNames[i]),
    segment: "60+",
  });
}
// 16 в 90+
for (let i = 31; i < 47; i++) {
  const name = `${firstNames[i]} ${surnames[i]}`;
  const svc = services[i % services.length];
  lostClients.push({
    id: `lc${i + 1}`,
    name,
    lastService: svc.name,
    daysSinceLastVisit: 92 + ((i - 31) % 60),
    averageCheck: svc.check,
    recommendedMessage: msg90(firstNames[i]),
    segment: "90+",
  });
}
writeFileSync(path.join(DATA, "lost_clients.json"), JSON.stringify(lostClients, null, 2));

// ---------- Client Scenarios ----------
const scenarios = [
  {
    id: "booking",
    title: "Записаться",
    icon: "calendar-plus",
    initialMessages: [
      { from: "bot", text: "Привет, Аня! Это бот Студии Аура 💎 Помогу записаться. На какую услугу?", quickReplies: ["Стрижка", "Окрашивание", "Маникюр", "Косметология"] },
    ],
    steps: [
      {
        trigger: "Стрижка",
        responses: [
          { from: "user", text: "Стрижка" },
          { from: "bot", text: "Отлично! К кому записать?", typingDelay: 1100, quickReplies: ["Алина (зв-чт)", "Полина (пт-сб)"] },
        ],
      },
      {
        trigger: "Окрашивание",
        responses: [
          { from: "user", text: "Окрашивание" },
          { from: "bot", text: "Окрашивание — наш топ. К Алине свободно: завтра 11:00, среда 14:30, пятница 16:00. Что выбираете?", typingDelay: 1300, quickReplies: ["Завтра 11:00", "Среда 14:30", "Пятница 16:00"] },
        ],
      },
      {
        trigger: "Маникюр",
        responses: [
          { from: "user", text: "Маникюр" },
          { from: "bot", text: "Маникюр у Полины: завтра 12:00, среда 18:30, четверг 11:00. Какое время?", typingDelay: 1100, quickReplies: ["Завтра 12:00", "Среда 18:30", "Четверг 11:00"] },
        ],
      },
      {
        trigger: "Косметология",
        responses: [
          { from: "user", text: "Косметология" },
          { from: "bot", text: "Мария — наш косметолог. Какая процедура: чистка, увлажнение или пилинг?", typingDelay: 1100, quickReplies: ["Чистка", "Увлажнение", "Пилинг"] },
        ],
      },
      {
        trigger: "Алина (зв-чт)",
        responses: [
          { from: "user", text: "Алина" },
          { from: "bot", text: "Алина свободна: завтра 14:30, послезавтра 11:00, послезавтра 16:00. Что подходит?", typingDelay: 1100, quickReplies: ["Завтра 14:30", "Послезавтра 11:00", "Послезавтра 16:00"] },
        ],
      },
      {
        trigger: "Полина (пт-сб)",
        responses: [
          { from: "user", text: "Полина" },
          { from: "bot", text: "Полина свободна: пятница 12:00, суббота 11:00, суббота 15:00.", typingDelay: 1000, quickReplies: ["Пятница 12:00", "Суббота 11:00", "Суббота 15:00"] },
        ],
      },
      {
        trigger: "Завтра 14:30",
        responses: [
          { from: "user", text: "Завтра 14:30" },
          { from: "bot", text: "Записываю вас...", typingDelay: 1400 },
          { from: "bot", text: "Готово! Алина, стрижка женская, завтра 14:30. Адрес: Пятницкая 25, 2 этаж. Напомню за 2 часа 🌷",
            confirmCard: { title: "Запись подтверждена", details: "Алина · Стрижка · Завтра 14:30 · Пятницкая 25" } },
        ],
      },
      {
        trigger: "Завтра 11:00",
        responses: [
          { from: "user", text: "Завтра 11:00" },
          { from: "bot", text: "Записываю...", typingDelay: 1200 },
          { from: "bot", text: "Готово! Алина, окрашивание, завтра 11:00. Жду! 🌸",
            confirmCard: { title: "Запись подтверждена", details: "Алина · Окрашивание · Завтра 11:00" } },
        ],
      },
      {
        trigger: "Завтра 12:00",
        responses: [
          { from: "user", text: "Завтра 12:00" },
          { from: "bot", text: "Записываю...", typingDelay: 1100 },
          { from: "bot", text: "Готово! Полина, маникюр, завтра 12:00 💅",
            confirmCard: { title: "Запись подтверждена", details: "Полина · Маникюр · Завтра 12:00" } },
        ],
      },
      {
        trigger: "Чистка",
        responses: [
          { from: "user", text: "Чистка" },
          { from: "bot", text: "Мария свободна: завтра 13:00, четверг 17:00.", typingDelay: 1100, quickReplies: ["Завтра 13:00", "Четверг 17:00"] },
        ],
      },
      {
        trigger: "Завтра 13:00",
        responses: [
          { from: "user", text: "Завтра 13:00" },
          { from: "bot", text: "Записываю...", typingDelay: 1100 },
          { from: "bot", text: "Готово! Мария, чистка, завтра 13:00. До встречи!",
            confirmCard: { title: "Запись подтверждена", details: "Мария · Чистка · Завтра 13:00" } },
        ],
      },
    ],
  },
  {
    id: "reschedule",
    title: "Перенести",
    icon: "calendar-clock",
    initialMessages: [
      { from: "bot", text: "Найду вашу запись... Вижу: Алина, стрижка, завтра 14:30. На какой день перенести?", typingDelay: 900, quickReplies: ["Среда 16:00", "Пятница 11:00", "Суббота 14:00"] },
    ],
    steps: [
      {
        trigger: "Среда 16:00",
        responses: [
          { from: "user", text: "Среда 16:00" },
          { from: "bot", text: "Переношу...", typingDelay: 1100 },
          { from: "bot", text: "Готово! Алина, стрижка, среда 14 мая, 16:00. Старая запись отменена.",
            confirmCard: { title: "Запись перенесена", details: "Алина · Среда 14 мая · 16:00" } },
        ],
      },
      {
        trigger: "Пятница 11:00",
        responses: [
          { from: "user", text: "Пятница 11:00" },
          { from: "bot", text: "Переношу...", typingDelay: 1100 },
          { from: "bot", text: "Готово! Алина, стрижка, пятница 16 мая, 11:00.",
            confirmCard: { title: "Запись перенесена", details: "Алина · Пятница 16 мая · 11:00" } },
        ],
      },
      {
        trigger: "Суббота 14:00",
        responses: [
          { from: "user", text: "Суббота 14:00" },
          { from: "bot", text: "Переношу...", typingDelay: 1100 },
          { from: "bot", text: "Готово! Алина, стрижка, суббота 17 мая, 14:00.",
            confirmCard: { title: "Запись перенесена", details: "Алина · Суббота 17 мая · 14:00" } },
        ],
      },
    ],
  },
  {
    id: "reactivation",
    title: "Напоминание",
    icon: "bell",
    initialMessages: [
      { from: "bot", text: "Аня, давно вас не было 💔 (последний визит — 67 дней назад)" },
      { from: "bot", text: "Алина приготовила вам -15% на возвращение. Записать?", quickReplies: ["Да, к Алине", "Покажи свободные окна", "Не сейчас"] },
    ],
    steps: [
      {
        trigger: "Да, к Алине",
        responses: [
          { from: "user", text: "Да, к Алине" },
          { from: "bot", text: "Свободно: завтра 11:00, среда 14:30, пятница 16:00.", typingDelay: 1100, quickReplies: ["Завтра 11:00", "Среда 14:30", "Пятница 16:00"] },
        ],
      },
      {
        trigger: "Покажи свободные окна",
        responses: [
          { from: "user", text: "Покажи свободные окна" },
          { from: "bot", text: "Алина: завтра 11:00, среда 14:30. Полина: четверг 13:00. Мария: вторник 17:00.", typingDelay: 1200, quickReplies: ["Завтра 11:00 (Алина)", "Четверг 13:00 (Полина)"] },
        ],
      },
      {
        trigger: "Завтра 11:00",
        responses: [
          { from: "user", text: "Завтра 11:00" },
          { from: "bot", text: "Записываю со скидкой 15%...", typingDelay: 1300 },
          { from: "bot", text: "Готово! Алина, завтра 11:00, цена со скидкой. Жду 🌷",
            confirmCard: { title: "Возвращение оформлено", details: "Алина · Завтра 11:00 · −15%" } },
        ],
      },
      {
        trigger: "Среда 14:30",
        responses: [
          { from: "user", text: "Среда 14:30" },
          { from: "bot", text: "Записываю со скидкой...", typingDelay: 1300 },
          { from: "bot", text: "Готово! Алина, среда 14 мая, 14:30. С возвращением!",
            confirmCard: { title: "Возвращение оформлено", details: "Алина · Среда 14:30 · −15%" } },
        ],
      },
      {
        trigger: "Не сейчас",
        responses: [
          { from: "user", text: "Не сейчас" },
          { from: "bot", text: "Поняла. Скидка действует до пятницы — напомню в среду. Хорошего дня! 🌸" },
        ],
      },
    ],
  },
  {
    id: "faq",
    title: "Вопросы",
    icon: "help-circle",
    initialMessages: [
      { from: "bot", text: "Спрашивайте что угодно — отвечу за секунду 🙂", quickReplies: ["Цены", "Часы работы", "Адрес", "Свободно завтра?"] },
    ],
    steps: [
      {
        trigger: "Цены",
        responses: [
          { from: "user", text: "Цены" },
          { from: "bot", text: "Топ услуги:\n• Стрижка — от 3 500 ₽\n• Окрашивание — от 8 500 ₽\n• Маникюр — от 2 800 ₽\n• Косметология — от 6 500 ₽", typingDelay: 900, quickReplies: ["Записаться", "Часы работы", "Адрес"] },
        ],
      },
      {
        trigger: "Часы работы",
        responses: [
          { from: "user", text: "Часы работы" },
          { from: "bot", text: "Пн-Сб: 10:00–21:00\nВс: 11:00–20:00", typingDelay: 800, quickReplies: ["Адрес", "Свободно завтра?", "Записаться"] },
        ],
      },
      {
        trigger: "Адрес",
        responses: [
          { from: "user", text: "Адрес" },
          { from: "bot", text: "Москва, Пятницкая 25, 2 этаж 📍 Метро Третьяковская, 4 мин пешком. Парковка во дворе, домофон 17.", typingDelay: 900, quickReplies: ["Свободно завтра?", "Записаться"] },
        ],
      },
      {
        trigger: "Свободно завтра?",
        responses: [
          { from: "user", text: "Свободно завтра?" },
          { from: "bot", text: "Завтра свободно:\n• Алина: 11:00, 14:30, 18:00\n• Мария: 13:00, 17:00\n• Полина: 12:00\n• Катя: 15:00, 19:00", typingDelay: 1000, quickReplies: ["Записаться", "Цены"] },
        ],
      },
      {
        trigger: "Записаться",
        responses: [
          { from: "user", text: "Записаться" },
          { from: "bot", text: "Переключаю на сценарий записи. Жмите чип «Записаться» сверху 👆", typingDelay: 800 },
        ],
      },
    ],
  },
];
writeFileSync(path.join(DATA, "client_scenarios.json"), JSON.stringify(scenarios, null, 2));

console.log("✅ Mocks generated in src/data/");
console.log(`   masters: ${masters.length}, lost: ${lostClients.length}, conversations: ${conversations.length}, scenarios: ${scenarios.length}`);
