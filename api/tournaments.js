export default function handler(req, res) {

res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=300");

// ✅ FUNÇÃO: Determinar prioridade para torneios YaPoker
const getYaPriority = (tournamentName) => {
  const nameLower = tournamentName.toLowerCase();
  
  // Torneios regulares = HIGH
  if (nameLower.includes('mega stack') || nameLower.includes('deep') || 
      nameLower.includes('freezeout') || nameLower.includes('special') || 
      nameLower.includes('daily double') || nameLower.includes('loncar') ||
      nameLower.includes('boski') || nameLower.includes('early special') ||
      (nameLower.includes('$') && !nameLower.includes('pko') && !nameLower.includes('bounty') && !nameLower.includes('hyper') && !nameLower.includes('turbo'))) {
    return "high";
  }
  
  // Turbo = MEDIUM
  if (nameLower.includes('turbo')) {
    return "medium";
  }
  
  // PKO/Bounty = LOW
  if (nameLower.includes('pko') || nameLower.includes('bounty') || 
      nameLower.includes('lightning')) {
    return "low";
  }
  
  return "medium";
};

function formatDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function generateDatesForJanuary() {
  const dates = [];
  const startDate = new Date(2026, 0, 7);
  const endDate = new Date(2026, 0, 31);
  
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    dates.push(new Date(d));
  }
  
  return dates;
}

// ✅ YAPOKER - Torneios de Segunda a Sábado (estrutura idêntica)

// ✅ GGPOKER - Templates diários


const tournaments = [];
const dates = generateDatesForJanuary();
let id = 1;

// Adicionar Main Event Series
tournaments.push(...[
    { id: 25, date: "2026-01-07", time: "18:00", name: "#25: $100 Winter Classic [9-Max]", type: "REGULAR", buyin: 100, guaranteed: 200000, priority: "medium", site: "GGPoker" },
    { id: 26, date: "2026-01-08", time: "18:00", name: "#26-A: $10 Speed Racer Bounty WINTER HOUR", type: "BOUNTY", buyin: 10, guaranteed: 40000, priority: "high", site: "GGPoker" },
    { id: 31, date: "2026-01-09", time: "18:00", name: "#27: $15 Friday Freezeout", type: "REGULAR", buyin: 15, guaranteed: 100000, priority: "medium", site: "GGPoker" },
    { id: 32, date: "2026-01-10", time: "18:00", name: "#28: $215 Omaholic Deepstack Turbo", type: "TURBO", buyin: 215, guaranteed: 100000, priority: "very-high", site: "GGPoker" },
    { id: 49, date: "2026-01-27", time: "18:00", name: "#45: $50 Winter Super Saver [Hyper]", type: "TURBO", buyin: 50, guaranteed: 150000, priority: "very-high", site: "GGPoker" },
  ]);
id = Math.max(...[
    { id: 25, date: "2026-01-07", time: "18:00", name: "#25: $100 Winter Classic [9-Max]", type: "REGULAR", buyin: 100, guaranteed: 200000, priority: "medium", site: "GGPoker" },
    { id: 26, date: "2026-01-08", time: "18:00", name: "#26-A: $10 Speed Racer Bounty WINTER HOUR", type: "BOUNTY", buyin: 10, guaranteed: 40000, priority: "high", site: "GGPoker" },
    { id: 31, date: "2026-01-09", time: "18:00", name: "#27: $15 Friday Freezeout", type: "REGULAR", buyin: 15, guaranteed: 100000, priority: "medium", site: "GGPoker" },
    { id: 32, date: "2026-01-10", time: "18:00", name: "#28: $215 Omaholic Deepstack Turbo", type: "TURBO", buyin: 215, guaranteed: 100000, priority: "very-high", site: "GGPoker" },
    { id: 49, date: "2026-01-27", time: "18:00", name: "#45: $50 Winter Super Saver [Hyper]", type: "TURBO", buyin: 50, guaranteed: 150000, priority: "very-high", site: "GGPoker" },
  ].map(t => t.id)) + 1;

