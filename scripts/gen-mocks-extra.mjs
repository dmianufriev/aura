// Расширенные моки для всех новых разделов.
// node scripts/gen-mocks-extra.mjs
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.resolve(__dirname, "..", "src", "data");
mkdirSync(DATA, { recursive: true });

const masters = JSON.parse(readFileSync(path.join(DATA, "masters.json"), "utf8"));

const firstNames = [
  "Анна","Мария","Ольга","Татьяна","Светлана","Ирина","Юлия","Дарья",
  "Алёна","Виктория","Наталья","Екатерина","Елена","Лариса","Полина","Кристина",
  "Ксения","Анастасия","Софья","Алина","Александра","Валентина","Надежда","Лидия",
  "Зоя","Ангелина","Маргарита","Любовь","Галина","Раиса","Зинаида","Тамара",
  "Вероника","Карина","Эльвира","Алла","Нина","Лилия","Жанна","Стелла",
  "Регина","Эльмира","Дина","Инна","Майя","Снежана","Виолетта","Юлиана",
  "Карина","Альбина","Тамила","Эвелина","Влада","Ника","Мирослава","Илона"
];
const surnames = [
  "Петрова","Иванова","Сидорова","Смирнова","Кузнецова","Попова","Соколова","Лебедева",
  "Козлова","Новикова","Морозова","Волкова","Соловьёва","Васильева","Зайцева","Павлова",
  "Семёнова","Голубева","Виноградова","Богданова","Воробьёва","Фёдорова","Михайлова","Беляева",
  "Тарасова","Белова","Комарова","Орлова","Киселёва","Макарова","Андреева","Ковалёва",
  "Ильина","Гусева","Титова","Кудрявцева","Баранова","Куликова","Алексеева","Степанова",
  "Яковлева","Сорокина","Сергеева","Романова","Захарова","Борисова","Королёва","Гончарова",
  "Никитина","Антонова","Богачёва","Калинина","Воронова","Ширяева","Митрофанова","Симакова"
];
const initials = (n) => n.split(" ").map((s) => s[0]).join("");

const services = [
  { id: "s1", name: "Стрижка женская", category: "Парикмахер", price: 3500, duration: 60, cogs: 200 },
  { id: "s2", name: "Окрашивание", category: "Парикмахер", price: 8500, duration: 120, cogs: 1800 },
  { id: "s3", name: "Мелирование", category: "Парикмахер", price: 12000, duration: 180, cogs: 2400 },
  { id: "s4", name: "Укладка", category: "Парикмахер", price: 1800, duration: 45, cogs: 150 },
  { id: "s5", name: "Маникюр классический", category: "Ногти", price: 2800, duration: 60, cogs: 250 },
  { id: "s6", name: "Маникюр с покрытием", category: "Ногти", price: 3500, duration: 90, cogs: 400 },
  { id: "s7", name: "Педикюр", category: "Ногти", price: 3200, duration: 75, cogs: 300 },
  { id: "s8", name: "Чистка лица", category: "Косметология", price: 6500, duration: 90, cogs: 900 },
  { id: "s9", name: "Пилинг", category: "Косметология", price: 5500, duration: 60, cogs: 800 },
  { id: "s10", name: "Коррекция бровей", category: "Брови и ресницы", price: 2000, duration: 30, cogs: 100 },
  { id: "s11", name: "Окрашивание бровей", category: "Брови и ресницы", price: 1500, duration: 30, cogs: 80 },
  { id: "s12", name: "Наращивание ресниц", category: "Брови и ресницы", price: 4500, duration: 120, cogs: 600 },
];
writeFileSync(path.join(DATA, "services.json"), JSON.stringify(services, null, 2));

// ----- Clients (60 шт) -----
function seg(i) {
  if (i % 13 === 0) return "vip";
  if (i % 7 === 0) return "lost";
  if (i % 5 === 0) return "sleeping";
  if (i % 4 === 0) return "new";
  return "regular";
}
const today = new Date(2026, 4, 11);
function daysAgo(d) {
  const t = new Date(today);
  t.setDate(t.getDate() - d);
  return t.toISOString().slice(0, 10);
}
const allClients = [];
for (let i = 0; i < 60; i++) {
  const fn = firstNames[i % firstNames.length];
  const sn = surnames[i % surnames.length];
  const name = `${fn} ${sn}`;
  const totalVisits = 1 + ((i * 7) % 32);
  const averageCheck = 2800 + ((i * 311) % 9000);
  const totalSpent = totalVisits * averageCheck;
  const segment = seg(i);
  const ageDays =
    segment === "vip" ? 6 :
    segment === "regular" ? 18 + (i % 12) :
    segment === "new" ? 4 + (i % 12) :
    segment === "sleeping" ? 45 + ((i * 3) % 25) :
    segment === "lost" ? 92 + ((i * 11) % 90) : 30;
  const fav = masters[i % masters.length];
  const services2 = [
    services[i % services.length].name,
    services[(i + 3) % services.length].name,
  ];
  allClients.push({
    id: `cl${i + 1}`,
    name,
    phone: `+7 (9${(10 + (i % 89)).toString().padStart(2, "0")}) ${(100 + i * 7).toString().slice(-3)}-${(10 + i * 13).toString().slice(-2)}-${(10 + i * 17).toString().slice(-2)}`,
    avatar: initials(name),
    email: `${fn.toLowerCase()}.${sn.toLowerCase()}@mail.ru`.replace(/ё/g, "e"),
    birthday: `19${65 + (i % 30)}-${String(1 + (i % 12)).padStart(2, "0")}-${String(1 + (i % 28)).padStart(2, "0")}`,
    firstVisit: daysAgo(ageDays + 90 + (i % 600)),
    lastVisit: daysAgo(ageDays),
    totalVisits,
    totalSpent,
    averageCheck,
    ltv: totalSpent + (segment === "vip" ? 80000 : segment === "regular" ? 20000 : 0),
    segment,
    favoriteMaster: fav.name,
    favoriteMasterAvatar: fav.avatar,
    preferredServices: services2,
    bonusBalance: segment === "vip" ? 4200 + (i % 800) : (i * 53) % 2400,
    depositBalance: segment === "vip" ? (i % 5) * 3000 : 0,
    noShowCount: i % 11 === 0 ? 1 : 0,
    blacklisted: i === 47,
    notes: i % 9 === 0 ? "Аллергия на парабены — использовать только серию Davines OI" : undefined,
    visitHistory: Array.from({ length: Math.min(8, totalVisits) }, (_, j) => {
      const svc = services[(i + j) % services.length];
      const m = masters[(i + j) % masters.length];
      return {
        date: daysAgo(ageDays + j * 30),
        service: svc.name,
        master: m.name,
        amount: svc.price,
        rating: j === 0 ? 5 : (i + j) % 5 === 0 ? 4 : 5,
      };
    }),
  });
}
writeFileSync(path.join(DATA, "clients.json"), JSON.stringify(allClients, null, 2));

// ----- Appointments today (на 10-21 ч, 4 мастера) -----
const apptSamples = [
  { service: "Стрижка женская", duration: 60, price: 3500 },
  { service: "Окрашивание", duration: 120, price: 8500 },
  { service: "Мелирование", duration: 180, price: 12000 },
  { service: "Маникюр с покрытием", duration: 90, price: 3500 },
  { service: "Педикюр", duration: 75, price: 3200 },
  { service: "Чистка лица", duration: 90, price: 6500 },
  { service: "Пилинг", duration: 60, price: 5500 },
  { service: "Коррекция бровей", duration: 30, price: 2000 },
  { service: "Наращивание ресниц", duration: 120, price: 4500 },
  { service: "Укладка", duration: 45, price: 1800 },
];
const appts = [];
const sources = ["online", "whatsapp", "admin", "instagram", "walk_in", "telegram"];
const statuses = ["confirmed", "completed", "pending", "confirmed", "confirmed", "no_show"];
let apptCount = 0;
for (const m of masters) {
  let hour = 10 + (parseInt(m.id.slice(1)) - 1);
  for (let i = 0; i < 5; i++) {
    if (hour >= 20) break;
    const sample = apptSamples[(apptCount + i) % apptSamples.length];
    const client = allClients[(apptCount * 3 + i) % allClients.length];
    appts.push({
      id: `ap${++apptCount}`,
      clientId: client.id,
      clientName: client.name,
      clientAvatar: client.avatar,
      masterId: m.id,
      masterName: m.name,
      serviceName: sample.service,
      startHour: hour,
      startMinute: (i % 2) * 30,
      duration: sample.duration,
      price: sample.price,
      status: statuses[(apptCount) % statuses.length],
      source: sources[apptCount % sources.length],
      isPrepaid: apptCount % 3 === 0,
      note: apptCount % 11 === 0 ? "Аллергия — использовать гипоаллергенные средства" : undefined,
    });
    hour += Math.ceil(sample.duration / 60);
  }
}
writeFileSync(path.join(DATA, "appointments.json"), JSON.stringify(appts, null, 2));