// Adicionar GGPoker Daily Hypers e Turbos para cada dia
dates.forEach(date => {
  [
    { time: "00:45", name: "Daily Hyper $2", buyin: 2, guaranteed: 1000 },
    { time: "00:45", name: "Daily Hyper $50", buyin: 50, guaranteed: 2000 },
    { time: "00:45", name: "Daily Hyper $10", buyin: 10, guaranteed: 2000 },
    { time: "01:45", name: "Daily Hyper $20", buyin: 20, guaranteed: 2500 },
    { time: "01:45", name: "Daily Hyper $1", buyin: 1, guaranteed: 500 },
    { time: "01:45", name: "Daily Hyper $5", buyin: 5, guaranteed: 1250 },
    { time: "02:45", name: "Daily Hyper $2", buyin: 2, guaranteed: 600 },
    { time: "02:45", name: "Daily Hyper $10", buyin: 10, guaranteed: 1500 },
    { time: "02:45", name: "Daily Hyper $50", buyin: 50, guaranteed: 1500 },
    { time: "03:45", name: "Daily Hyper $1", buyin: 1, guaranteed: 400 },
    { time: "03:45", name: "Daily Hyper $100", buyin: 100, guaranteed: 2000 },
    { time: "03:45", name: "Daily Hyper $30", buyin: 30, guaranteed: 2000 },
    { time: "03:45", name: "Daily Hyper $8", buyin: 8, guaranteed: 1500 },
    { time: "04:45", name: "Daily Hyper $20", buyin: 20, guaranteed: 2000 },
    { time: "04:45", name: "Daily Hyper $60", buyin: 60, guaranteed: 1500 },
    { time: "04:45", name: "Daily Hyper $1", buyin: 1, guaranteed: 400 },
    { time: "04:45", name: "Daily Hyper $5", buyin: 5, guaranteed: 1000 },
    { time: "05:45", name: "Daily Hyper $10", buyin: 10, guaranteed: 1750 },
    { time: "05:45", name: "Daily Hyper $2", buyin: 2, guaranteed: 750 },
    { time: "05:45", name: "Daily Hyper $50", buyin: 50, guaranteed: 2000 },
    { time: "06:45", name: "Daily Hyper $8", buyin: 8, guaranteed: 1500 },
    { time: "06:45", name: "Daily Hyper $1", buyin: 1, guaranteed: 500 },
    { time: "06:45", name: "Daily Hyper $100", buyin: 100, guaranteed: 2000 },
    { time: "06:45", name: "Daily Hyper $30", buyin: 30, guaranteed: 2500 },
    { time: "07:45", name: "Daily Hyper $2", buyin: 2, guaranteed: 750 },
    { time: "07:45", name: "Daily Hyper $10", buyin: 10, guaranteed: 2500 },
    { time: "07:45", name: "Daily Hyper $60", buyin: 60, guaranteed: 2500 },
    { time: "08:45", name: "Daily Hyper $20", buyin: 20, guaranteed: 2500 },
    { time: "08:45", name: "Daily Hyper $5", buyin: 5, guaranteed: 1500 },
    { time: "08:45", name: "Daily Hyper $80", buyin: 80, guaranteed: 2000 },
    { time: "08:45", name: "Daily Hyper $1", buyin: 1, guaranteed: 500 },
    { time: "09:45", name: "Daily Hyper $10", buyin: 10, guaranteed: 3000 },
    { time: "09:45", name: "Daily Hyper $2", buyin: 2, guaranteed: 800 },
    { time: "09:45", name: "Daily Hyper $50", buyin: 50, guaranteed: 2500 },
    { time: "10:45", name: "Daily Hyper $1", buyin: 1, guaranteed: 600 },
    { time: "10:45", name: "Daily Hyper $5", buyin: 5, guaranteed: 1500 },
    { time: "10:45", name: "Daily Hyper $20", buyin: 20, guaranteed: 3000 },
    { time: "10:45", name: "Daily Hyper $60", buyin: 60, guaranteed: 2500 },
    { time: "11:45", name: "Daily Hyper $8", buyin: 8, guaranteed: 2500 },
    { time: "11:45", name: "Daily Hyper $1", buyin: 1, guaranteed: 750 },
    { time: "11:45", name: "Daily Hyper $30", buyin: 30, guaranteed: 3000 },
    { time: "11:45", name: "Daily Hyper $100", buyin: 100, guaranteed: 1500 },
    { time: "12:45", name: "Daily Hyper $50", buyin: 50, guaranteed: 3500 },
    { time: "12:45", name: "Daily Hyper $5", buyin: 5, guaranteed: 2000 },
    { time: "13:45", name: "Daily Hyper $20", buyin: 20, guaranteed: 4000 },
    { time: "13:45", name: "Daily Hyper $5", buyin: 5, guaranteed: 2500 },
    { time: "13:45", name: "Daily Hyper $80", buyin: 80, guaranteed: 2500 },
    { time: "13:45", name: "Daily Hyper $1", buyin: 1, guaranteed: 1000 },
    { time: "14:45", name: "Daily Hyper $2", buyin: 2, guaranteed: 2000 },
    { time: "14:45", name: "Daily Hypersonic $15", buyin: 15, guaranteed: 8000 },
    { time: "14:45", name: "Daily Hyper $50", buyin: 50, guaranteed: 4000 },
    { time: "15:45", name: "Daily Hyper $1", buyin: 1, guaranteed: 1000 },
    { time: "15:45", name: "Daily Hyper $100", buyin: 100, guaranteed: 3000 },
    { time: "15:45", name: "Daily Hyper $30", buyin: 30, guaranteed: 4000 },
    { time: "15:45", name: "Daily Hyper $8", buyin: 8, guaranteed: 5000 },
    { time: "16:45", name: "Daily Hyper Special $88", buyin: 88, guaranteed: 8000 },
    { time: "16:45", name: "Daily Hyper $20", buyin: 20, guaranteed: 6000 },
    { time: "16:45", name: "Daily Hyper $2", buyin: 2, guaranteed: 1500 },
    { time: "16:45", name: "Daily Hyper Special $8.88", buyin: 9, guaranteed: 8000 },
    { time: "16:45", name: "Daily Hyper $200", buyin: 200, guaranteed: 3000 },
    { time: "17:45", name: "Daily Hyper $5", buyin: 5, guaranteed: 4000 },
    { time: "17:45", name: "Daily Hyper $1", buyin: 1, guaranteed: 1000 },
    { time: "17:45", name: "Daily Hyper $50", buyin: 50, guaranteed: 5000 },
    { time: "18:45", name: "Daily Hyper $8", buyin: 8, guaranteed: 5000 },
    { time: "18:45", name: "Daily Hyper $80", buyin: 80, guaranteed: 3000 },
    { time: "18:45", name: "Daily Hyper $2", buyin: 2, guaranteed: 2000 },
    { time: "19:45", name: "Daily Hyper $10", buyin: 10, guaranteed: 7000 },
    { time: "19:45", name: "Daily Hyper $2", buyin: 2, guaranteed: 1750 },
    { time: "19:45", name: "Daily Hyper $50", buyin: 50, guaranteed: 5000 },
    { time: "20:45", name: "Daily Hyper $20", buyin: 20, guaranteed: 7000 },
    { time: "20:45", name: "Daily Hyper $1", buyin: 1, guaranteed: 750 },
    { time: "20:45", name: "Daily Hyper $100", buyin: 100, guaranteed: 3000 },
    { time: "20:45", name: "Daily Hyper $5", buyin: 5, guaranteed: 3000 },
    { time: "21:45", name: "Daily Hyper $50", buyin: 50, guaranteed: 4000 },
    { time: "21:45", name: "Daily Hyper $10", buyin: 10, guaranteed: 2500 },
    { time: "22:45", name: "Daily Hyper $1", buyin: 1, guaranteed: 600 },
    { time: "22:45", name: "Daily Hyper $20", buyin: 20, guaranteed: 4000 },
    { time: "22:45", name: "Daily Hyper $5", buyin: 5, guaranteed: 1500 },
    { time: "22:45", name: "Daily Hyper $80", buyin: 80, guaranteed: 3000 },
    { time: "23:45", name: "Daily Hyper $100", buyin: 100, guaranteed: 2000 },
    { time: "23:45", name: "Daily Hyper $30", buyin: 30, guaranteed: 2500 },
    { time: "23:45", name: "Daily Hyper $2", buyin: 2, guaranteed: 600 },
  ].forEach(template => {
    tournaments.push({
      id: id++,
      date: formatDateString(date),
      time: template.time,
      site: "GGPoker",
      name: template.name,
      type: "HYPER",
      buyin: template.buyin,
      guaranteed: template.guaranteed,
      priority: "very-high",
      status: "Aberto"
    });
  });

  [
    { time: "00:15", name: "Daily Turbo $10", buyin: 10, guaranteed: 600 },
    { time: "01:15", name: "Daily Turbo $20", buyin: 20, guaranteed: 500 },
    { time: "02:15", name: "Daily Turbo $40", buyin: 40, guaranteed: 500 },
    { time: "03:15", name: "Daily Turbo $5", buyin: 5, guaranteed: 400 },
  ].forEach(template => {
    tournaments.push({
      id: id++,
      date: formatDateString(date),
      time: template.time,
      site: "GGPoker",
      name: template.name,
      type: "TURBO",
      buyin: template.buyin,
      guaranteed: template.guaranteed,
      priority: "very-high",
      status: "Aberto"
    });
  });
});