// ----- Loyalty programs -----
const loyalty = [
  {
    id: "lp1",
    kind: "bonus",
    name: "Кэшбэк-программа AURA",
    description: "Начисление 7% от каждой услуги, списание до 30% от чека.",
    rule: "7% начисление · до 30% списание · сгорание через 12 мес",
    participants: 482,
    totalIssued: 1284500,
    redeemed: 624000,
    totalValueRub: 660500,
    active: true,
  },
  {
    id: "lp2",
    kind: "deposit",
    name: "Депозит +15%",
    description: "Клиент пополняет личный счёт от 10к — получает +15% бонусом.",
    rule: "от 10 000 ₽ · +15% к балансу · без срока сгорания",
    participants: 47,
    totalIssued: 890000,
    redeemed: 312000,
    totalValueRub: 578000,
    active: true,
  },
  {
    id: "lp3",
    kind: "certificate",
    name: "Подарочные сертификаты",
    description: "Электронные сертификаты на сумму, действуют 6 месяцев.",
    rule: "номиналы 3к/5к/10к/15к · 6 мес действия",
    participants: 0,
    totalIssued: 142,
    redeemed: 89,
    totalValueRub: 612000,
    active: true,
  },
  {
    id: "lp4",
    kind: "subscription",
    name: "Абонементы на 4/8/12 визитов",
    description: "Пакеты на маникюр и косметологию со скидкой 15-25%.",
    rule: "4 визита −15% · 8 визитов −20% · 12 визитов −25%",
    participants: 38,
    totalIssued: 84,
    redeemed: 211,
    totalValueRub: 412000,
    active: true,
  },
];
writeFileSync(path.join(DATA, "loyalty.json"), JSON.stringify(loyalty, null, 2));

// ----- Certificates (15 шт) -----
const amounts = [3000, 5000, 10000, 15000];
const certs = Array.from({ length: 15 }, (_, i) => {
  const buyer = allClients[i * 3];
  const recip = i % 2 === 0 ? allClients[i * 3 + 7] : null;
  const amount = amounts[i % amounts.length];
  const issued = i * 12;
  const status = i % 7 === 0 ? "redeemed" : i % 11 === 0 ? "expired" : "active";
  return {
    id: `cert${i + 1}`,
    code: `AURA-${String(1000 + i).padStart(4, "0")}`,
    amount,
    buyerName: buyer.name,
    recipientName: recip ? recip.name : undefined,
    issuedAt: daysAgo(issued),
    expiresAt: daysAgo(issued - 180),
    status,
  };
});
writeFileSync(path.join(DATA, "certificates.json"), JSON.stringify(certs, null, 2));

// ----- Subscriptions (12 шт) -----
const subs = Array.from({ length: 12 }, (_, i) => {
  const c = allClients[i * 5 + 1];
  const total = [4, 8, 12][i % 3];
  const used = (i * 2) % total;
  return {
    id: `sub${i + 1}`,
    clientName: c.name,
    clientAvatar: c.avatar,
    packName: `Абонемент ${["Маникюр", "Чистка лица", "Стрижка + укладка"][i % 3]} на ${total} визитов`,
    totalVisits: total,
    usedVisits: used,
    remainingDays: 90 - i * 5,
    paidAmount: total * (i % 3 === 0 ? 2800 : i % 3 === 1 ? 5500 : 3200) * (i % 3 === 0 ? 0.85 : i % 3 === 1 ? 0.8 : 0.75),
  };
});
writeFileSync(path.join(DATA, "subscriptions.json"), JSON.stringify(subs, null, 2));