// Adicionar GGPoker GGMaster para cada dia
dates.forEach(date => {
  const dateStr = formatDateString(date);
  [
    { time: "00:15", name: "Daily master $10", buyin: 10, guaranteed: 600 },
    { time: "01:15", name: "Daily master $20", buyin: 20, guaranteed: 500 },
    { time: "02:15", name: "Daily master $40", buyin: 40, guaranteed: 500 },
    { time: "03:15", name: "Daily master $5", buyin: 5, guaranteed: 400 },
  ].forEach(template => {
    tournaments.push({
      id: id++,
      date: dateStr,
      time: template.time,
      site: "GGPoker",
      name: template.name,
      type: "TURBO",
      buyin: template.buyin,
      guaranteed: template.guaranteed,
      priority: "medium",
      status: "Aberto"
    });
  });
});

// ✅ ADICIONAR YAPOKER - TODOS OS DIAS (segunda a sábado)
dates.forEach(date => {
  const dayOfWeek = date.getDay();
  const dateStr = formatDateString(date);
  
  // Segunda=1, Terça=2, Quarta=3, Quinta=4, Sexta=5, Sábado=6
  // YaPoker opera de segunda a sábado (1-6)
  if (dayOfWeek >= 1 && dayOfWeek <= 6) {
    [
      { time: "02:05", name: "Hyper $5,000 GTD", buyin: 21.00, guaranteed: 5000, type: "HYPER" },
      { time: "02:05", name: "Lightning PKO $400 GTD", buyin: 10.50, guaranteed: 400, type: "BOUNTY" },
      { time: "02:05", name: "Hyper $400 GTD", buyin: 2.10, guaranteed: 400, type: "HYPER" },
      { time: "02:15", name: "Turbo $600 GTD", buyin: 16.50, guaranteed: 600, type: "TURBO" },
      { time: "02:15", name: "Turbo $300 GTD", buyin: 6.60, guaranteed: 300, type: "TURBO" },
      { time: "02:30", name: "PKO $5,000 GTD", buyin: 66.00, guaranteed: 5000, type: "BOUNTY" },
      { time: "02:30", name: "PKO $4,000 GTD", buyin: 33.00, guaranteed: 4000, type: "BOUNTY" },
      { time: "02:30", name: "PKO $1,500 GTD", buyin: 11.00, guaranteed: 1500, type: "BOUNTY" },
      { time: "03:05", name: "PKO Turbo $3,000 GTD", buyin: 104.50, guaranteed: 3000, type: "BOUNTY" },
      { time: "03:05", name: "PKO Super Hyper $750 GTD", buyin: 21.00, guaranteed: 750, type: "BOUNTY" },
      { time: "03:15", name: "PKO Turbo $3,000 GTD", buyin: 55.00, guaranteed: 3000, type: "BOUNTY" },
      { time: "03:15", name: "PKO Turbo $1,000 GTD", buyin: 16.50, guaranteed: 1000, type: "BOUNTY" },
      { time: "03:30", name: "Super Hyper $750 GTD", buyin: 21.00, guaranteed: 750, type: "HYPER" },
      { time: "03:45", name: "Super Bounty FT Turbo $2,500 GTD", buyin: 27.50, guaranteed: 2500, type: "TURBO" },
      { time: "04:15", name: "$2,000 GTD", buyin: 16.50, guaranteed: 2000, type: "REGULAR" },
      { time: "04:30", name: "Super Hyper $500 GTD", buyin: 15.75, guaranteed: 500, type: "HYPER" },
      { time: "04:45", name: "PKO Turbo $1,500 GTD", buyin: 33.00, guaranteed: 1500, type: "BOUNTY" },
      { time: "05:15", name: "Super Bounty FT Turbo $1,500 GTD", buyin: 16.50, guaranteed: 1500, type: "TURBO" },
      { time: "05:30", name: "Super Hyper $500 GTD", buyin: 15.75, guaranteed: 500, type: "HYPER" },
      { time: "05:45", name: "PKO Hyper $2,500 GTD", buyin: 104.50, guaranteed: 2500, type: "BOUNTY" },
      { time: "06:05", name: "Freezeout Turbo $600 GTD", buyin: 16.50, guaranteed: 600, type: "TURBO" },
      { time: "06:30", name: "PKO Turbo $2,000 GTD", buyin: 33.00, guaranteed: 2000, type: "BOUNTY" },
      { time: "07:30", name: "PKO $2,000 GTD", buyin: 33.00, guaranteed: 2000, type: "BOUNTY" },
      { time: "08:05", name: "Super Hyper $500 GTD", buyin: 15.75, guaranteed: 500, type: "HYPER" },
      { time: "08:30", name: "Super Bounty FT Turbo $1,000 GTD", buyin: 11.00, guaranteed: 1000, type: "TURBO" },
      { time: "09:15", name: "Early Special $6,000 GTD", buyin: 44.00, guaranteed: 6000, type: "REGULAR" },
      { time: "09:30", name: "PKO Turbo $600 GTD", buyin: 16.50, guaranteed: 600, type: "BOUNTY" },
      { time: "09:45", name: "PKO Early Special $6,000 GTD", buyin: 33.00, guaranteed: 6000, type: "BOUNTY" },
      { time: "10:05", name: "PKO Euro WarmUp $6,000 GTD", buyin: 109.00, guaranteed: 6000, type: "BOUNTY" },
      { time: "10:05", name: "Super Hyper $750 GTD", buyin: 20.50, guaranteed: 750, type: "HYPER" },
      { time: "10:15", name: "PKO $2,500 GTD 6-Max", buyin: 27.50, guaranteed: 2500, type: "BOUNTY" },
      { time: "10:45", name: "Mega Stack $1,500 GTD", buyin: 16.50, guaranteed: 1500, type: "REGULAR" },
      { time: "11:05", name: "PKO Turbo $4,000 GTD", buyin: 55.00, guaranteed: 4000, type: "BOUNTY" },
      { time: "11:05", name: "Turbo $400 GTD", buyin: 11.00, guaranteed: 400, type: "TURBO" },
      { time: "11:30", name: "PKO $4,000 GTD", buyin: 16.50, guaranteed: 4000, type: "BOUNTY" },
      { time: "12:05", name: "PKO $15,000 GTD", buyin: 109.00, guaranteed: 15000, type: "BOUNTY" },
      { time: "12:05", name: "Super Hyper $1,000 GTD", buyin: 31.50, guaranteed: 1000, type: "HYPER" },
      { time: "12:15", name: "$40,000 GTD", buyin: 66.00, guaranteed: 40000, type: "REGULAR" },
      { time: "12:30", name: "$30,000 GTD", buyin: 215.00, guaranteed: 30000, type: "REGULAR" },
      { time: "12:30", name: "Freezeout $1,500 GTD", buyin: 22.00, guaranteed: 1500, type: "REGULAR" },
      { time: "12:30", name: "PKO Turbo $500 GTD", buyin: 16.50, guaranteed: 500, type: "BOUNTY" },
      { time: "12:45", name: "PKO $5,000 GTD", buyin: 8.80, guaranteed: 5000, type: "BOUNTY" },
      { time: "13:05", name: "PKO Hyper $1,000 GTD", buyin: 31.50, guaranteed: 1000, type: "BOUNTY" },
      { time: "13:30", name: "PKO $40,000 GTD", buyin: 109.00, guaranteed: 40000, type: "BOUNTY" },
      { time: "13:30", name: "Super Hyper $1,000 GTD", buyin: 31.50, guaranteed: 1000, type: "HYPER" },
      { time: "13:45", name: "$5,000 GTD 6-Max", buyin: 33.00, guaranteed: 5000, type: "REGULAR" },
      { time: "14:05", name: "PKO Turbo $3,000 GTD", buyin: 55.00, guaranteed: 3000, type: "BOUNTY" },
      { time: "14:30", name: "PKO $50,000 GTD", buyin: 215.00, guaranteed: 50000, type: "BOUNTY" },
      { time: "14:30", name: "$20,000 GTD", buyin: 33.00, guaranteed: 20000, type: "REGULAR" },
      { time: "15:05", name: "PKO Lunch High Roller $50,000 GTD", buyin: 630.00, guaranteed: 50000, type: "BOUNTY" },
      { time: "15:05", name: "$40,000 GTD", buyin: 109.00, guaranteed: 40000, type: "REGULAR" },
      { time: "15:05", name: "PKO Turbo $1,000 GTD", buyin: 16.50, guaranteed: 1000, type: "BOUNTY" },
      { time: "15:30", name: "PKO $10,000 GTD", buyin: 22.00, guaranteed: 10000, type: "BOUNTY" },
      { time: "15:30", name: "Super Bounty FT $1,500 GTD", buyin: 8.80, guaranteed: 1500, type: "TURBO" },
      { time: "16:05", name: "$75,000 GTD", buyin: 1050.00, guaranteed: 75000, type: "REGULAR" },
      { time: "16:05", name: "PKO $15,000 GTD", buyin: 109.00, guaranteed: 15000, type: "BOUNTY" },
      { time: "16:05", name: "Super Hyper $600 GTD", buyin: 15.75, guaranteed: 600, type: "HYPER" },
      { time: "16:30", name: "PKO $10,000 GTD", buyin: 55.00, guaranteed: 10000, type: "BOUNTY" },
      { time: "16:30", name: "Hyper $1,500 GTD", buyin: 21.00, guaranteed: 1500, type: "HYPER" },
      { time: "17:30", name: "Turbo $5,000 GTD", buyin: 55.00, guaranteed: 5000, type: "TURBO" },
      { time: "17:30", name: "$4,000 GTD 1RE", buyin: 22.00, guaranteed: 4000, type: "REGULAR" },
      { time: "17:45", name: "PKO Super Hyper $1,000 GTD", buyin: 31.50, guaranteed: 1000, type: "BOUNTY" },
      { time: "18:15", name: "The Loncar Daily Double $25,000 GTD", buyin: 55.00, guaranteed: 25000, type: "REGULAR" },
      { time: "18:15", name: "Lightning PKO $1,000 GTD", buyin: 31.50, guaranteed: 1000, type: "BOUNTY" },
      { time: "18:30", name: "PKO $20,000 GTD", buyin: 109.00, guaranteed: 20000, type: "BOUNTY" },
      { time: "18:45", name: "The Loncar Daily Double $25,000 GTD", buyin: 55.00, guaranteed: 25000, type: "REGULAR" },
      { time: "19:05", name: "PKO $3,000 GTD", buyin: 6.60, guaranteed: 3000, type: "BOUNTY" },
      { time: "19:15", name: "Super Hyper $1,250 GTD", buyin: 26.25, guaranteed: 1250, type: "HYPER" },
      { time: "19:30", name: "PKO Turbo $25,000 GTD", buyin: 630.00, guaranteed: 25000, type: "BOUNTY" },
      { time: "19:45", name: "PKO Turbo $1,000 GTD 6-Max", buyin: 11.00, guaranteed: 1000, type: "BOUNTY" },
      { time: "20:05", name: "PKO $15,000 GTD", buyin: 215.00, guaranteed: 15000, type: "BOUNTY" },
      { time: "20:05", name: "Hyper $10,000 GTD", buyin: 88.00, guaranteed: 10000, type: "HYPER" },
      { time: "20:15", name: "PKO Hyper $5,000 GTD", buyin: 21.00, guaranteed: 5000, type: "BOUNTY" },
      { time: "20:30", name: "PKO Turbo $10,000 GTD", buyin: 88.00, guaranteed: 10000, type: "BOUNTY" },
      { time: "20:30", name: "Super Hyper $1,000 GTD", buyin: 15.75, guaranteed: 1000, type: "HYPER" },
      { time: "20:45", name: "Super Bounty FT $2,500 GTD", buyin: 27.50, guaranteed: 2500, type: "TURBO" },
      { time: "21:05", name: "PKO Hyper $1,500 GTD 6-Max", buyin: 31.50, guaranteed: 1500, type: "BOUNTY" },
      { time: "21:30", name: "Mega Stack $1,500 GTD", buyin: 11.00, guaranteed: 1500, type: "REGULAR" },
      { time: "22:05", name: "PKO Turbo $10,000 GTD", buyin: 88.00, guaranteed: 10000, type: "BOUNTY" },
      { time: "22:05", name: "$7,500 GTD", buyin: 33.00, guaranteed: 7500, type: "REGULAR" },
      { time: "22:05", name: "PKO $6,000 GTD", buyin: 16.50, guaranteed: 6000, type: "BOUNTY" },
      { time: "22:30", name: "Freezeout Turbo $600 GTD", buyin: 16.50, guaranteed: 600, type: "TURBO" },
      { time: "23:05", name: "PKO Hyper $2,000 GTD", buyin: 52.50, guaranteed: 2000, type: "BOUNTY" },
      { time: "23:15", name: "PKO $10,000 GTD", buyin: 109.00, guaranteed: 10000, type: "BOUNTY" },
      { time: "23:30", name: "Super Hyper $750 GTD", buyin: 21.00, guaranteed: 750, type: "HYPER" }
    ].forEach(template => {
      tournaments.push({
        id: id++,
        date: dateStr,
        time: template.time,
        site: "YaPoker",
        name: template.name,
        type: template.type || "REGULAR",
        buyin: template.buyin,
        guaranteed: template.guaranteed,
        priority: getYaPriority(template.name),
        status: "Aberto",
        day: date.toLocaleDateString('en-US', { weekday: 'long' })
      });
    });
  }
});