// ----- Marketing campaigns -----
const campaigns = [
  {
    id: "mc1",
    name: "Приветственная серия (новый клиент)",
    trigger: "first_visit",
    channel: "whatsapp",
    audienceSize: 38,
    sentCount: 36,
    openRate: 0.92,
    conversionRate: 0.41,
    revenue: 87000,
    active: true,
    template: "Привет, {имя}! Спасибо, что выбрали Студию Аура 💎 Дарим −10% на следующий визит в течение 14 дней. Записаться: aura.studio/book",
  },
  {
    id: "mc2",
    name: "С Днём рождения 🎂",
    trigger: "birthday",
    channel: "whatsapp",
    audienceSize: 12,
    sentCount: 12,
    openRate: 1.0,
    conversionRate: 0.75,
    revenue: 64000,
    active: true,
    template: "{имя}, с Днём рождения! 🎂 Дарим 1 000 ₽ на бонусный счёт + комплимент-укладка к любой услуге в этом месяце.",
  },
  {
    id: "mc3",
    name: "После визита — собрать отзыв",
    trigger: "after_visit",
    channel: "telegram",
    audienceSize: 207,
    sentCount: 198,
    openRate: 0.87,
    conversionRate: 0.62,
    revenue: 0,
    active: true,
    template: "{имя}, как прошёл визит к {мастер}? Поделитесь впечатлением — это поможет нам стать лучше. Жмите 👇",
  },
  {
    id: "mc4",
    name: "Спящие 30+ дней",
    trigger: "sleeping_30",
    channel: "whatsapp",
    audienceSize: 12,
    sentCount: 12,
    openRate: 0.83,
    conversionRate: 0.35,
    revenue: 51000,
    active: true,
    template: "{имя}, давно вас не было ✨ Записать вас к {мастер} на этой неделе?",
    abTest: {
      variantA: { name: "Без скидки", openRate: 0.83, conversion: 0.31 },
      variantB: { name: "Со скидкой 10%", openRate: 0.87, conversion: 0.38 },
      winner: "B",
    },
  },
  {
    id: "mc5",
    name: "Спящие 60+ дней",
    trigger: "sleeping_60",
    channel: "whatsapp",
    audienceSize: 19,
    sentCount: 19,
    openRate: 0.74,
    conversionRate: 0.26,
    revenue: 96000,
    active: true,
    template: "{имя}, прошло 2 месяца. Дарим −15% на любую услугу до пятницы.",
  },
  {
    id: "mc6",
    name: "Спящие 90+ дней",
    trigger: "sleeping_90",
    channel: "sms",
    audienceSize: 16,
    sentCount: 16,
    openRate: 0.61,
    conversionRate: 0.18,
    revenue: 63000,
    active: true,
    template: "{имя}, скучаем 💔 Для вас −20% от общего чека.",
  },
  {
    id: "mc7",
    name: "Годовщина первого визита",
    trigger: "anniversary",
    channel: "whatsapp",
    audienceSize: 24,
    sentCount: 24,
    openRate: 0.96,
    conversionRate: 0.58,
    revenue: 121000,
    active: false,
    template: "{имя}, ровно год назад вы пришли к нам первый раз 🌷 Дарим 2 000 ₽ на бонусный счёт.",
  },
];
writeFileSync(path.join(DATA, "campaigns.json"), JSON.stringify(campaigns, null, 2));

// ----- Inventory -----
const inv = [
  { id: "inv1", name: "Краска L'Oréal Majirel 6.0", category: "Окрашивание", unit: "тюб", inStock: 4, parLevel: 12, costPerUnit: 980, monthConsumption: 18, supplier: "BeautyProf" },
  { id: "inv2", name: "Краска Wella Koleston 8/0", category: "Окрашивание", unit: "тюб", inStock: 9, parLevel: 10, costPerUnit: 1150, monthConsumption: 14, supplier: "Wella RUS" },
  { id: "inv3", name: "Окислитель 6%", category: "Окрашивание", unit: "л", inStock: 6, parLevel: 5, costPerUnit: 720, monthConsumption: 8, supplier: "BeautyProf" },
  { id: "inv4", name: "Шампунь Davines OI", category: "Уход", unit: "шт", inStock: 11, parLevel: 8, costPerUnit: 2400, monthConsumption: 6, supplier: "Davines" },
  { id: "inv5", name: "Маска Olaplex N3", category: "Уход", unit: "шт", inStock: 2, parLevel: 6, costPerUnit: 3200, monthConsumption: 8, supplier: "Olaplex" },
  { id: "inv6", name: "Гель-лак OPI (классика)", category: "Ногти", unit: "шт", inStock: 28, parLevel: 30, costPerUnit: 850, monthConsumption: 12, supplier: "NailPro" },
  { id: "inv7", name: "База Kodi prof", category: "Ногти", unit: "шт", inStock: 5, parLevel: 6, costPerUnit: 620, monthConsumption: 4, supplier: "NailPro" },
  { id: "inv8", name: "Пилки 100/180", category: "Ногти", unit: "уп", inStock: 18, parLevel: 10, costPerUnit: 320, monthConsumption: 8, supplier: "NailPro" },
  { id: "inv9", name: "Пилинг Holy Land Alpha", category: "Косметология", unit: "мл", inStock: 220, parLevel: 200, costPerUnit: 18, monthConsumption: 180, supplier: "Holy Land" },
  { id: "inv10", name: "Маска альгинатная", category: "Косметология", unit: "шт", inStock: 24, parLevel: 15, costPerUnit: 480, monthConsumption: 18, supplier: "BeautyMed", expiryDate: daysAgo(-45) },
  { id: "inv11", name: "Крем дневной SPF50", category: "Косметология", unit: "шт", inStock: 3, parLevel: 5, costPerUnit: 2800, monthConsumption: 2, supplier: "BeautyMed", expiryDate: daysAgo(-180) },
  { id: "inv12", name: "Хна для бровей", category: "Брови", unit: "шт", inStock: 8, parLevel: 6, costPerUnit: 380, monthConsumption: 5, supplier: "BrowExpert" },
  { id: "inv13", name: "Ресницы C/0.10/9 мм", category: "Ресницы", unit: "уп", inStock: 7, parLevel: 5, costPerUnit: 1200, monthConsumption: 3, supplier: "LashPro" },
  { id: "inv14", name: "Клей для ресниц Sky", category: "Ресницы", unit: "шт", inStock: 1, parLevel: 3, costPerUnit: 1850, monthConsumption: 2, supplier: "LashPro", expiryDate: daysAgo(-20) },
  { id: "inv15", name: "Полотенца одноразовые", category: "Расходники", unit: "уп", inStock: 32, parLevel: 20, costPerUnit: 280, monthConsumption: 14, supplier: "Hygiene+" },
];
inv.forEach((i) => {
  i.lowStock = i.inStock < i.parLevel * 0.5;
  if (i.expiryDate) {
    const days = (new Date(i.expiryDate).getTime() - today.getTime()) / 86400000;
    i.expiringSoon = days <= 30;
  }
});
writeFileSync(path.join(DATA, "inventory.json"), JSON.stringify(inv, null, 2));

// ----- Payroll -----
const payroll = masters.map((m) => {
  const ratePercent = m.margin > 0.5 ? 0.5 : m.margin > 0.4 ? 0.45 : 0.4;
  return {
    masterId: m.id,
    masterName: m.name,
    masterAvatar: m.avatar,
    appointments: m.appointmentsCount,
    revenue: m.revenue,
    ratePercent,
    bonus: m.id === "m1" ? 15000 : m.id === "m2" ? 8000 : 0,
    payout: Math.round(m.revenue * ratePercent + (m.id === "m1" ? 15000 : m.id === "m2" ? 8000 : 0)),
  };
});
writeFileSync(path.join(DATA, "payroll.json"), JSON.stringify(payroll, null, 2));