// ✅ Adicionar GGPoker Sunday Specials
const sundays = [
  "2026-01-04",
  "2026-01-11",
  "2026-01-18",
  "2026-01-25"
];

sundays.forEach(dateStr => {
  [
    { time: "12:00", name: "$125 Sunday Winter KICK-OFF", buyin: 125, guaranteed: 100000 },
    { time: "13:00", name: "$250 Sunday MERRY Monster Stack", buyin: 250, guaranteed: 100000 },
    { time: "15:00", name: "$150 Winter GRAND PRIX", buyin: 150, guaranteed: 250000 },
    { time: "17:30", name: "$215 Bounty Hunters Sunday Winter GAMES", buyin: 215, guaranteed: 400000, type: "BOUNTY", priority: "high" },
    { time: "19:00", name: "$250 Sunday Winter CLASSIC", buyin: 250, guaranteed: 250000 },
    { time: "22:15", name: "$77 Sunday Snowy Sevens Turbo", buyin: 77, guaranteed: 100000, type: "TURBO", priority: "very-high" }
  ].forEach(special => {
    tournaments.push({
      id: id++,
      date: dateStr,
      time: special.time,
      site: "GGPoker",
      name: special.name,
      type: special.type || "REGULAR",
      buyin: special.buyin,
      guaranteed: special.guaranteed,
      priority: special.priority || "medium",
      status: "Aberto"
    });
  });
});

res.status(200).json(tournaments);

}