// ----- Finance snapshot -----
const monthRevenue = masters.reduce((s, m) => s + m.revenue, 0);
const monthCOGS = Math.round(monthRevenue * 0.14);
const monthPayroll = payroll.reduce((s, p) => s + p.payout, 0);
const monthRent = 180000;
const monthMarketing = 35000;
const monthOther = 28000;
const monthTaxes = Math.round(monthRevenue * 0.06);
const monthProfit = monthRevenue - monthCOGS - monthPayroll - monthRent - monthMarketing - monthOther - monthTaxes;
const marginPercent = monthProfit / monthRevenue;
const cashflowByDay = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(2026, 3, 11 + i);
  const wkn = date.getDay() === 0 || date.getDay() === 6;
  const income = wkn ? 55000 + (i * 1000) % 18000 : 38000 + (i * 700) % 12000;
  const expense = i % 7 === 0 ? 90000 + ((i * 1000) % 20000) : 12000 + ((i * 300) % 6000);
  return { date: date.toISOString().slice(0, 10), income, expense };
});
const expensesBreakdown = [
  { category: "ЗП мастеров", amount: monthPayroll },
  { category: "Расходники", amount: monthCOGS },
  { category: "Аренда", amount: monthRent },
  { category: "Налоги (6%)", amount: monthTaxes },
  { category: "Маркетинг", amount: monthMarketing },
  { category: "Прочее (вода, химия, IT)", amount: monthOther },
];
writeFileSync(
  path.join(DATA, "finance.json"),
  JSON.stringify(
    {
      monthRevenue,
      monthCOGS,
      monthPayroll,
      monthRent,
      monthMarketing,
      monthOther,
      monthTaxes,
      monthProfit,
      marginPercent,
      forecastNextMonth: Math.round(monthRevenue * 1.08),
      cashflowByDay,
      expensesBreakdown,
    },
    null,
    2
  )
);

// ----- Cohort retention (последние 8 месяцев) -----
const cohorts = [];
const monthLabels = ["окт 25", "ноя 25", "дек 25", "янв 26", "фев 26", "мар 26", "апр 26", "май 26"];
for (let i = 0; i < 8; i++) {
  const size = 28 + ((i * 13) % 22);
  const retention = [];
  let r = 100;
  for (let j = 0; j < 8 - i; j++) {
    if (j === 0) retention.push(100);
    else {
      r = Math.max(8, r - (j === 1 ? 35 : j === 2 ? 12 : 6) - (i % 3));
      retention.push(r);
    }
  }
  cohorts.push({ month: monthLabels[i], cohortSize: size, retention });
}
writeFileSync(path.join(DATA, "cohorts.json"), JSON.stringify(cohorts, null, 2));

// ----- Reviews -----
const reviewSamples = [
  { rating: 5, text: "Алина — лучшая! Цвет получился идеальный, держится отлично. Точно вернусь.", service: "Окрашивание", master: "Алина Сафронова", channel: "yandex_maps", status: "published", clientIdx: 2 },
  { rating: 5, text: "Очень уютная атмосфера, чай, музыка. Маникюр сделали быстро, аккуратно — Полина волшебница 💅", service: "Маникюр с покрытием", master: "Полина Левина", channel: "twogis", status: "published", clientIdx: 7 },
  { rating: 5, text: "Чистка лица у Марии — рекомендую всем. Кожа после процедуры как новая, никаких раздражений.", service: "Чистка лица", master: "Мария Орлова", channel: "google", status: "published", clientIdx: 12 },
  { rating: 4, text: "Хороший салон, но пришлось чуть подождать — мастер задержалась с предыдущим клиентом.", service: "Стрижка женская", master: "Алина Сафронова", channel: "yandex_maps", status: "responded", clientIdx: 17 },
  { rating: 2, text: "Мне категорически не понравилось окрашивание. Цвет получился совсем не такой, как обсуждали — слишком тёмный. Деньги вернуть отказались.", service: "Окрашивание", master: "Алина Сафронова", channel: "yandex_maps", status: "needs_response", clientIdx: 22 },
  { rating: 1, text: "Записалась через инсту, приехала — мне сказали что записи нет, мастер занят. Извинений ноль. Очень обидно.", service: "Маникюр классический", master: "Полина Левина", channel: "yandex_maps", status: "needs_response", clientIdx: 25 },
  { rating: 5, text: "Третий раз у Полины — стабильно великолепно. Особенно люблю её дизайны на праздники!", service: "Маникюр с покрытием", master: "Полина Левина", channel: "direct", status: "published", clientIdx: 31 },
  { rating: 5, text: "Брови — огонь! Катя, спасибо большое.", service: "Коррекция бровей", master: "Катя Романова", channel: "twogis", status: "published", clientIdx: 33 },
  { rating: 3, text: "Услуга хорошая, но цены сильно подняли с осени — стало дороговато для регулярных визитов.", service: "Чистка лица", master: "Мария Орлова", channel: "yandex_maps", status: "pending_review", clientIdx: 37 },
  { rating: 5, text: "Спасибо команде Аура за тёплый приём и профессионализм 🌷 Записалась снова на через неделю.", service: "Стрижка женская", master: "Алина Сафронова", channel: "whatsapp", status: "published", clientIdx: 42 },
];
const reviews = reviewSamples.map((r, i) => {
  const c = allClients[r.clientIdx % allClients.length];
  const aiReply = r.rating <= 2
    ? "Спасибо за отзыв — извините, что подвели. Передала ситуацию администратору, он свяжется с вами лично в течение часа: +7 (495) 123-45-67. Хотим разобраться и компенсировать."
    : r.rating === 3
    ? "Спасибо за честный отзыв! Мы понимаем — цены пересмотрели в связи с ростом стоимости расходников. Для постоянных клиентов есть бонусная программа и абонементы — вернусь к вам с деталями в личке."
    : undefined;
  return {
    id: `rev${i + 1}`,
    clientName: c.name,
    clientAvatar: c.avatar,
    rating: r.rating,
    text: r.text,
    service: r.service,
    master: r.master,
    date: daysAgo(i * 3 + 1),
    channel: r.channel,
    status: r.status,
    aiSuggestedReply: aiReply,
  };
});
writeFileSync(path.join(DATA, "reviews.json"), JSON.stringify(reviews, null, 2));

// ----- Integrations -----
const integrations = [
  { id: "int1", name: "WhatsApp Business API", description: "Автоответы и рассылки через официальный API Meta", category: "messengers", connected: true, icon: "🟢" },
  { id: "int2", name: "Telegram Bot", description: "Бот для записи и ответов клиентам в Telegram", category: "messengers", connected: true, icon: "✈️" },
  { id: "int3", name: "Instagram Direct", description: "Получение сообщений из Direct и автоответы AI", category: "messengers", connected: true, icon: "📸" },
  { id: "int4", name: "1С: Бухгалтерия", description: "Выгрузка операций для бухгалтерии и налогов", category: "crm", connected: true, icon: "1C" },
  { id: "int5", name: "YClients", description: "Двунаправленная синхронизация записи и клиентов", category: "crm", connected: false, icon: "Y" },
  { id: "int6", name: "Сбербанк Эквайринг", description: "Приём платежей через POS-терминал и онлайн", category: "payments", connected: true, icon: "💳" },
  { id: "int7", name: "Тинькофф Касса", description: "Онлайн-оплата при бронировании", category: "payments", connected: true, icon: "💳" },
  { id: "int8", name: "Яндекс.Карты", description: "Размещение профиля и кнопка «записаться»", category: "marketing", connected: true, icon: "📍" },
  { id: "int9", name: "2ГИС", description: "Профиль и онлайн-запись в 2ГИС", category: "marketing", connected: true, icon: "🗺" },
  { id: "int10", name: "Yandex Metrika", description: "Аналитика посетителей сайта и виджета", category: "analytics", connected: true, icon: "📊" },
  { id: "int11", name: "Сбер Бизнес Бот", description: "Уведомления о платежах в Telegram", category: "payments", connected: false, icon: "🤖" },
  { id: "int12", name: "ВКонтакте", description: "Сообщения сообщества с автоответами", category: "messengers", connected: false, icon: "💙" },
];
writeFileSync(path.join(DATA, "integrations.json"), JSON.stringify(integrations, null, 2));

console.log("✅ Extra mocks generated");
console.log(`   services: ${services.length}, clients: ${allClients.length}, appts: ${appts.length}, loyalty: ${loyalty.length}`);
console.log(`   certs: ${certs.length}, subs: ${subs.length}, campaigns: ${campaigns.length}, inv: ${inv.length}`);
console.log(`   reviews: ${reviews.length}, integrations: ${integrations.length}, cohorts: ${cohorts.length}`);
