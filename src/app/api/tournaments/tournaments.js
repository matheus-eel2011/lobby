// tournaments.js
// Gera lista de torneios com UID estável no formato "t31o65h"

/**
 * Gera um UID estável a partir de (site, date, time, name, buyin)
 * Compatível com o formato usado no index.html (base36, prefixo "t").
 */
function makeTournamentKey(t) {
  return `${t.site}|${t.date}|${t.time}|${t.name}|${t.buyin}`;
}

function getStableTournamentUid(t) {
  const key = makeTournamentKey(t);
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 - key.charCodeAt(i)) | 0;
  }
  const base = Math.abs(hash).toString(36);
  return `t${base}`;
}

/**
 * Utilitário de datas no formato YYYY-MM-DD
 */
function formatDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Gera todas as datas de fevereiro/26 (4–29) e março/26 (1–31).
 * Ajuste o intervalo conforme quiser.
 */
function generateDatesForAprAndMay2026() {
  const dates = [];

  // Abril 2026: do dia 4 ao 29 (inclusivo)
  const startApr = new Date(2026, 3, 1); // 1 = fevereiro
  const endApr = new Date(2026, 3, 30);

  for (let d = new Date(startApr); d <= endApr; d.setDate(d.getDate() + 1)) {
    dates.push(new Date(d));
  }

  // Maio 2026: 1 ao 31
  const startMay = new Date(2026, 4, 1); // 2 = março
  const endMay = new Date(2026, 4, 31);

  for (let d = new Date(startMay); d <= endMay; d.setDate(d.getDate() + 1)) {
    dates.push(new Date(d));
  }

  return dates;
}

// Versão que devolve apenas segunda–sexta
function generateWeekdayDatesForAprAndMay2026() {
  return generateDatesForAprAndMay2026().filter((date) => {
    const day = date.getDay(); // 0 = dom, 1 = seg, ..., 6 = sáb
    return day >= 1 && day <= 5;
  });
}


/**
 * Late reg default por tipo – usado quando template não define explicitamente.
 */
const LATE_REG_DEFAULTS = {
  "REG": 120,
  "REG KO": 120,
  "TURBO": 70,
  "TURBO KO": 70,
  "MYSTERY": 120,
  "HYPER": 50,
};

/**
 * Função auxiliar que normaliza e aplica UID em um torneio.
 */
function buildTournament(base) {
  const t = {
    // Sem id numérico: fonte da verdade é uid
    uid: "", // preenchido abaixo
    date: base.date,
    time: base.time,
    site: base.site,
    name: base.name,
    type: base.type,
    buyin: Number(base.buyin || 0),
    guaranteed: Number(base.guaranteed || 0),
    priority: base.priority || "medium",
    status: base.status || "Aberto",
    lateReg:
      base.lateReg != null
        ? Number(base.lateReg)
        : LATE_REG_DEFAULTS[base.type] || 30,
  };

  t.uid = getStableTournamentUid(t);
  return t;
}

/**
 * Exemplo de função de prioridade YaPoker existente.
 * (copiado e corrigido do seu código atual para evitar bug de chaves de if). [file:3]
 */
function getYaPriority(tournamentName) {
  const nameLower = tournamentName.toLowerCase();

  if (
    nameLower.includes("mega stack") ||
    nameLower.includes("deep") ||
    nameLower.includes("freezeout") ||
    nameLower.includes("special") ||
    nameLower.includes("daily double") ||
    nameLower.includes("loncar") ||
    nameLower.includes("boski") ||
    nameLower.includes("early special") ||
    (nameLower.includes("$") &&
      !nameLower.includes("pko") &&
      !nameLower.includes("bounty") &&
      !nameLower.includes("hyper") &&
      !nameLower.includes("turbo"))
  ) {
    return "high";
  }

  if (nameLower.includes("turbo")) {
    return "medium";
  }

  if (
    nameLower.includes("pko") ||
    nameLower.includes("bounty") ||
    nameLower.includes("lightning")
  ) {
    return "low";
  }

  return "medium";
}

/**
 * GGPoker – reutiliza sua config original, mas sem id numérico
 * (mantive apenas alguns templates como ilustração – você pode colar todos). [file:3]
 */
function addGGPokerTournaments(tournaments) {
  const dates = generateWeekdayDatesForAprAndMay2026();

  const ggPokerConfig = {
    // Exemplo de série fixa (poderia ficar só em fevereiro, se quiser)
    mainSeries: [
      {
        date: "2026-02-09",
        time: "09:30",
        name: "$25 Bounty Snowstorm Deepstack Turbo",
        type: "REG KO",
        buyin: 25,
        guaranteed: 50000,
        priority: "medium",
        lateReg: 150,
      },
    ],
    // BountyHunter diários (trecho do seu código). [file:3]
    bountyhunterdailies: [
      { time: "21:10", name: "Speed Racer Bounty $1.08 [10 BB]", buyin: 1.08, guaranteed: 400, type: "TURBO KO", lateReg: 20 },
      { time: "21:10", name: "Speed Racer Bounty $32 [10 BB]", buyin: 32, guaranteed: 7000, type: "TURBO KO", lateReg: 20 },
      { time: "21:10", name: "Speed Racer Bounty $5.40 [10 BB]", buyin: 5.40, guaranteed: 2000, type: "TURBO KO", lateReg: 20 },
      { time: "21:30", name: "Bounty Hunters $2.50", buyin: 2.50, guaranteed: 1000, type: "REG KO", lateReg: 90 },
      { time: "21:30", name: "Bounty Hunters $21.60", buyin: 21.60, guaranteed: 750, type: "REG KO", lateReg: 90 },
      { time: "21:30", name: "Bounty Hunters Big Game $108", buyin: 108, guaranteed: 25000, type: "REG KO", lateReg: 90 },
      { time: "21:30", name: "Bounty Hunters Mini Big Game $10.80", buyin: 10.80, guaranteed: 12500, type: "REG KO", lateReg: 90 },
      { time: "21:45", name: "Bounty Hunters Hyper Special $21.60", buyin: 21.60, guaranteed: 7500, type: "TURBO KO", lateReg: 75 },
      { time: "22:10", name: "Speed Racer Bounty $10.80 [10 BB]", buyin: 10.80, guaranteed: 3000, type: "TURBO KO", lateReg: 20 },
      { time: "22:10", name: "Speed Racer Bounty $88 [10 BB]", buyin: 88, guaranteed: 5000, type: "TURBO KO", lateReg: 20 },
      { time: "22:15", name: "Bounty Hunters Deepstack Turbo $5.40", buyin: 5.40, guaranteed: 4500, type: "REG KO", lateReg: 90 },
      { time: "22:15", name: "Bounty Hunters Deepstack Turbo $54", buyin: 54, guaranteed: 15000, type: "REG KO", lateReg: 90 },
      { time: "22:30", name: "Bounty Hunters $5.40", buyin: 5.40, guaranteed: 600, type: "REG KO", lateReg: 90 },
      { time: "22:30", name: "Bounty Hunters $54", buyin: 54, guaranteed: 600, type: "REG KO", lateReg: 90 },
      { time: "22:30", name: "Bounty Hunters Special $10.80 [6-Max]", buyin: 10.80, guaranteed: 7500, type: "REG KO", lateReg: 135 },
      { time: "22:30", name: "Bounty Hunters Special $108 [6-Max]", buyin: 108, guaranteed: 6000, type: "REG KO", lateReg: 135 },
      { time: "22:30", name: "Bounty Hunters Special $2.50 [6-Max]", buyin: 2.50, guaranteed: 2000, type: "REG KO", lateReg: 135 },
      { time: "22:35", name: "Bounty Hunters Special $3.20", buyin: 3.20, guaranteed: 2250, type: "REG KO", lateReg: 135 },
      { time: "22:45", name: "Bounty Hunters Hyper Special $15", buyin: 15, guaranteed: 6000, type: "TURBO KO", lateReg: 75 },
      { time: "23:10", name: "Speed Racer Bounty $3.20 [10 BB]", buyin: 3.20, guaranteed: 1250, type: "TURBO KO", lateReg: 20 },
      { time: "23:10", name: "Speed Racer Bounty $32 [10 BB]", buyin: 32, guaranteed: 3500, type: "TURBO KO", lateReg: 20 },
      { time: "23:10", name: "Speed Racer Bounty Closer $108 [10 BB]", buyin: 108, guaranteed: 4000, type: "TURBO KO", lateReg: 20 },
      { time: "23:30", name: "Bounty Hunters $1.08", buyin: 1.08, guaranteed: 400, type: "REG KO", lateReg: 90 },
      { time: "23:30", name: "Bounty Hunters $10.80", buyin: 10.80, guaranteed: 1000, type: "REG KO", lateReg: 90 },
      { time: "23:30", name: "Bounty Hunters Turbo Special $2.50", buyin: 2.50, guaranteed: 2000, type: "TURBO KO", lateReg: 135 },
      { time: "23:30", name: "Bounty Hunters Turbo Special $21.60", buyin: 21.60, guaranteed: 6500, type: "TURBO KO", lateReg: 135 },
      { time: "23:30", name: "Bounty Hunters Turbo Special $215", buyin: 215, guaranteed: 6000, type: "TURBO KO", lateReg: 135 },
      { time: "23:45", name: "Bounty Hunters Hyper Special $32", buyin: 32, guaranteed: 7500, type: "TURBO KO", lateReg: 75 },
      { time: "00:10", name: "Speed Racer Bounty $5.40 [10 BB]", buyin: 5.40, guaranteed: 1750, type: "TURBO KO", lateReg: 20 },
      { time: "00:10", name: "Speed Racer Bounty $54 [10 BB]", buyin: 54, guaranteed: 3000, type: "TURBO KO", lateReg: 20 },
      { time: "00:15", name: "Bounty Hunters Deepstack Turbo $8.88", buyin: 8.88, guaranteed: 6500, type: "REG KO", lateReg: 90 },
      { time: "00:15", name: "Bounty Hunters Deepstack Turbo $88", buyin: 88, guaranteed: 7000, type: "REG KO", lateReg: 90 },
      { time: "00:30", name: "Bounty Hunters $2.50", buyin: 2.50, guaranteed: 750, type: "REG KO", lateReg: 90 },
      { time: "00:30", name: "Bounty Hunters $21.60", buyin: 21.60, guaranteed: 750, type: "REG KO", lateReg: 90 },
      { time: "00:30", name: "Bounty Hunters Special $5.40", buyin: 5.40, guaranteed: 4000, type: "REG KO", lateReg: 135 },
      { time: "00:30", name: "Bounty Hunters Special $54", buyin: 54, guaranteed: 15000, type: "REG KO", lateReg: 135 },
      { time: "01:10", name: "Speed Racer Bounty $10.80 [10 BB]", buyin: 10.80, guaranteed: 2500, type: "TURBO KO", lateReg: 20 },
      { time: "01:10", name: "Speed Racer Bounty $2.50 [10 BB]", buyin: 2.50, guaranteed: 1000, type: "TURBO KO", lateReg: 20 },
      { time: "01:10", name: "Speed Racer Bounty $32 [10 BB]", buyin: 32, guaranteed: 2500, type: "TURBO KO", lateReg: 20 },
      { time: "01:30", name: "Bounty Hunters $1.08", buyin: 1.08, guaranteed: 600, type: "REG KO", lateReg: 90 },
      { time: "01:30", name: "Bounty Hunters $10.80", buyin: 10.80, guaranteed: 1000, type: "REG KO", lateReg: 90 },
      { time: "01:30", name: "Bounty Hunters Special $108", buyin: 108, guaranteed: 5000, type: "REG KO", lateReg: 135 },
      { time: "01:30", name: "Bounty Hunters Special $32", buyin: 32, guaranteed: 15000, type: "REG KO", lateReg: 135 },
      { time: "01:31", name: "Bounty Hunters Daily Double $3.20", buyin: 3.20, guaranteed: 3000, type: "REG KO", lateReg: 90 },
      { time: "01:32", name: "Bounty Hunters Daily Double II $3.20", buyin: 3.20, guaranteed: 1500, type: "REG KO", lateReg: 90 },
      { time: "02:10", name: "Speed Racer Bounty $3.20 [10 BB]", buyin: 3.20, guaranteed: 1500, type: "TURBO KO", lateReg: 20 },
      { time: "02:10", name: "Speed Racer Bounty $32 [10 BB]", buyin: 32, guaranteed: 2500, type: "TURBO KO", lateReg: 20 },
      { time: "02:15", name: "Bounty Hunters Turbo Special $2.50 [6-Max]", buyin: 2.50, guaranteed: 2000, type: "TURBO KO", lateReg: 135 },
      { time: "02:15", name: "Bounty Hunters Turbo Special $21.60 [6-Max]", buyin: 21.60, guaranteed: 6500, type: "TURBO KO", lateReg: 135 },
      { time: "02:30", name: "Bounty Hunters $2.50", buyin: 2.50, guaranteed: 600, type: "REG KO", lateReg: 90 },
      { time: "02:30", name: "Bounty Hunters $21.60", buyin: 21.60, guaranteed: 750, type: "REG KO", lateReg: 90 },
      { time: "02:30", name: "Bounty Hunters Special $8.88", buyin: 8.88, guaranteed: 7000, type: "REG KO", lateReg: 135 },
      { time: "02:30", name: "Bounty Hunters Special $88", buyin: 88, guaranteed: 8500, type: "REG KO", lateReg: 135 },
      { time: "03:10", name: "Speed Racer Bounty $2.50 [10 BB]", buyin: 2.50, guaranteed: 1250, type: "TURBO KO", lateReg: 20 },
      { time: "03:10", name: "Speed Racer Bounty $21.60 [10 BB]", buyin: 21.60, guaranteed: 2500, type: "TURBO KO", lateReg: 20 },
      { time: "03:30", name: "Bounty Hunters $3.20", buyin: 3.20, guaranteed: 1250, type: "REG KO", lateReg: 90 },
      { time: "03:30", name: "Bounty Hunters $32", buyin: 32, guaranteed: 1000, type: "REG KO", lateReg: 90 },
      { time: "03:30", name: "Bounty Hunters Special $108", buyin: 108, guaranteed: 6000, type: "REG KO", lateReg: 135 },
      { time: "03:31", name: "Bounty Hunters Daily Double $10.80", buyin: 10.80, guaranteed: 15000, type: "REG KO", lateReg: 90 },
      { time: "03:32", name: "Bounty Hunters Daily Double II $10.80", buyin: 10.80, guaranteed: 6000, type: "REG KO", lateReg: 90 },
      { time: "03:45", name: "Bounty Hunters Hyper Special $5.40", buyin: 5.40, guaranteed: 4000, type: "TURBO KO", lateReg: 75 },
      { time: "03:45", name: "Bounty Hunters Hyper Special $54", buyin: 54, guaranteed: 7500, type: "TURBO KO", lateReg: 75 },
      { time: "04:10", name: "Speed Racer Bounty $32 [10 BB]", buyin: 32, guaranteed: 3000, type: "TURBO KO", lateReg: 20 },
      { time: "04:10", name: "Speed Racer Bounty $5.40 [10 BB]", buyin: 5.40, guaranteed: 2250, type: "TURBO KO", lateReg: 20 },
      { time: "04:30", name: "Bounty Hunters $2.50", buyin: 2.50, guaranteed: 1000, type: "REG KO", lateReg: 90 },
      { time: "04:30", name: "Bounty Hunters $21.60", buyin: 21.60, guaranteed: 1250, type: "REG KO", lateReg: 90 },
      { time: "04:30", name: "Bounty Hunters Special $1.08", buyin: 1.08, guaranteed: 2000, type: "REG KO", lateReg: 135 },
      { time: "04:30", name: "Bounty Hunters Special $5.40", buyin: 5.40, guaranteed: 7500, type: "REG KO", lateReg: 135 },
      { time: "04:30", name: "Bounty Hunters Special $54", buyin: 54, guaranteed: 20000, type: "REG KO", lateReg: 135 },
      { time: "05:10", name: "Speed Racer Bounty $2.50 [10 BB]", buyin: 2.50, guaranteed: 1500, type: "TURBO KO", lateReg: 20 },
      { time: "05:10", name: "Speed Racer Bounty $21.60 [10 BB]", buyin: 21.60, guaranteed: 4000, type: "TURBO KO", lateReg: 20 },
      { time: "05:30", name: "Bounty Hunters $1.08", buyin: 1.08, guaranteed: 500, type: "REG KO", lateReg: 90 },
      { time: "05:30", name: "Bounty Hunters $10.80", buyin: 10.80, guaranteed: 2000, type: "REG KO", lateReg: 90 },
      { time: "05:30", name: "Bounty Hunters Special $215", buyin: 215, guaranteed: 7500, type: "REG KO", lateReg: 135 },
      { time: "05:30", name: "Bounty Hunters Special $3.20", buyin: 3.20, guaranteed: 5000, type: "REG KO", lateReg: 135 },
      { time: "05:30", name: "Bounty Hunters Special $32", buyin: 32, guaranteed: 20000, type: "REG KO", lateReg: 135 },
      { time: "05:45", name: "Bounty Hunters Hyper Special $2.50", buyin: 2.50, guaranteed: 2000, type: "TURBO KO", lateReg: 75 },
      { time: "05:45", name: "Bounty Hunters Hyper Special $21.60", buyin: 21.60, guaranteed: 8000, type: "TURBO KO", lateReg: 75 },
      { time: "06:10", name: "Speed Racer Bounty $1.08 [10 BB]", buyin: 1.08, guaranteed: 600, type: "TURBO KO", lateReg: 20 },
      { time: "06:10", name: "Speed Racer Bounty $5.40 [10 BB]", buyin: 5.40, guaranteed: 2500, type: "TURBO KO", lateReg: 20 },
      { time: "06:10", name: "Speed Racer Bounty $54 [10 BB]", buyin: 54, guaranteed: 5000, type: "TURBO KO", lateReg: 20 },
      { time: "06:30", name: "Bounty Hunters $2.50", buyin: 2.50, guaranteed: 1000, type: "REG KO", lateReg: 90 },
      { time: "06:30", name: "Bounty Hunters $21.60", buyin: 21.60, guaranteed: 1750, type: "REG KO", lateReg: 90 },
      { time: "06:30", name: "Bounty Hunters Big One $1.08", buyin: 1.08, guaranteed: 2500, type: "REG KO", lateReg: 90 },
      { time: "06:30", name: "Bounty Hunters Special $10.80", buyin: 10.80, guaranteed: 20000, type: "REG KO", lateReg: 135 },
      { time: "06:30", name: "Bounty Hunters Special $108", buyin: 108, guaranteed: 10000, type: "REG KO", lateReg: 135 },
      { time: "07:10", name: "Speed Racer Bounty $3.20 [10 BB]", buyin: 3.20, guaranteed: 2000, type: "TURBO KO", lateReg: 20 },
      { time: "07:10", name: "Speed Racer Bounty $32 [10 BB]", buyin: 32, guaranteed: 5000, type: "TURBO KO", lateReg: 20 },
      { time: "07:30", name: "Bounty Hunters $5.40", buyin: 5.40, guaranteed: 2500, type: "REG KO", lateReg: 90 },
      { time: "07:30", name: "Bounty Hunters $54", buyin: 54, guaranteed: 1000, type: "REG KO", lateReg: 90 },
      { time: "07:30", name: "Bounty Hunters Special $88", buyin: 88, guaranteed: 12500, type: "REG KO", lateReg: 135 },
      { time: "07:31", name: "Bounty Hunters Daily Double $8.88", buyin: 8.88, guaranteed: 10000, type: "REG KO", lateReg: 90 },
      { time: "07:32", name: "Bounty Hunters Daily Double II $8.88", buyin: 8.88, guaranteed: 5000, type: "REG KO", lateReg: 90 },
      { time: "07:45", name: "Bounty Hunters Hyper Special $3.20", buyin: 3.20, guaranteed: 3500, type: "TURBO KO", lateReg: 75 },
      { time: "07:45", name: "Bounty Hunters Hyper Special $32", buyin: 32, guaranteed: 10000, type: "TURBO KO", lateReg: 75 },
      { time: "08:10", name: "Speed Racer Bounty $5.40 [10 BB]", buyin: 5.40, guaranteed: 3000, type: "TURBO KO", lateReg: 20 },
      { time: "08:10", name: "Speed Racer Bounty $54 [10 BB]", buyin: 54, guaranteed: 5000, type: "TURBO KO", lateReg: 20 },
      { time: "08:15", name: "Bounty Hunters Deepstack Turbo $10.80", buyin: 10.80, guaranteed: 10000, type: "REG KO", lateReg: 90 },
      { time: "08:15", name: "Bounty Hunters Deepstack Turbo $3.20", buyin: 3.20, guaranteed: 6500, type: "REG KO", lateReg: 90 },
      { time: "08:15", name: "Bounty Hunters Deepstack Turbo $32", buyin: 32, guaranteed: 15000, type: "REG KO", lateReg: 90 },
      { time: "08:30", name: "Bounty Hunters $3.20", buyin: 3.20, guaranteed: 1250, type: "REG KO", lateReg: 90 },
      { time: "08:30", name: "Bounty Hunters $32", buyin: 32, guaranteed: 1250, type: "REG KO", lateReg: 90 },
      { time: "08:30", name: "Bounty Hunters Special $10.80 [7-Max]", buyin: 10.80, guaranteed: 20000, type: "REG KO", lateReg: 135 },
      { time: "08:30", name: "Bounty Hunters Special $108 [7-Max]", buyin: 108, guaranteed: 7500, type: "REG KO", lateReg: 135 },
      { time: "08:30", name: "Bounty Hunters Special $2.50 [7-Max]", buyin: 2.50, guaranteed: 4000, type: "REG KO", lateReg: 135 },
      { time: "09:10", name: "Speed Racer Bounty $2.50 [10 BB]", buyin: 2.50, guaranteed: 2000, type: "TURBO KO", lateReg: 20 },
      { time: "09:10", name: "Speed Racer Bounty $32 [10 BB]", buyin: 32, guaranteed: 5000, type: "TURBO KO", lateReg: 20 },
      { time: "09:15", name: "Bounty Hunters Deepstack Turbo $8.88", buyin: 8.88, guaranteed: 15000, type: "REG KO", lateReg: 90 },
      { time: "09:15", name: "Bounty Hunters Deepstack Turbo $88", buyin: 88, guaranteed: 15000, type: "REG KO", lateReg: 90 },
      { time: "09:30", name: "Bounty Hunters $5.40", buyin: 5.40, guaranteed: 3000, type: "REG KO", lateReg: 90 },
      { time: "09:30", name: "Bounty Hunters $54", buyin: 54, guaranteed: 1250, type: "REG KO", lateReg: 90 },
      { time: "09:30", name: "Bounty Hunters Special $2.50", buyin: 2.50, guaranteed: 6000, type: "REG KO", lateReg: 135 },
      { time: "09:30", name: "Bounty Hunters Special $21.60", buyin: 21.60, guaranteed: 25000, type: "REG KO", lateReg: 135 },
      { time: "09:30", name: "Bounty Hunters Special $215", buyin: 215, guaranteed: 10000, type: "REG KO", lateReg: 135 },
      { time: "10:10", name: "Speed Racer Bounty $5.40 [10 BB]", buyin: 5.40, guaranteed: 4000, type: "TURBO KO", lateReg: 20 },
      { time: "10:10", name: "Speed Racer Bounty $54 [10 BB]", buyin: 54, guaranteed: 10000, type: "TURBO KO", lateReg: 20 },
      { time: "10:15", name: "Bounty Hunters Deepstack Turbo $5.40", buyin: 5.40, guaranteed: 15000, type: "REG KO", lateReg: 90 },
      { time: "10:15", name: "Bounty Hunters Deepstack Turbo $54", buyin: 54, guaranteed: 40000, type: "REG KO", lateReg: 90 },
      { time: "10:30", name: "Bounty Hunters $3.20", buyin: 3.20, guaranteed: 2500, type: "REG KO", lateReg: 90 },
      { time: "10:30", name: "Bounty Hunters Special $15", buyin: 15, guaranteed: 50000, type: "REG KO", lateReg: 165 },
      { time: "10:30", name: "Bounty Hunters $32", buyin: 32, guaranteed: 2000, type: "REG KO", lateReg: 90 },
      { time: "10:30", name: "Bounty Hunters Special $108", buyin: 108, guaranteed: 7500, type: "REG KO", lateReg: 135 },
      { time: "10:31", name: "Bounty Hunters Daily Double $10.80", buyin: 10.80, guaranteed: 25000, type: "REG KO", lateReg: 90 },
      { time: "10:32", name: "Bounty Hunters Daily Double II $10.80", buyin: 10.80, guaranteed: 10000, type: "REG KO", lateReg: 90 },
      { time: "11:05", name: "Bounty Hunters Fifty Stack $5.40", buyin: 5.40, guaranteed: 20000, type: "REG KO", lateReg: 90 },
      { time: "11:05", name: "Bounty Hunters Fifty Stack $54", buyin: 54, guaranteed: 50000, type: "REG KO", lateReg: 90 },
      { time: "13:10", name: "Speed Racer Bounty $2.50 [10 BB]", buyin: 2.50, guaranteed: 2500, type: "TURBO KO", lateReg: 20 },
      { time: "13:10", name: "Speed Racer Bounty $21.60 [10 BB]", buyin: 21.60, guaranteed: 7000, type: "TURBO KO", lateReg: 20 },
      { time: "13:10", name: "Speed Racer Bounty Asia $88 [10 BB]", buyin: 88, guaranteed: 7500, type: "TURBO KO", lateReg: 20 },
      { time: "13:15", name: "Bounty Hunters Deepstack Turbo $3.20", buyin: 3.20, guaranteed: 10000, type: "REG KO", lateReg: 125 },
      { time: "13:15", name: "Bounty Hunters Deepstack Turbo $32", buyin: 32, guaranteed: 30000, type: "REG KO", lateReg: 125 },
      { time: "13:30", name: "Bounty Hunters $2.50", buyin: 2.50, guaranteed: 1500, type: "REG KO", lateReg: 90 },
      { time: "13:30", name: "Bounty Hunters $21.60", buyin: 21.60, guaranteed: 4000, type: "REG KO", lateReg: 90 },
      { time: "11:30", name: "Bounty Hunters Special $8.88", buyin: 8.88, guaranteed: 20000, type: "REG KO", lateReg: 135 },
      { time: "11:30", name: "Bounty Hunters Special $88", buyin: 88, guaranteed: 20000, type: "REG KO", lateReg: 135 },
      { time: "14:10", name: "Speed Racer Bounty $10.80 [10 BB]", buyin: 10.80, guaranteed: 7500, type: "TURBO KO", lateReg: 20 },
      { time: "14:10", name: "Speed Racer Bounty $88 [10 BB]", buyin: 88, guaranteed: 8000, type: "TURBO KO", lateReg: 20 },
      { time: "14:15", name: "Bounty Hunters Deepstack Turbo $2.50", buyin: 2.50, guaranteed: 7500, type: "REG KO", lateReg: 90 },
      { time: "14:15", name: "Bounty Hunters Deepstack Turbo $21.60", buyin: 21.60, guaranteed: 25000, type: "REG KO", lateReg: 90 },
      { time: "14:30", name: "Bounty Hunters $5.40", buyin: 5.40, guaranteed: 4000, type: "REG KO", lateReg: 90 },
      { time: "14:30", name: "Bounty Hunters $54", buyin: 54, guaranteed: 2000, type: "REG KO", lateReg: 90 },
      { time: "14:30", name: "Bounty Hunters Big Game $21.60", buyin: 21.60, guaranteed: 75000, type: "REG KO", lateReg: 170 },
      //{ time: "14:30", name: "Bounty Hunters Special $10.80", buyin: 10.80, guaranteed: 50000, type: "REG KO", lateReg: 135 },
      { time: "12:30", name: "Bounty Hunters Special $150", buyin: 150, guaranteed: 25000, type: "REG KO", lateReg: 135 },
      { time: "12:35", name: "Bounty Hunters Forty Stack $44", buyin: 44, guaranteed: 60000, type: "REG KO", lateReg: 90 },
      { time: "15:05", name: "Mini Thursday Throwdown", buyin: 15, guaranteed: 75000, type: "REG KO", lateReg: 150 },
      { time: "15:10", name: "Speed Racer Bounty $3.20 [10 BB]", buyin: 3.20, guaranteed: 3000, type: "TURBO KO", lateReg: 20 },
      { time: "15:10", name: "Speed Racer Bounty $32 [10 BB]", buyin: 32, guaranteed: 7000, type: "TURBO KO", lateReg: 20 },
      { time: "15:10", name: "Speed Racer Bounty Europe $108 [10 BB]", buyin: 108, guaranteed: 7500, type: "TURBO KO", lateReg: 20 },
      { time: "15:15", name: "Bounty Hunters Deepstack Turbo $3.20", buyin: 3.20, guaranteed: 10000, type: "REG KO", lateReg: 90 },
      { time: "15:15", name: "Bounty Hunters Deepstack Turbo $32", buyin: 32, guaranteed: 20000, type: "REG KO", lateReg: 90 },
      { time: "15:30", name: "Bounty Hunters $2.50", buyin: 2.50, guaranteed: 1500, type: "REG KO", lateReg: 90 },
      { time: "15:30", name: "Bounty Hunters $21.60", buyin: 21.60, guaranteed: 2500, type: "REG KO", lateReg: 90 },
      { time: "13:30", name: "Bounty Hunters Daily Main $54", buyin: 54, guaranteed: 200000, type: "REG KO", lateReg: 90 },
      { time: "13:30", name: "Bounty Hunters Mini Main $5.40", buyin: 5.40, guaranteed: 30000, type: "REG KO", lateReg: 90 },
      { time: "16:10", name: "Speed Racer Bounty $10.80 [10 BB]", buyin: 10.80, guaranteed: 7000, type: "TURBO KO", lateReg: 20 },
      { time: "16:10", name: "Speed Racer Bounty $2.50 [10 BB]", buyin: 2.50, guaranteed: 2500, type: "TURBO KO", lateReg: 20 },
      { time: "16:15", name: "Bounty Hunters Deepstack Turbo $8.88", buyin: 8.88, guaranteed: 15000, type: "REG KO", lateReg: 90 },
      { time: "16:15", name: "Bounty Hunters Deepstack Turbo $88", buyin: 88, guaranteed: 15000, type: "REG KO", lateReg: 90 },
      { time: "16:30", name: "Bounty Hunters $5.40", buyin: 5.40, guaranteed: 3000, type: "REG KO", lateReg: 90 },
      { time: "16:30", name: "Bounty Hunters $54", buyin: 54, guaranteed: 2000, type: "REG KO", lateReg: 90 },
      { time: "16:30", name: "Bounty Hunters Big Game $21.60", buyin: 21.60, guaranteed: 60000, type: "REG KO", lateReg: 90 },
      { time: "16:30", name: "Bounty Hunters Mini Big Game $2.50", buyin: 2.50, guaranteed: 12500, type: "REG KO", lateReg: 90 },
      { time: "16:35", name: "Bounty Hunters Big Game II $21.60", buyin: 21.60, guaranteed: 20000, type: "REG KO", lateReg: 90 },
      { time: "16:35", name: "Bounty Hunters Mini Big Game II $2.50", buyin: 2.50, guaranteed: 4000, type: "REG KO", lateReg: 90 },
      { time: "17:10", name: "Speed Racer Bounty $108 [10 BB]", buyin: 108, guaranteed: 10000, type: "TURBO KO", lateReg: 20 },
      { time: "17:10", name: "Speed Racer Bounty $32 [10 BB]", buyin: 32, guaranteed: 7000, type: "TURBO KO", lateReg: 20 },
      { time: "17:15", name: "Bounty Hunters Deepstack Turbo $5.40", buyin: 5.40, guaranteed: 15000, type: "REG KO", lateReg: 90 },
      { time: "17:15", name: "Bounty Hunters Deepstack Turbo $54", buyin: 54, guaranteed: 30000, type: "REG KO", lateReg: 90 },
      { time: "17:30", name: "Bounty Hunters $3.20", buyin: 3.20, guaranteed: 1250, type: "REG KO", lateReg: 90 },
      { time: "17:30", name: "Bounty Hunters $32", buyin: 32, guaranteed: 1250, type: "REG KO", lateReg: 90 },
      { time: "17:30", name: "Bounty Hunters Special $108", buyin: 108, guaranteed: 7500, type: "REG KO", lateReg: 135 },
      { time: "17:31", name: "Bounty Hunters Daily Double $10.80", buyin: 10.80, guaranteed: 25000, type: "REG KO", lateReg: 90 },
      { time: "17:32", name: "Bounty Hunters Daily Double II $10.80", buyin: 10.80, guaranteed: 10000, type: "REG KO", lateReg: 90 },
      { time: "18:05", name: "Bounty Hunters Fifty Stack $5.40", buyin: 5.40, guaranteed: 20000, type: "REG KO", lateReg: 90 },
      { time: "18:05", name: "Bounty Hunters Fifty Stack $54", buyin: 54, guaranteed: 50000, type: "REG KO", lateReg: 90 },
      { time: "18:10", name: "Speed Racer Bounty $5.40 [10 BB]", buyin: 5.40, guaranteed: 6000, type: "TURBO KO", lateReg: 20 },
      { time: "18:10", name: "Speed Racer Bounty $54 [10 BB]", buyin: 54, guaranteed: 10000, type: "TURBO KO", lateReg: 20 },
      { time: "18:30", name: "Bounty Hunters $1.08", buyin: 1.08, guaranteed: 700, type: "REG KO", lateReg: 90 },
      { time: "18:30", name: "Bounty Hunters $10.80", buyin: 10.80, guaranteed: 2000, type: "REG KO", lateReg: 90 },
      { time: "18:30", name: "Bounty Hunters Encore $54", buyin: 54, guaranteed: 25000, type: "REG KO", lateReg: 90 },
      { time: "18:30", name: "Bounty Hunters Special $5.40", buyin: 5.40, guaranteed: 6000, type: "REG KO", lateReg: 135 },
      { time: "18:45", name: "Bounty Hunters Hyper Special $10.80", buyin: 10.80, guaranteed: 10000, type: "TURBO KO", lateReg: 75 },
      { time: "18:45", name: "Bounty Hunters Hyper Special $108", buyin: 108, guaranteed: 7500, type: "TURBO KO", lateReg: 75 },
      { time: "20:05", name: "Daily Heater $215 [Bounty Turbo]", buyin: 215, guaranteed: 30000, type: "TURBO KO", lateReg: 135 },
      { time: "20:05", name: "Mini Heater $2.50 [Bounty Turbo]", buyin: 2.50, guaranteed: 6000, type: "TURBO KO", lateReg: 135 },
      { time: "20:10", name: "Speed Racer Bounty $1.08 [10 BB]", buyin: 1.08, guaranteed: 1000, type: "TURBO KO", lateReg: 20 },
      { time: "20:10", name: "Speed Racer Bounty $10.80 [10 BB]", buyin: 10.80, guaranteed: 7000, type: "TURBO KO", lateReg: 20 },
      { time: "20:10", name: "Speed Racer Bounty $108 [10 BB]", buyin: 108, guaranteed: 6000, type: "TURBO KO", lateReg: 20 },
      { time: "20:30", name: "Bounty Hunters $2.50", buyin: 2.50, guaranteed: 750, type: "REG KO", lateReg: 90 },
      { time: "20:30", name: "Bounty Hunters $21.60", buyin: 21.60, guaranteed: 1500, type: "REG KO", lateReg: 90 },
      { time: "20:31", name: "Bounty Hunters Daily Double $8.88", buyin: 8.88, guaranteed: 5000, type: "REG KO", lateReg: 90 },
      { time: "20:32", name: "Bounty Hunters Daily Double II $8.88", buyin: 8.88, guaranteed: 3000, type: "REG KO", lateReg: 90 },
      { time: "21:05", name: "Mini SUPER SIX Bounty Turbo $6.60", buyin: 6.60, guaranteed: 6000, type: "TURBO KO", lateReg: 135 },
      { time: "21:05", name: "SUPER SIX Bounty Turbo $66", buyin: 66, guaranteed: 25000, type: "TURBO KO", lateReg: 135 },
      { time: "21:10", name: "Speed Racer Bounty $5.40 [10 BB]", buyin: 5.40, guaranteed: 3500, type: "TURBO KO", lateReg: 20 },
      { time: "21:10", name: "Speed Racer Bounty $54 [10 BB]", buyin: 54, guaranteed: 12500, type: "TURBO KO", lateReg: 20 },
      { time: "21:15", name: "Bounty Hunters Deepstack Turbo $10.80", buyin: 10.80, guaranteed: 12500, type: "REG KO", lateReg: 90 },
      { time: "21:15", name: "Bounty Hunters Deepstack Turbo $108", buyin: 108, guaranteed: 7000, type: "REG KO", lateReg: 90 },
      { time: "21:30", name: "Bounty Hunters $3.20", buyin: 3.20, guaranteed: 1000, type: "REG KO", lateReg: 90 },
      { time: "21:30", name: "Bounty Hunters $32", buyin: 32, guaranteed: 1000, type: "REG KO", lateReg: 90 },
      { time: "21:30", name: "Bounty Hunters Closer $10.80", buyin: 10.80, guaranteed: 7000, type: "REG KO", lateReg: 90 },
      { time: "21:30", name: "Bounty Hunters Closer $108", buyin: 108, guaranteed: 5000, type: "REG KO", lateReg: 90 },
      { time: "21:45", name: "Bounty Hunters Hyper Special $5.40", buyin: 5.40, guaranteed: 3500, type: "TURBO KO", lateReg: 75 },
      { time: "21:45", name: "Bounty Hunters Hyper Special $54", buyin: 54, guaranteed: 12500, type: "TURBO KO", lateReg: 75 },
      { time: "22:10", name: "Speed Racer Bounty $2.50 [10 BB]", buyin: 2.50, guaranteed: 1250, type: "TURBO KO", lateReg: 20 },
      { time: "22:10", name: "Speed Racer Bounty $21.60 [10 BB]", buyin: 21.60, guaranteed: 5000, type: "TURBO KO", lateReg: 20 },
      { time: "22:10", name: "Speed Racer Bounty Americas $108 [10 BB]", buyin: 108, guaranteed: 7500, type: "TURBO KO", lateReg: 20 },
      { time: "22:15", name: "Bounty Hunters Deepstack Turbo $3.20", buyin: 3.20, guaranteed: 4000, type: "REG KO", lateReg: 90 },
      { time: "22:15", name: "Bounty Hunters Deepstack Turbo $32", buyin: 32, guaranteed: 15000, type: "REG KO", lateReg: 90 },
      { time: "22:30", name: "Bounty Hunters $1.08", buyin: 1.08, guaranteed: 600, type: "REG KO", lateReg: 90 },
      { time: "22:30", name: "Bounty Hunters $8.88", buyin: 8.88, guaranteed: 1500, type: "REG KO", lateReg: 90 },
      { time: "22:30", name: "Bounty Hunters $88", buyin: 88, guaranteed: 1000, type: "REG KO", lateReg: 90 },
      { time: "22:30", name: "Daily Last Call $21.60 [Bounty Hyper]", buyin: 21.60, guaranteed: 10000, type: "TURBO KO", lateReg: 75 },
      { time: "22:30", name: "Daily Last Call $215 [Bounty Hyper]", buyin: 215, guaranteed: 10000, type: "TURBO KO", lateReg: 75 },
      { time: "22:30", name: "Mini Last Call $2.50 [Bounty Hyper]", buyin: 2.50, guaranteed: 2000, type: "TURBO KO", lateReg: 75 },
      { time: "18:10", name: "Speed Racer Bounty $3.20 [10 BB]", buyin: 3.20, guaranteed: 3000, type: "TURBO KO", lateReg: 20 },
      { time: "18:10", name: "Speed Racer Bounty $32 [10 BB]", buyin: 32, guaranteed: 7000, type: "TURBO KO", lateReg: 20 },
      { time: "18:10", name: "Speed Racer Bounty Europe $108 [10 BB]", buyin: 108, guaranteed: 7500, type: "TURBO KO", lateReg: 20 },
      { time: "18:15", name: "Bounty Hunters Deepstack Turbo $3.20", buyin: 3.20, guaranteed: 10000, type: "REG KO", lateReg: 90 },
      { time: "18:15", name: "Bounty Hunters Deepstack Turbo $32", buyin: 32, guaranteed: 20000, type: "REG KO", lateReg: 90 },
      { time: "18:30", name: "Bounty Hunters $2.50", buyin: 2.50, guaranteed: 1500, type: "REG KO", lateReg: 90 },
      { time: "18:30", name: "Bounty Hunters $21.60", buyin: 21.60, guaranteed: 2500, type: "REG KO", lateReg: 90 },
      { time: "18:30", name: "Bounty Hunters Daily Main $54", buyin: 54, guaranteed: 200000, type: "REG KO", lateReg: 90 },
      { time: "18:30", name: "Bounty Hunters Mini Main $5.40", buyin: 5.40, guaranteed: 30000, type: "REG KO", lateReg: 90 },
      { time: "19:10", name: "Speed Racer Bounty $10.80 [10 BB]", buyin: 10.80, guaranteed: 7000, type: "TURBO KO", lateReg: 20 },
      { time: "19:10", name: "Speed Racer Bounty $2.50 [10 BB]", buyin: 2.50, guaranteed: 2500, type: "TURBO KO", lateReg: 20 },
      { time: "19:15", name: "Bounty Hunters Deepstack Turbo $8.88", buyin: 8.88, guaranteed: 15000, type: "REG KO", lateReg: 90 },
      { time: "19:15", name: "Bounty Hunters Deepstack Turbo $88", buyin: 88, guaranteed: 15000, type: "REG KO", lateReg: 90 },
      { time: "19:30", name: "Bounty Hunters $5.40", buyin: 5.40, guaranteed: 3000, type: "REG KO", lateReg: 90 },
      { time: "19:30", name: "Bounty Hunters $54", buyin: 54, guaranteed: 2000, type: "REG KO", lateReg: 90 },
      { time: "19:30", name: "Bounty Hunters Special $8.88", buyin: 8.88, guaranteed: 6000, type: "REG KO", lateReg: 125 },
      { time: "15:30", name: "Bounty Hunters Big Game $21.60", buyin: 21.60, guaranteed: 60000, type: "REG KO", lateReg: 90 },
      { time: "19:30", name: "Bounty Hunters Mini Big Game $2.50", buyin: 2.50, guaranteed: 12500, type: "REG KO", lateReg: 90 },
      { time: "19:35", name: "Bounty Hunters Big Game II $21.60", buyin: 21.60, guaranteed: 20000, type: "REG KO", lateReg: 90 },
      { time: "19:35", name: "Bounty Hunters Mini Big Game II $2.50", buyin: 2.50, guaranteed: 4000, type: "REG KO", lateReg: 90 },
      { time: "20:10", name: "Speed Racer Bounty $108 [10 BB]", buyin: 108, guaranteed: 10000, type: "TURBO KO", lateReg: 20 },
      { time: "20:10", name: "Speed Racer Bounty $32 [10 BB]", buyin: 32, guaranteed: 7000, type: "TURBO KO", lateReg: 20 },
      { time: "20:15", name: "Bounty Hunters Deepstack Turbo $5.40", buyin: 5.40, guaranteed: 15000, type: "REG KO", lateReg: 90 },
      { time: "20:15", name: "Bounty Hunters Deepstack Turbo $54", buyin: 54, guaranteed: 30000, type: "REG KO", lateReg: 90 },
      { time: "20:30", name: "Bounty Hunters $3.20", buyin: 3.20, guaranteed: 1250, type: "REG KO", lateReg: 90 },
      { time: "20:30", name: "Bounty Hunters $32", buyin: 32, guaranteed: 1500, type: "REG KO", lateReg: 90 },
      { time: "20:30", name: "Bounty Hunters 25 Grand $10.80", buyin: 10.80, guaranteed: 25000, type: "REG KO", lateReg: 90 },
      { time: "20:30", name: "Bounty Hunters Special $1.08", buyin: 1.08, guaranteed: 2500, type: "REG KO", lateReg: 135 },
      { time: "21:10", name: "Speed Racer Bounty $21.60 [10 BB]", buyin: 21.60, guaranteed: 7000, type: "TURBO KO", lateReg: 20 },
      { time: "21:10", name: "Speed Racer Bounty $3.20 [10 BB]", buyin: 3.20, guaranteed: 3000, type: "TURBO KO", lateReg: 20 },
      { time: "21:10", name: "Speed Racer Bounty Europe $108 [10 BB]", buyin: 108, guaranteed: 7500, type: "TURBO KO", lateReg: 20 },
      { time: "21:15", name: "Bounty Hunters Deepstack Turbo $8.88", buyin: 8.88, guaranteed: 15000, type: "REG KO", lateReg: 90 },
      { time: "21:15", name: "Bounty Hunters Deepstack Turbo $88", buyin: 88, guaranteed: 10000, type: "REG KO", lateReg: 90 },
      { time: "21:30", name: "Bounty Hunters $1.08", buyin: 1.08, guaranteed: 1000, type: "REG KO", lateReg: 90 },
      { time: "21:30", name: "Bounty Hunters $10.80", buyin: 10.80, guaranteed: 2500, type: "REG KO", lateReg: 90 },
      { time: "21:30", name: "Bounty King $32", buyin: 32, guaranteed: 35000, type: "REG KO", lateReg: 135 },
      { time: "21:30", name: "Bounty King HR $320", buyin: 320, guaranteed: 15000, type: "REG KO", lateReg: 135 },
      { time: "21:30", name: "Bounty King Jr $3.20", buyin: 3.20, guaranteed: 8000, type: "REG KO", lateReg: 135 },


    ],
    turboDailies: [
      { time: "00:15", name: "Daily Turbo $5", buyin: 5, guaranteed: 400, lateReg: 70 },
      { time: "00:15", name: "Daily Turbo $20", buyin: 20, guaranteed: 400, lateReg: 70 },
      { time: "00:15", name: "Daily Turbo $1", buyin: 1, guaranteed: 225, lateReg: 70 },
      { time: "01:15", name: "Daily Turbo $15", buyin: 15, guaranteed: 500, lateReg: 70 },
      { time: "01:15", name: "Daily Turbo $60", buyin: 60, guaranteed: 500, lateReg: 70 },
      { time: "01:15", name: "Daily Turbo $2", buyin: 2, guaranteed: 250, lateReg: 70 },
      { time: "02:15", name: "Daily Turbo $50", buyin: 50, guaranteed: 700, lateReg: 70 },
      { time: "02:15", name: "Daily Turbo $10", buyin: 10, guaranteed: 500, lateReg: 70 },
      { time: "02:15", name: "Daily Turbo $1", buyin: 1, guaranteed: 300, lateReg: 70 },
      { time: "03:15", name: "Daily Turbo $20", buyin: 20, guaranteed: 500, lateReg: 70 },
      { time: "03:15", name: "Daily Turbo $1", buyin: 1, guaranteed: 350, lateReg: 70 },
      { time: "03:15", name: "Daily Turbo $5", buyin: 5, guaranteed: 500, lateReg: 70 },
      { time: "04:15", name: "Superstack Turbo Special $25", buyin: 25, guaranteed: 5000, lateReg: 70 },
      { time: "04:15", name: "Daily Turbo $50", buyin: 50, guaranteed: 750, lateReg: 70 },
      { time: "04:15", name: "Daily Turbo $10", buyin: 10, guaranteed: 600, lateReg: 70 },
      { time: "05:15", name: "Daily Turbo $1", buyin: 1, guaranteed: 300, lateReg: 70 },
      { time: "05:15", name: "Daily Turbo $20", buyin: 20, guaranteed: 600, lateReg: 70 },
      { time: "05:15", name: "Daily Turbo $60", buyin: 60, guaranteed: 750, lateReg: 70 },
      { time: "05:15", name: "Daily Turbo $5", buyin: 5, guaranteed: 600, lateReg: 70 },
      { time: "06:15", name: "Daily Turbo $8", buyin: 8, guaranteed: 800, lateReg: 70 },
      { time: "06:15", name: "Daily Turbo $2", buyin: 2, guaranteed: 400, lateReg: 70 },
      { time: "06:15", name: "Daily Turbo $30", buyin: 30, guaranteed: 750, lateReg: 70 },
      { time: "07:15", name: "Daily Turbo $20", buyin: 20, guaranteed: 1000, lateReg: 70 },
      { time: "07:15", name: "Daily Turbo $80", buyin: 80, guaranteed: 1000, lateReg: 70 },
      { time: "07:15", name: "Daily Turbo $1", buyin: 1, guaranteed: 400, lateReg: 70 },
      { time: "07:15", name: "Daily Turbo $5", buyin: 5, guaranteed: 750, lateReg: 70 },
      { time: "08:15", name: "Daily Turbo $10", buyin: 10, guaranteed: 1000, lateReg: 70 },
      { time: "08:15", name: "Daily Turbo $50", buyin: 50, guaranteed: 600, lateReg: 70 },
      { time: "08:15", name: "Daily Turbo $2", buyin: 2, guaranteed: 500, lateReg: 70 },
      { time: "09:15", name: "Daily Turbo $100", buyin: 100, guaranteed: 1000, lateReg: 70 },
      { time: "09:15", name: "Daily Turbo $5", buyin: 5, guaranteed: 1000, lateReg: 70 },
      { time: "09:15", name: "Daily Turbo $1", buyin: 1, guaranteed: 600, lateReg: 70 },
      { time: "09:15", name: "Daily Turbo $20", buyin: 20, guaranteed: 1000, lateReg: 70 },
      { time: "10:15", name: "Daily Turbo $10", buyin: 10, guaranteed: 1250, lateReg: 70 },
      { time: "10:15", name: "Daily Turbo $50", buyin: 50, guaranteed: 1000, lateReg: 70 },
      { time: "10:15", name: "Daily Turbo $2", buyin: 2, guaranteed: 600, lateReg: 70 },
      { time: "11:15", name: "Daily Turbo $1", buyin: 1, guaranteed: 750, lateReg: 70 },
      { time: "11:15", name: "Daily Turbo $100", buyin: 100, guaranteed: 1250, lateReg: 70 },
      { time: "11:15", name: "Daily Turbo $30", buyin: 30, guaranteed: 1000, lateReg: 70 },
      { time: "11:15", name: "Daily Turbo $5", buyin: 5, guaranteed: 1200, lateReg: 70 },
      { time: "12:15", name: "Daily Turbo $50", buyin: 50, guaranteed: 1000, lateReg: 70 },
      { time: "12:15", name: "Daily Turbo $10", buyin: 10, guaranteed: 1500, lateReg: 70 },
      { time: "12:15", name: "Daily Turbo $2", buyin: 2, guaranteed: 600, lateReg: 70 },
      { time: "13:15", name: "Daily Turbo $1", buyin: 1, guaranteed: 500, lateReg: 70 },
      { time: "13:15", name: "Daily Turbo $30", buyin: 30, guaranteed: 1000, lateReg: 70 },
      { time: "13:15", name: "Daily Turbo $8", buyin: 8, guaranteed: 1750, lateReg: 70 },
      { time: "13:15", name: "Daily Turbo $100", buyin: 100, guaranteed: 1000, lateReg: 70 },
      { time: "14:15", name: "Daily Turbo $5", buyin: 5, guaranteed: 1500, lateReg: 70 },
      { time: "14:15", name: "Daily Turbo $50", buyin: 50, guaranteed: 1000, lateReg: 70 },
      { time: "15:15", name: "Daily Turbo $10", buyin: 10, guaranteed: 2000, lateReg: 70 },
      { time: "15:15", name: "Daily Turbo $2", buyin: 2, guaranteed: 750, lateReg: 70 },
      { time: "15:15", name: "Daily Turbo $80", buyin: 80, guaranteed: 1000, lateReg: 70 },
      { time: "16:15", name: "Daily Turbo $8", buyin: 8, guaranteed: 1500, lateReg: 70 },
      { time: "16:15", name: "Daily Turbo $150", buyin: 150, guaranteed: 1500, lateReg: 70 },
      { time: "16:15", name: "Daily Turbo $50", buyin: 50, guaranteed: 1250, lateReg: 70 },
      { time: "16:15", name: "Daily Turbo $1", buyin: 1, guaranteed: 600, lateReg: 70 },
      { time: "17:15", name: "Daily Turbo $30", buyin: 30, guaranteed: 1250, lateReg: 70 },
      { time: "17:15", name: "Daily Turbo $100", buyin: 100, guaranteed: 1500, lateReg: 70 },
      { time: "17:15", name: "Daily Turbo $1", buyin: 1, guaranteed: 500, lateReg: 70 },
      { time: "17:15", name: "Daily Turbo $5", buyin: 5, guaranteed: 1250, lateReg: 70 },
      { time: "18:15", name: "Daily Turbo $10", buyin: 10, guaranteed: 1500, lateReg: 70 },
      { time: "18:15", name: "Daily Turbo $50", buyin: 50, guaranteed: 1000, lateReg: 70 },
      { time: "18:15", name: "Daily Turbo $2", buyin: 2, guaranteed: 600, lateReg: 70 },
      { time: "19:15", name: "Daily Turbo $30", buyin: 30, guaranteed: 800, lateReg: 70 },
      { time: "19:15", name: "Daily Turbo $1", buyin: 1, guaranteed: 400, lateReg: 70 },
      { time: "19:15", name: "Daily Turbo $8", buyin: 8, guaranteed: 1000, lateReg: 70 },
      { time: "20:15", name: "Daily Turbo $5", buyin: 5, guaranteed: 500, lateReg: 70 },
      { time: "20:15", name: "Daily Turbo $1", buyin: 1, guaranteed: 250, lateReg: 70 },
      { time: "20:15", name: "Daily Turbo $20", buyin: 20, guaranteed: 500, lateReg: 70 },
      { time: "21:15", name: "Daily Turbo $10", buyin: 10, guaranteed: 600, lateReg: 70 },
      { time: "21:15", name: "Daily Turbo $50", buyin: 50, guaranteed: 750, lateReg: 70 },
      { time: "21:15", name: "Daily Turbo $2", buyin: 2, guaranteed: 300, lateReg: 70 },
      { time: "22:15", name: "Daily Turbo $1", buyin: 1, guaranteed: 300, lateReg: 70 },
      { time: "22:15", name: "Daily Turbo $20", buyin: 20, guaranteed: 500, lateReg: 70 },
      { time: "23:15", name: "Daily Turbo $40", buyin: 40, guaranteed: 500, lateReg: 70 },
      { time: "23:15", name: "Daily Turbo $10", buyin: 10, guaranteed: 400, lateReg: 70 },
      { time: "23:15", name: "Daily Turbo $2", buyin: 2, guaranteed: 300, lateReg: 70 },
      
    ],
    hyperDailies: [
      { time: "21:05", name: "Micro Madness $1.88 [Hyper]", buyin: 1.88, guaranteed: 1250, type: "HYPER", lateReg: 75 },
      { time: "21:05", name: "Mini Midnight Madness $8.88 [Hyper]", buyin: 8.88, guaranteed: 7500, type: "HYPER", lateReg: 75 },
      { time: "21:05", name: "Midnight Madness $88 [Hyper]", buyin: 88, guaranteed: 30000, type: "HYPER", lateReg: 75 },
      { time: "22:05", name: "Midnight Madness II $8.88 [Hyper]", buyin: 8.88, guaranteed: 4000, type: "HYPER", lateReg: 75 },
      { time: "22:05", name: "Midnight Madness II $88 [Hyper]", buyin: 88, guaranteed: 8500, type: "HYPER", lateReg: 75 },
      { time: "23:05", name: "Midnight Madness III $88 [Hyper]", buyin: 88, guaranteed: 6000, type: "HYPER", lateReg: 75 },
      { time: "23:05", name: "Midnight Madness III $8.88 [Hyper]", buyin: 8.88, guaranteed: 2500, type: "HYPER", lateReg: 75 },
      { time: "09:45", name: "Daily Hypersonic $20", buyin: 20, guaranteed: 7500, type: "HYPER", lateReg: 75 },
      { time: "11:45", name: "DAILY HYPERSONIC $15", buyin: 15, guaranteed: 12500, type: "HYPER", lateReg: 75 },
      { time: "15:45", name: "Mini Hypersonic $2.50", buyin: 2.50, guaranteed: 2500, type: "HYPER", lateReg: 75 },
      { time: "15:45", name: "Daily Hypersonic $20", buyin: 20, guaranteed: 15000, type: "HYPER", lateReg: 75 },
      { time: "18:45", name: "Daily Hypersonic $20", buyin: 20, guaranteed: 12500, type: "HYPER", lateReg: 75 },
      { time: "18:45", name: "Mini Hypersonic $2.50", buyin: 2.50, guaranteed: 2000, type: "HYPER", lateReg: 75 },
      { time: "20:05", name: "Mini Saver $5 [Hyper]", buyin: 5, guaranteed: 3000, type: "HYPER", lateReg: 75 },
      { time: "20:05", name: "Day Saver $50 [Hyper]", buyin: 50, guaranteed: 17500, type: "HYPER", lateReg: 75 },
      { time: "20:05", name: "Day Saver $250 [Hyper]", buyin: 250, guaranteed: 15000, type: "HYPER", lateReg: 75 },
      { time: "20:45", name: "Daily Hypersonic $50", buyin: 50, guaranteed: 7000, type: "HYPER", lateReg: 75 },
      { time: "00:45", name: "Daily Hyper $100", buyin: 100, guaranteed: 2000, type: "HYPER", lateReg: 50 },
      { time: "00:45", name: "Daily Hyper $30", buyin: 30, guaranteed: 2000, type: "HYPER", lateReg: 50 },
      { time: "00:45", name: "Daily Hyper $8", buyin: 8, guaranteed: 1500, type: "HYPER", lateReg: 50 },
      { time: "01:45", name: "Daily Hyper $20", buyin: 20, guaranteed: 2000, type: "HYPER", lateReg: 50 },
      { time: "01:45", name: "Daily Hyper $60", buyin: 60, guaranteed: 1500, type: "HYPER", lateReg: 50 },
      { time: "01:45", name: "Daily Hyper $1", buyin: 1, guaranteed: 400, type: "HYPER", lateReg: 50 },
      { time: "01:45", name: "Daily Hyper $5", buyin: 5, guaranteed: 1000, type: "HYPER", lateReg: 50 },
      { time: "02:45", name: "Daily Hyper $10", buyin: 10, guaranteed: 1750, type: "HYPER", lateReg: 50 },
      { time: "02:45", name: "Daily Hyper $2", buyin: 2, guaranteed: 750, type: "HYPER", lateReg: 50 },
      { time: "02:45", name: "Daily Hyper $50", buyin: 50, guaranteed: 2000, type: "HYPER", lateReg: 50 },
      { time: "03:45", name: "Daily Hyper $8", buyin: 8, guaranteed: 1500, type: "HYPER", lateReg: 50 },
      { time: "03:45", name: "Daily Hyper $1", buyin: 1, guaranteed: 500, type: "HYPER", lateReg: 50 },
      { time: "03:45", name: "Daily Hyper $100", buyin: 100, guaranteed: 2000, type: "HYPER", lateReg: 50 },
      { time: "03:45", name: "Daily Hyper $30", buyin: 30, guaranteed: 2500, type: "HYPER", lateReg: 50 },
      { time: "04:45", name: "Daily Hyper $2", buyin: 2, guaranteed: 750, type: "HYPER", lateReg: 50 },
      { time: "04:45", name: "Daily Hyper $10", buyin: 10, guaranteed: 2500, type: "HYPER", lateReg: 50 },
      { time: "04:45", name: "Daily Hyper $60", buyin: 60, guaranteed: 2500, type: "HYPER", lateReg: 50 },
      { time: "05:45", name: "Daily Hyper $20", buyin: 20, guaranteed: 2500, type: "HYPER", lateReg: 50 },
      { time: "05:45", name: "Daily Hyper $5", buyin: 5, guaranteed: 1500, type: "HYPER", lateReg: 50 },
      { time: "05:45", name: "Daily Hyper $80", buyin: 80, guaranteed: 2000, type: "HYPER", lateReg: 50 },
      { time: "05:45", name: "Daily Hyper $1", buyin: 1, guaranteed: 500, type: "HYPER", lateReg: 50 },
      { time: "06:45", name: "Daily Hyper $10", buyin: 10, guaranteed: 3000, type: "HYPER", lateReg: 50 },
      { time: "06:45", name: "Daily Hyper $2", buyin: 2, guaranteed: 800, type: "HYPER", lateReg: 50 },
      { time: "06:45", name: "Daily Hyper $50", buyin: 50, guaranteed: 2500, type: "HYPER", lateReg: 50 },
      { time: "07:45", name: "Daily Hyper $1", buyin: 1, guaranteed: 600, type: "HYPER", lateReg: 50 },
      { time: "07:45", name: "Daily Hyper $5", buyin: 5, guaranteed: 1500, type: "HYPER", lateReg: 50 },
      { time: "07:45", name: "Daily Hyper $20", buyin: 20, guaranteed: 3000, type: "HYPER", lateReg: 50 },
      { time: "07:45", name: "Daily Hyper $60", buyin: 60, guaranteed: 2500, type: "HYPER", lateReg: 50 },
      { time: "08:45", name: "Daily Hyper $8", buyin: 8, guaranteed: 2500, type: "HYPER", lateReg: 50 },
      { time: "08:45", name: "Daily Hyper $1", buyin: 1, guaranteed: 750, type: "HYPER", lateReg: 50 },
      { time: "08:45", name: "Daily Hyper $30", buyin: 30, guaranteed: 3000, type: "HYPER", lateReg: 50 },
      { time: "08:45", name: "Daily Hyper $100", buyin: 100, guaranteed: 1500, type: "HYPER", lateReg: 50 },
      { time: "09:45", name: "Daily Hyper $50", buyin: 50, guaranteed: 3500, type: "HYPER", lateReg: 50 },
      { time: "09:45", name: "Daily Hyper $5", buyin: 5, guaranteed: 2000, type: "HYPER", lateReg: 50 },
      { time: "10:45", name: "Daily Hyper $20", buyin: 20, guaranteed: 4000, type: "HYPER", lateReg: 50 },
      { time: "10:45", name: "Daily Hyper $5", buyin: 5, guaranteed: 2500, type: "HYPER", lateReg: 50 },
      { time: "10:45", name: "Daily Hyper $80", buyin: 80, guaranteed: 2500, type: "HYPER", lateReg: 50 },
      { time: "10:45", name: "Daily Hyper $1", buyin: 1, guaranteed: 1000, type: "HYPER", lateReg: 50 },
      { time: "11:45", name: "Daily Hyper $2", buyin: 2, guaranteed: 2000, type: "HYPER", lateReg: 50 },
      { time: "11:45", name: "Daily Hypersonic $15", buyin: 15, guaranteed: 8000, type: "HYPER", lateReg: 50 },
      { time: "11:45", name: "Daily Hyper $50", buyin: 50, guaranteed: 4000, type: "HYPER", lateReg: 50 },
      { time: "12:45", name: "Daily Hyper $1", buyin: 1, guaranteed: 1000, type: "HYPER", lateReg: 50 },
      { time: "12:45", name: "Daily Hyper $100", buyin: 100, guaranteed: 3000, type: "HYPER", lateReg: 50 },
      { time: "12:45", name: "Daily Hyper $30", buyin: 30, guaranteed: 4000, type: "HYPER", lateReg: 50 },
      { time: "12:45", name: "Daily Hyper $8", buyin: 8, guaranteed: 5000, type: "HYPER", lateReg: 50 },
      { time: "13:45", name: "Daily Hyper Special $88", buyin: 88, guaranteed: 8000, type: "HYPER", lateReg: 50 },
      { time: "13:45", name: "Daily Hyper $20", buyin: 20, guaranteed: 6000, type: "HYPER", lateReg: 50 },
      { time: "13:45", name: "Daily Hyper $2", buyin: 2, guaranteed: 1500, type: "HYPER", lateReg: 50 },
      { time: "13:45", name: "Daily Hyper Special $8.88", buyin: 9, guaranteed: 8000, type: "HYPER", lateReg: 50 },
      { time: "13:45", name: "Daily Hyper $200", buyin: 200, guaranteed: 3000, type: "HYPER", lateReg: 50 },
      { time: "14:45", name: "Daily Hyper $5", buyin: 5, guaranteed: 4000, type: "HYPER", lateReg: 50 },
      { time: "14:45", name: "Daily Hyper $1", buyin: 1, guaranteed: 1000, type: "HYPER", lateReg: 50 },
      { time: "14:45", name: "Daily Hyper $50", buyin: 50, guaranteed: 5000, type: "HYPER", lateReg: 50 },
      { time: "15:45", name: "Daily Hyper $8", buyin: 8, guaranteed: 5000, type: "HYPER", lateReg: 50 },
      { time: "15:45", name: "Daily Hyper $80", buyin: 80, guaranteed: 3000, type: "HYPER", lateReg: 50 },
      { time: "15:45", name: "Daily Hyper $2", buyin: 2, guaranteed: 2000, type: "HYPER", lateReg: 50 },
      { time: "16:45", name: "Daily Hyper $10", buyin: 10, guaranteed: 7000, type: "HYPER", lateReg: 50 },
      { time: "16:45", name: "Daily Hyper $2", buyin: 2, guaranteed: 1750, type: "HYPER", lateReg: 50 },
      { time: "16:45", name: "Daily Hyper $50", buyin: 50, guaranteed: 5000, type: "HYPER", lateReg: 50 },
      { time: "17:45", name: "Daily Hyper $20", buyin: 20, guaranteed: 7000, type: "HYPER", lateReg: 50 },
      { time: "17:45", name: "Daily Hyper $1", buyin: 1, guaranteed: 750, type: "HYPER", lateReg: 50 },
      { time: "17:45", name: "Daily Hyper $100", buyin: 100, guaranteed: 3000, type: "HYPER", lateReg: 50 },
      { time: "17:45", name: "Daily Hyper $5", buyin: 5, guaranteed: 3000, type: "HYPER", lateReg: 50 },
      { time: "18:45", name: "Daily Hyper $50", buyin: 50, guaranteed: 4000, type: "HYPER", lateReg: 50 },
      { time: "18:45", name: "Daily Hyper $10", buyin: 10, guaranteed: 2500, type: "HYPER", lateReg: 50 },
      { time: "19:45", name: "Daily Hyper $1", buyin: 1, guaranteed: 600, type: "HYPER", lateReg: 50 },
      { time: "19:45", name: "Daily Hyper $20", buyin: 20, guaranteed: 4000, type: "HYPER", lateReg: 50 },
      { time: "19:45", name: "Daily Hyper $5", buyin: 5, guaranteed: 1500, type: "HYPER", lateReg: 50 },
      { time: "19:45", name: "Daily Hyper $80", buyin: 80, guaranteed: 3000, type: "HYPER", lateReg: 50 },
      { time: "20:45", name: "Daily Hyper $100", buyin: 100, guaranteed: 2000, type: "HYPER", lateReg: 50 },
      { time: "20:45", name: "Daily Hyper $30", buyin: 30, guaranteed: 2500, type: "HYPER", lateReg: 50 },
      { time: "20:45", name: "Daily Hyper $2", buyin: 2, guaranteed: 600, type: "HYPER", lateReg: 50 },
      { time: "21:45", name: "Daily Hyper $50", buyin: 50, guaranteed: 2000, type: "HYPER", lateReg: 50 },
      { time: "21:45", name: "Daily Hyper $10", buyin: 10, guaranteed: 2000, type: "HYPER", lateReg: 50 },
      { time: "22:45", name: "Daily Hyper $20", buyin: 20, guaranteed: 2500, type: "HYPER", lateReg: 50 },
      { time: "22:45", name: "Daily Hyper $1", buyin: 1, guaranteed: 500, type: "HYPER", lateReg: 50 },
      { time: "23:45", name: "Daily Hyper $5", buyin: 5, guaranteed: 1250, type: "HYPER", lateReg: 50 },
      { time: "23:45", name: "Daily Hyper $2", buyin: 2, guaranteed: 600, type: "HYPER", lateReg: 50 },
      { time: "23:45", name: "Daily Hyper $10", buyin: 10, guaranteed: 1500, type: "HYPER", lateReg: 50 },
      { time: "23:45", name: "Daily Hyper $50", buyin: 50, guaranteed: 1500, type: "HYPER", lateReg: 50 },

      // ...
    ],
    specialdailies: [
      { time: "21:05", name: "Daily Special $250", buyin: 250, guaranteed: 10000, type: "REG", lateReg: 150 },
      { time: "21:05", name: "Daily Special $50", buyin: 50, guaranteed: 7500, type: "REG", lateReg: 150 },
      { time: "00:05", name: "Daily Special $88", buyin: 88, guaranteed: 3500, type: "REG", lateReg: 150 },
      { time: "00:05", name: "Daily Special $10", buyin: 10, guaranteed: 3000, type: "REG", lateReg: 150 },
      { time: "01:05", name: "Daily Special $3", buyin: 3, guaranteed: 1000, type: "REG", lateReg: 150 },
      { time: "01:05", name: "Daily Special $30", buyin: 30, guaranteed: 3000, type: "REG", lateReg: 150 },
      { time: "01:15", name: "Superstack Turbo Special $8.80", buyin: 8.80, guaranteed: 3500, type: "TURBO", lateReg: 150 },
      { time: "02:05", name: "Daily Monster Stack $5", buyin: 5, guaranteed: 2500, type: "REG", lateReg: 150 },
      { time: "02:05", name: "Daily Monster Stack $50", buyin: 50, guaranteed: 10000, type: "REG", lateReg: 150 },
      { time: "03:05", name: "Daily Special $250", buyin: 250, guaranteed: 10000, type: "REG", lateReg: 150 },
      { time: "03:05", name: "Daily Special $25", buyin: 25, guaranteed: 5000, type: "REG", lateReg: 150 },
      { time: "03:05", name: "Daily Special $2.50", buyin: 2.50, guaranteed: 1500, type: "REG", lateReg: 150 },
      { time: "04:05", name: "Daily Special $125", buyin: 125, guaranteed: 4000, type: "REG", lateReg: 150 },
      { time: "04:05", name: "Daily Special $15", buyin: 15, guaranteed: 5000, type: "REG", lateReg: 150 },
      { time: "04:15", name: "Mini Superstack Turbo $2.50", buyin: 2.50, guaranteed: 2250, type: "TURBO", lateReg: 150 },
      { time: "05:05", name: "Daily Special $30", buyin: 30, guaranteed: 5000, type: "REG", lateReg: 150 },
      { time: "06:05", name: "Fifty Stack $55", buyin: 55, guaranteed: 15000, type: "REG", lateReg: 150 },
      { time: "06:05", name: "Fifty Stack $5.50", buyin: 5.50, guaranteed: 4000, type: "REG", lateReg: 150 },
      { time: "07:05", name: "Daily Special $4", buyin: 4, guaranteed: 2000, type: "REG", lateReg: 150 },
      { time: "07:05", name: "Daily Special $40", buyin: 40, guaranteed: 5000, type: "REG", lateReg: 150 },
      { time: "07:15", name: "Superstack Turbo Special $30", buyin: 30, guaranteed: 6000, type: "TURBO", lateReg: 150 },
      { time: "07:15", name: "Mini Superstack Turbo $3", buyin: 3, guaranteed: 2500, type: "TURBO", lateReg: 150 },
      { time: "08:05", name: "Superstack Special $88", buyin: 88, guaranteed: 10000, type: "REG", lateReg: 150 },
      { time: "08:05", name: "Superstack Special $8.88", buyin: 8.88, guaranteed: 6500, type: "REG", lateReg: 150 },
      { time: "09:05", name: "Daily Special $3", buyin: 3, guaranteed: 2000, type: "REG", lateReg: 150 },
      { time: "09:05", name: "Daily Special $30", buyin: 30, guaranteed: 7000, type: "REG", lateReg: 150 },
      { time: "10:05", name: "Daily Monster Stack $250", buyin: 250, guaranteed: 30000, type: "REG", lateReg: 150 },
      { time: "10:05", name: "Daily Monster Stack $2.50", buyin: 2.50, guaranteed: 4000, type: "REG", lateReg: 150 },
      { time: "11:05", name: "Daily Deepstack Special $125", buyin: 125, guaranteed: 15000, type: "REG", lateReg: 150 },
      { time: "12:05", name: "Daily 7-Max Special $200", buyin: 200, guaranteed: 12500, type: "REG", lateReg: 150 },
      { time: "12:05", name: "Mini Forty Stack $4.40", buyin: 4.40, guaranteed: 6000, type: "REG", lateReg: 135 },
      { time: "12:05", name: "Forty Stack $44", buyin: 44, guaranteed: 22500, type: "REG", lateReg: 150 },
      { time: "13:05", name: "Daily Special $10", buyin: 10, guaranteed: 10000, type: "REG", lateReg: 150 },
      { time: "13:05", name: "Daily Special $88", buyin: 88, guaranteed: 25000, type: "REG", lateReg: 150 },
      { time: "14:05", name: "Daily Special $2.50", buyin: 2.50, guaranteed: 2500, type: "REG", lateReg: 150 },
      { time: "14:05", name: "Daily Main Event $250", buyin: 250, guaranteed: 25000, type: "REG", lateReg: 150 },
      { time: "15:05", name: "Mini Monday Monster Stack $15", buyin: 15, guaranteed: 30000, type: "REG", lateReg: 150 },
      { time: "15:05", name: "Monday Monster Stack $150", buyin: 150, guaranteed: 80000, type: "REG", lateReg: 150 },
      { time: "16:05", name: "Fifty Stack $5.50", buyin: 5.50, guaranteed: 5000, type: "REG", lateReg: 150 },
      { time: "16:05", name: "Fifty Stack $55", buyin: 55, guaranteed: 20000, type: "REG", lateReg: 150 },
      { time: "17:05", name: "Mini LUCKY SEVENS Superstack Turbo $17.77 [7-Max]", buyin: 17.77, guaranteed: 20000, type: "TURBO", lateReg: 150 },
      { time: "17:05", name: "LUCKY SEVENS Superstack Turbo $77 [7-Max]", buyin: 77, guaranteed: 25000, type: "TURBO", lateReg: 150 },
      { time: "17:05", name: "Mini LUCKY SEVENS Superstack Turbo $17.77 [7-Max]", buyin: 17.77, guaranteed: 20000, type: "TURBO", lateReg: 150 },
 
    ],
    bigDailies: [
      { time: "01:00", name: "Daily Big $2", buyin: 2, guaranteed: 200, lateReg: 90 },
      { time: "02:00", name: "Daily Big $3", buyin: 3, guaranteed: 300, lateReg: 90 },
      { time: "02:00", name: "Daily Big $20", buyin: 20, guaranteed: 500, lateReg: 120 },
      { time: "03:00", name: "Daily Big $15", buyin: 15, guaranteed: 600, lateReg: 90 },
      { time: "04:00", name: "Daily Big $3", buyin: 3, guaranteed: 600, lateReg: 90 },
      { time: "05:00", name: "Daily Big $40", buyin: 40, guaranteed: 800, lateReg: 120 },
      { time: "05:00", name: "Daily Big $4", buyin: 4, guaranteed: 500, lateReg: 90 },
      { time: "06:00", name: "Daily Big $3", buyin: 3, guaranteed: 600, lateReg: 90 },
      { time: "07:00", name: "Daily Big $50", buyin: 50, guaranteed: 800, lateReg: 120 },
      { time: "08:00", name: "Daily Big $2", buyin: 2, guaranteed: 500, lateReg: 90 },
      { time: "08:00", name: "Daily Big $20", buyin: 20, guaranteed: 1000, lateReg: 120 },
      { time: "09:00", name: "Daily Big $5", buyin: 5, guaranteed: 1000, lateReg: 90 },
      { time: "10:00", name: "Daily Big $40", buyin: 40, guaranteed: 1000, lateReg: 120 },
      { time: "10:00", name: "Daily Big $3", buyin: 3, guaranteed: 1000, lateReg: 90 },
      { time: "11:00", name: "Daily Big $2", buyin: 2, guaranteed: 750, lateReg: 90 },
      { time: "12:00", name: "Daily Big $5", buyin: 5, guaranteed: 1500, lateReg: 90 },
      { time: "12:00", name: "Daily Big $15", buyin: 15, guaranteed: 2500, lateReg: 120 },
      { time: "13:00", name: "Daily Big $3", buyin: 3, guaranteed: 1250, lateReg: 90 },
      { time: "14:00", name: "Daily Big $20", buyin: 20, guaranteed: 4000, lateReg: 120 },
      { time: "14:00", name: "Daily Big $1", buyin: 1, guaranteed: 1000, lateReg: 90 },
      { time: "15:00", name: "Daily Big $2", buyin: 2, guaranteed: 1000, lateReg: 90 },
      { time: "15:00", name: "Daily Big $10", buyin: 10, guaranteed: 3000, lateReg: 90 },
      { time: "16:00", name: "Daily Big $3", buyin: 3, guaranteed: 1000, lateReg: 90 },
      { time: "17:00", name: "Daily Big $5", buyin: 5, guaranteed: 1250, lateReg: 90 },
      { time: "17:00", name: "Daily Big $30", buyin: 30, guaranteed: 1500, lateReg: 120 },
      { time: "18:00", name: "Daily Big $50", buyin: 50, guaranteed: 1000, lateReg: 120 },
      { time: "18:00", name: "Daily Big $3", buyin: 3, guaranteed: 750, lateReg: 90 },
      { time: "19:00", name: "Daily Big $20", buyin: 20, guaranteed: 800, lateReg: 120 },
      { time: "20:00", name: "Daily Big $1", buyin: 1, guaranteed: 250, lateReg: 90 },
      { time: "20:00", name: "Daily Big $10", buyin: 10, guaranteed: 1000, lateReg: 90 },
      { time: "21:00", name: "Daily Big $20", buyin: 20, guaranteed: 750, lateReg: 120 },
      { time: "21:00", name: "Daily Big $2", buyin: 2, guaranteed: 350, lateReg: 90 },
      { time: "22:00", name: "Daily Big $30", buyin: 30, guaranteed: 600, lateReg: 120 },
      { time: "22:00", name: "Daily Big $10", buyin: 10, guaranteed: 600, lateReg: 90 },
      { time: "23:00", name: "Daily Big $3", buyin: 3, guaranteed: 250, lateReg: 90 },
    ],
    ggmasterDailies:[
      { time: "08:00", name: " ####### GGMasters Asia ####### ", type: "REG", buyin: 25, guaranteed: 40000, priority: "medium", lateReg: 170 },
      { time: "10:00", name: " ####### GGMasters Double Stack ####### ", type: "REG", buyin: 25, guaranteed: 40000, priority: "medium", lateReg: 195 },
      { time: "14:00", name: " ####### GGMasters Classic ####### ", type: "REG", buyin: 25, guaranteed: 50000, priority: "medium", lateReg: 170 },,
      { time: "12:00", name: " ####### GGMasters Bounty Warm-up ####### ", type: "REG KO", buyin: 25, guaranteed: 100000, priority: "medium", lateReg: 170 },
      { time: "16:00", name: " ####### GGMasters Bounty ####### ", type: "REG KO", buyin: 25, guaranteed: 50000, priority: "medium", lateReg: 170 },
      { time: "18:00", name: " ####### GGMasters Bounty Turbo ####### ", type: "REG KO", buyin: 25, guaranteed: 40000, priority: "medium", lateReg: 100 },
    ]
  };

  // Séries fixas (datas já definidas, ex: domingos específicos).
  ggPokerConfig.mainSeries.forEach((tpl) => {
    tournaments.push(
      buildTournament({
        ...tpl,
        site: "GGPoker",
      })
    );
  });

  // Dailies – gerados para todas as datas do período
  dates.forEach((date) => {
    const dateStr = formatDateString(date);

    ggPokerConfig.bountyhunterdailies.forEach((tpl) => {
      tournaments.push(
        buildTournament({
          date: dateStr,
          time: tpl.time,
          site: "GGPoker",
          name: tpl.name,
          type: tpl.type || "REG KO",
          buyin: tpl.buyin,
          guaranteed: tpl.guaranteed,
          priority: "medium",
          lateReg: tpl.lateReg,
        })
      );
    });

    ggPokerConfig.turboDailies.forEach((tpl) => {
      tournaments.push(
        buildTournament({
          date: dateStr,
          time: tpl.time,
          site: "GGPoker",
          name: tpl.name,
          type: tpl.type || "TURBO",
          buyin: tpl.buyin,
          guaranteed: tpl.guaranteed,
          priority: "high",
          lateReg: tpl.lateReg,
        })
      );
    });

    ggPokerConfig.hyperDailies.forEach((tpl) => {
      tournaments.push(
        buildTournament({
          date: dateStr,
          time: tpl.time,
          site: "GGPoker",
          name: tpl.name,
          type: tpl.type || "HYPER",
          buyin: tpl.buyin,
          guaranteed: tpl.guaranteed,
          priority: "high",
          lateReg: tpl.lateReg,
        })
      );
    });
    // special Dailies
    ggPokerConfig.specialdailies.forEach((tpl) => {
      tournaments.push(
        buildTournament({
          date: dateStr,
          time: tpl.time,
          site: "GGPoker",
          name: tpl.name,
          type: tpl.type || "REG",
          buyin: tpl.buyin,
          guaranteed: tpl.guaranteed,
          priority: "very-high",
          lateReg: tpl.lateReg,
        })
      );           
    });
    ggPokerConfig.bigDailies.forEach((tpl) => {
      tournaments.push(
        buildTournament({
          date: dateStr,
          time: tpl.time,
          site: "GGPoker",
          name: tpl.name,
          type: tpl.type || "REG",
          buyin: tpl.buyin,
          guaranteed: tpl.guaranteed,
          priority: "very-high",
          lateReg: tpl.lateReg,
        })
      );           
    });
    ggPokerConfig.ggmasterDailies.forEach((tpl) => {
       tournaments.push(
        buildTournament({
          date: dateStr,
          time: tpl.time,
          site: "GGPoker",
          name: tpl.name,
          type: tpl.type || "REG",
          buyin: tpl.buyin,
          guaranteed: tpl.guaranteed,
          priority: tpl.priority,
          lateReg: tpl.lateReg,
        })
      );   
    });
  });
}
/**
 * PokerStars – stub simples para você expandir. [file:3]
 */
function addPokerStarsTournaments(tournaments) {
  const dates = generateWeekdayDatesForAprAndMay2026();


  const config = {
    dailies: [
      {
        time: "20:00",
        name: "Bounty Builder $11",
        type: "REG KO",
        buyin: 11,
        guaranteed: 10000,
        priority: "low",
        lateReg: 120,
      },
      {
        time: "21:00",
        name: "Bounty Builder $22",
        type: "REG KO",
        buyin: 22,
        guaranteed: 20000,
        priority: "low",
        lateReg: 150,
      },
    ],
  };

  dates.forEach((date) => {
    const dateStr = formatDateString(date);
    config.dailies.forEach((tpl) => {
      tournaments.push(
        buildTournament({
          date: dateStr,
          time: tpl.time,
          site: "PokerStars",
          name: tpl.name,
          type: tpl.type,
          buyin: tpl.buyin,
          guaranteed: tpl.guaranteed,
          priority: tpl.priority,
          lateReg: tpl.lateReg,
        })
      );
    });
  });
}

/**
 * YaPoker – usa sua função de prioridade. [file:3]
 */
function addYaPokerTournaments(tournaments) {
  const dates = generateWeekdayDatesForAprAndMay2026();
  
  const yaPokerConfig = {
    mainSeries: [
      {date: "2026-02-25", time: "14:30", name: "€10.000 GTD WEDNESDAY SPECIAL", type: "REG",buyin: 25, guaranteed: 10000, priority: "high", lateReg: 120},
    ],
    dailies: [
      { time: "00:05", name: "$7,500 GTD", type: "REG", buyin: 33, guaranteed: 7500, lateReg: 192 },
      { time: "00:05", name: "$5,000 GTD", type: "REG KO", buyin: 16.50, guaranteed: 5000, lateReg: 120 },
      { time: "00:05", name: "$1,500 GTD", type: "REG KO", buyin: 6.50, guaranteed: 1500, lateReg: 120 },
      { time: "01:05", name: "$2,000 GTD", type: "HYPER", buyin: 52.50, guaranteed: 2000, lateReg: 60 },
      { time: "02:05", name: "Hyper $5,000 GTD", type: "HYPER", buyin: 21.00, guaranteed: 5000, lateReg: 60 },
      { time: "02:05", name: "Lightning PKO $400 GTD", type: "REG KO", buyin: 10.50, guaranteed: 400, lateReg: 20 },
      { time: "02:15", name: "Turbo $600 GTD", type: "TURBO", buyin: 16.50, guaranteed: 600, lateReg: 20 },
      { time: "02:30", name: "PKO $4,000 GTD", type: "REG KO", buyin: 33.00, guaranteed: 4000, lateReg: 120 },
      { time: "02:30", name: "PKO $4,000 GTD", type: "REG KO", buyin: 66.00, guaranteed: 4000, lateReg: 120 },
      { time: "02:30", name: "PKO $1500 GTD", type: "REG KO", buyin: 11.00, guaranteed: 1500, lateReg: 120 },
      { time: "04:05", name: "PKO $1000 GTD", type: "REG KO", buyin: 33.00, guaranteed: 1000, lateReg: 120 },
      { time: "04:15", name: "PKO $1000 GTD", type: "REG", buyin: 16.50, guaranteed: 1000, lateReg: 120 },
      { time: "04:45", name: "PKO TURBO $2500 GTD", type: "TURBO KO", buyin: 55, guaranteed: 2500, lateReg: 88 },
      { time: "05:30", name: "PKO $1500 GTD", type: "REG KO", buyin: 33, guaranteed: 1500, lateReg: 120 },
      { time: "07:30", name: "PKO $2000 GTD", type: "REG KO", buyin: 33, guaranteed: 2000, lateReg: 120 },
      { time: "07:30", name: "PKO $1000 GTD", type: "REG KO", buyin: 16.50, guaranteed: 1000, lateReg: 120 },
      { time: "09:15", name: "Early Special $1,000 GTD", type: "REG", buyin: 4.40, guaranteed: 1000, lateReg: 240 },
      { time: "09:15", name: "Early Special $6,000 GTD", type: "REG", buyin: 16.50, guaranteed: 4000, lateReg: 240 },
      { time: "09:15", name: "$5,000 GTD", type: "REG", buyin: 33, guaranteed: 5000, lateReg: 192 },
      { time: "09:45", name: "$PKO EARLY 2500 GTD", type: "REG KO", buyin: 11, guaranteed: 2500, lateReg: 180 },
      { time: "09:45", name: "$PKO EARLY 1000 GTD", type: "REG KO", buyin: 5.50, guaranteed: 1000, lateReg: 180 },
      { time: "10:45", name: "Mega Stack $1,500 GTD", type: "REG", buyin: 16.50, guaranteed: 1500, lateReg: 90 },
      { time: "11:05", name: "$PKO 1500 GTD", type: "REG KO", buyin: 16.50, guaranteed: 1500, lateReg: 120 },
      { time: "12:15", name: "$10,000 GTD", type: "REG", buyin: 16.50, guaranteed: 10000, lateReg: 192 },
      { time: "12:15", name: "$2,500 GTD", type: "REG", buyin: 6.60, guaranteed: 2500, lateReg: 192 },
      { time: "12:45", name: "$PKO 4,000 GTD", type: "REG KO", buyin: 8.80, guaranteed: 4000, lateReg: 180 },
      { time: "13:05", name: "$10,000 GTD", type: "REG", buyin: 55, guaranteed: 10000, lateReg: 192 },
      { time: "13:15", name: "$10,000 GTD", type: "REG KO", buyin: 27.50, guaranteed: 10000, lateReg: 120 },
      { time: "16:30", name: "$10,000 GTD", type: "REG", buyin: 55, guaranteed: 10000, lateReg: 192 },
      { time: "16:30", name: "$3,000 GTD", type: "REG KO", buyin: 11, guaranteed: 3000, lateReg: 120 },
      { time: "16:30", name: "$2,000 GTD", type: "REG KO", buyin: 5.50, guaranteed: 2000, lateReg: 120 },
      { time: "17:30", name: "$MEGA STACK 2,000 GTD", type: "REG", buyin: 8.80, guaranteed: 2000, lateReg: 120 },
      { time: "18:30", name: "$5,000 GTD", type: "REG", buyin: 8.80, guaranteed: 5000, lateReg: 192 },
      { time: "18:30", name: "$20,000 GTD", type: "REG", buyin: 33, guaranteed: 20000, lateReg: 192 },
      { time: "19:30", name: "$2,000 GTD 1RE", type: "REG", buyin: 22, guaranteed: 2000, lateReg: 100 },
      { time: "20:15", name: "The Boski Daily Double A - $7500 GTD", type: "REG", buyin: 11, guaranteed: 7500, lateReg: 192 },
      { time: "20:45", name: "The Boski Daily Double B - $7500 GTD", type: "REG", buyin: 11, guaranteed: 7500, lateReg: 192 },
    ],
  };

  yaPokerConfig.mainSeries.forEach((tpl) => {
    tournaments.push(
      buildTournament({
        ...tpl,
        site: "YaPoker",
      })
    );
  });
  dates.forEach((date) => {
    const dateStr = formatDateString(date);
    yaPokerConfig.dailies.forEach((tpl) => {
      tournaments.push(
        buildTournament({
          date: dateStr,
          time: tpl.time,
          site: "YaPoker",
          name: tpl.name,
          type: tpl.type,
          buyin: tpl.buyin,
          guaranteed: tpl.guaranteed,
          priority: getYaPriority(tpl.name),
          lateReg: tpl.lateReg,
        })
      );
    });
  });
}

/**
 * 888Poker. [file:3]
 */
function add888PokerTournaments(tournaments) {
  const dates = generateWeekdayDatesForAprAndMay2026();

  const pokerConfig888 = {
    dailies: [
      {
        time: "10:00",
        name: "Daily High $20K GTD",
        type: "REG",
        buyin: 10,
        guaranteed: 20000,
        priority: "high",
        lateReg: 60,
      },
      {
        time: "15:00",
        name: "Turbo Madness $10K GTD",
        type: "TURBO",
        buyin: 5,
        guaranteed: 10000,
        priority: "medium",
        lateReg: 25,
      },
      {
        time: "20:00",
        name: "Zone Poker KO $15K GTD",
        type: "REG KO",
        buyin: 25,
        guaranteed: 15000,
        priority: "medium",
        lateReg: 40,
      },
    ],
  };

  dates.forEach((date) => {
    const dateStr = formatDateString(date);
    pokerConfig888.dailies.forEach((tpl) => {
      tournaments.push(
        buildTournament({
          date: dateStr,
          time: tpl.time,
          site: "888Poker",
          name: tpl.name,
          type: tpl.type,
          buyin: tpl.buyin,
          guaranteed: tpl.guaranteed,
          priority: tpl.priority,
          lateReg: tpl.lateReg,
        })
      );
    });
  });
}

/**
 * Champion – usa os templates fixos que você já tinha. [file:3]
 */
function addChampionTournaments(tournaments) {
  const dates = generateWeekdayDatesForAprAndMay2026();
  const championConfig = {
    mainSeries: [
      {date: "2026-02-25", time: "14:30", name: "€10.000 GTD WEDNESDAY SPECIAL", type: "REG",buyin: 25, guaranteed: 10000, priority: "high", lateReg: 120},
      {date: "2026-02-28", time: "09:00", name: "€5 MYSTERY [6-Max]", type: "MYSTERY",buyin: 5, guaranteed: 1000, priority: "medium", lateReg: 120},
      {date: "2026-03-01", time: "13:30", name: "€30.000 GTD BOUNTY KING", type: "REG KO", buyin: 25, guaranteed: 30000, priority: "high", lateReg: 300},
      {date: "2026-03-01", time: "14:00", name: "€30.000 GTD MYSTERY XL", type: "MYSTERY", buyin: 12.50, guaranteed: 30000, priority: "high", lateReg: 300},
      {date: "2026-03-03", time: "09:00", name: "€10 BOUNTY HUNTER PRIME", type: "REG KO", buyin: 10, guaranteed: 1500, priority: "low", lateReg: 120},
      {date: "2026-03-23", time: "19:00", name: "€100,000 SUPERSTACK|D2", type: "REG KO", buyin: 25, guaranteed: 100000, priority: "high", lateReg: 120},
    ],
  

    dailies: [
      {time: "08:30", name: "3500 BOUNTY HUNTER", type: "REG KO", buyin: 15, guaranteed: 3500, priority: "medium", lateReg: 200},
      {time: "10:00", name: "€10.000 GTD 8-MAX", type: "MYSTERY", buyin: 20, guaranteed: 10000, priority: "medium", lateReg: 300},
      {time: "10:30", name: "€7.5 MYSTERY XL", type: "MYSTERY", buyin: 7.5, guaranteed: 3500, priority: "medium", lateReg: 240},
      {time: "11:00", name: "€10 BOUNTY HUNTER PRIME", type: "MYSTERY", buyin: 10, guaranteed: 2000, priority: "medium", lateReg: 136},
      {time: "11:30", name: "€11.000 GTD MYSTERY", type: "MYSTERY", buyin: 10, guaranteed: 11000, priority: "medium", lateReg: 136},
      {time: "11:30", name: "€SHAMROCK SERIES D1", type: "REG KO", buyin: 25, guaranteed: 11000, priority: "medium", lateReg: 110},
      {time: "11:30", name: "€10.000 GTD SUPER XL", type: "REG KO", buyin: 25, guaranteed: 10000, priority: "medium", lateReg: 240},
      {time: "12:00", name: "€2.500 GTD MINI WARM-UP", type: "REG KO", buyin: 10, guaranteed: 2500, priority: "medium", lateReg: 130},
      {time: "12:00", name: "€20.000 GTD ELIMINATOR", type: "REG KO", buyin: 30, guaranteed: 20000, priority: "medium", lateReg: 240},
      {time: "13:05", name: "€6.000 GTD LUCKY SEVEN XL ", type: "REG", buyin: 15, guaranteed: 6000, priority: "high", lateReg: 240},
      {time: "13:30", name: "€SHAMROCK SERIES D1", type: "REG KO", buyin: 25, guaranteed: 11000, priority: "medium", lateReg: 110},
      {time: "13:30", name: "1.750 GTD - REBUY", type: "REG", buyin: 5, guaranteed: 1750, priority: "high", lateReg: 123},
      {time: "14:00", name: "€25.000 GTD MYSTERY XL", type: "MYSTERY", buyin: 12.50, guaranteed: 25000, priority: "high", lateReg: 300},
      {time: "14:30", name: "€7.5 MINI OPENER", type: "REG", buyin: 7.50, guaranteed: 4000, priority: "high", lateReg: 180},
      {time: "15:00", name: "€5.000 BOUNTY HUNTER", type: "REG KO", buyin: 10, guaranteed: 5000, priority: "medium", lateReg: 300},
      {time: "15:30", name: "€SHAMROCK SERIES D1", type: "REG KO", buyin: 25, guaranteed: 11000, priority: "medium", lateReg: 110},
      {time: "16:00", name: "€3.000 FISTS OF FURY - ADDON", type: "REG", buyin: 10, guaranteed: 3000, priority: "high", lateReg: 148},
      {time: "16:14", name: "€3.000 BOUNTY HUNTER", type: "REG KO", buyin: 15, guaranteed: 3000, priority: "medium", lateReg: 128},
      {time: "16:30", name: "€3.000 GTD LUCKY SEVEN", type: "REG", buyin: 15, guaranteed: 3000, priority: "high", lateReg: 200},      
      {time: "17:30", name: "€SHAMROCK SERIES D1", type: "REG KO", buyin: 25, guaranteed: 11000, priority: "medium", lateReg: 110},
      {time: "19:30", name: "€SHAMROCK SERIES D1", type: "REG KO", buyin: 25, guaranteed: 11000, priority: "medium", lateReg: 110},
      {time: "18:00", name: "€6000 GTD ULTRAMINI 7-MAX", type: "MYSTERY", buyin: 10, guaranteed: 6000, priority: "medium", lateReg: 266},
      {time: "18:00", name: "€2.000 GTD LUCKY SEVEN TURBO", type: "TURBO", buyin: 10, guaranteed: 2000, priority: "medium", lateReg: 100},
      {time: "18:35", name: "€3.000 BOUNTY HUNTER", type: "REG KO", buyin: 15, guaranteed: 3000, priority: "medium", lateReg: 140},

    ],
  };

  dates.forEach((date) => {
    const dateStr = formatDateString(date);
    championConfig.dailies.forEach((tpl) => {
      tournaments.push(
        buildTournament({
          date: dateStr,
          time: tpl.time,
          site: "Champion",
          name: tpl.name,
          type: tpl.type,
          buyin: tpl.buyin,
          guaranteed: tpl.guaranteed,
          priority: tpl.priority,
          lateReg: tpl.lateReg,
        })
      );
    });
  });
  championConfig.mainSeries.forEach((tpl) => {
    tournaments.push(
      buildTournament({
        ...tpl,
        site: "Champion",
      })
    );
  });
}

/**
 * Partypoker – reaproveita sua config de Daily Legends. [file:3]
 */
function addPartypokerTournaments(tournaments) {
  const dates = generateWeekdayDatesForAprAndMay2026();

  const partypokerConfig = {
    mainSeries: [
      {
        date: "2026-02-29",
        time: "21:05",
        name: "The Super $22: $3,000 Gtd",
        type: "REG",
        buyin: 22,
        guaranteed: 3000,
        priority: "medium",
        lateReg: 120,
      },
      // ...cole aqui o resto que você já tem no arquivo atual (só removendo id)
    ],
    dailies: [
      {time: "10:15", name: "Bounty Hunter 6-Max Turbo: $1.5k Gtd", type: "TURBO KO", buyin: 55, guaranteed: 3500, priority: "low", lateReg: 50},
      {time: "11:05", name: "Daily Legends 7-Max PKO: $3k Gtd", type: "REG KO", buyin: 33, guaranteed: 3000, priority: "low", lateReg: 50},
      {time: "11:05", name: "Daily Legends 7-Max PKO: $3k Gtd", type: "REG KO", buyin: 33, guaranteed: 3000, priority: "low", lateReg: 80},
      {time: "11:05", name: "Daily Legends 7-Max PKO: $1.5k Gtd", type: "REG KO", buyin: 5.5, guaranteed: 1500, priority: "low", lateReg: 80},
      {time: "12:00", name: "Bounty Hunter 8-Max: $2k Gtd", type: "REG KO", buyin: 16.50, guaranteed: 2000, priority: "medium", lateReg: 64},
      {time: "12:30", name: "Daily Legends 8-Max Deepstack: $3k Gtd", type: "REG", buyin: 11, guaranteed: 3000, priority: "high", lateReg: 96},
      {time: "13:05", name: "Daily Legends 6-Max MYSTERY: $5k Gtd", type: "MYSTERY", buyin: 22, guaranteed: 5000, priority: "medium", lateReg: 80},
      {time: "14:05", name: "Daily Legends Terminator: $5k Gtd", type: "REG KO", buyin: 5.5, guaranteed: 5000, priority: "medium", lateReg: 80},
      {time: "14:30", name: "Daily Legends 7-Max: $2.5k Gtd", type: "REG", buyin: 11, guaranteed: 2500, priority: "high", lateReg: 80},
      {time: "15:05", name: "Daily Legends Predator: $8k Gtd", type: "REG KO", buyin: 22, guaranteed: 8000, priority: "low", lateReg: 80},
      {time: "15:05", name: "Daily Legends Headhunter: $2.5k Gtd", type: "REG KO", buyin: 5.5, guaranteed: 2500, priority: "low", lateReg: 80},
      {time: "15:30", name: "Daily Legends Classic: $3k Gtd", type: "REG", buyin: 22, guaranteed: 3000, priority: "low", lateReg: 80},
      {time: "16:05", name: "The Super $11: $7.5k Gtd", type: "REG KO", buyin: 11, guaranteed: 7500, priority: "medium", lateReg: 96},
      {time: "16:05", name: "The Super $55: $15k Gtd", type: "REG KO", buyin: 55, guaranteed: 15000, priority: "medium", lateReg: 96},
      {time: "18:05", name: "Daily Legends 7-Max Early Mystery Turbo: $2.5k Gtd", type: "MYSTERY", buyin: 5.5, guaranteed: 2500, priority: "medium", lateReg: 80},
      {time: "18:05", name: "Daily Legends 7-Max Early Mystery Turbo: $6k Gtd", type: "MYSTERY", buyin: 22, guaranteed: 6000, priority: "very-low", lateReg: 80},
      {time: "19:05", name: "Daily Legends 6-Max PKO TURBO: $2k Gtd", type: "TURBO KO", buyin: 11, guaranteed: 2000, priority: "low", lateReg: 50},
      {time: "21:05", name: "The Super $22: $2.5k Gtd", type: "REG KO", buyin: 22, guaranteed: 2500, priority: "medium", lateReg: 96},
      {time: "21:05", name: "The Super $5.5: $1.5k Gtd", type: "REG KO", buyin: 5.5, guaranteed: 1500, priority: "medium", lateReg: 96},

    ],    
  };

  // Fixos (datas específicas)
  partypokerConfig.mainSeries.forEach((tpl) => {
    tournaments.push(
      buildTournament({
        ...tpl,
        site: "Partypoker",
      })
    );
  });
  dates.forEach((date) => {
    const dateStr = formatDateString(date);
    partypokerConfig.dailies.forEach((tpl) => {
      tournaments.push(
        buildTournament({
          date: dateStr,
          time: tpl.time,
          site: "Partypoker",
          name: tpl.name,
          type: tpl.type,
          buyin: tpl.buyin,
          guaranteed: tpl.guaranteed,
          priority: tpl.priority,
          lateReg: tpl.lateReg,
        })
      );
    });
  });

  // Se quiser ter “dailies” de março, crie um array e use dates.forEach como nos outros.
}

/**
 * WPT – stub simples.
 */
function addWPTTournaments(tournaments) {
  const dates = generateWeekdayDatesForAprAndMay2026();

  const config = {
    dailies: [
      {
        time: "20:30",
        name: "WPT Daily $33",
        type: "REG",
        buyin: 33,
        guaranteed: 15000,
        priority: "medium",
        lateReg: 120,
      },
    ],
  };

  dates.forEach((date) => {
    const dateStr = formatDateString(date);
    config.dailies.forEach((tpl) => {
      tournaments.push(
        buildTournament({
          date: dateStr,
          time: tpl.time,
          site: "WPT",
          name: tpl.name,
          type: tpl.type,
          buyin: tpl.buyin,
          guaranteed: tpl.guaranteed,
          priority: tpl.priority,
          lateReg: tpl.lateReg,
        })
      );
    });
  });
}

/**
 * KKPOKER – reaproveita o que você já tem, trocando id → uid. [file:3]
 */
function addKKPOKERTournaments(tournaments) {
  const dates = generateWeekdayDatesForAprAndMay2026();

  const KKPOKERConfig = {
    mainSeries: [
      {date: "2026-03-22", time: "09:15", name: "SAT $80K DIAMOND GLORY X12", type: "TURBO",buyin: 10, guaranteed: 1000, priority: "high", lateReg: 45},
      {date: "2026-03-22", time: "09:45", name: "SAT $80K DIAMOND GLORY X10", type: "TURBO",buyin: 10, guaranteed: 1000, priority: "high", lateReg: 45},
      {date: "2026-03-22", time: "10:00", name: "$80K DIAMOND GLORY PKO", type: "REG KO",buyin: 100, guaranteed: 80000, priority: "high", lateReg: 180},
    ],
    bigDailies: [
      {
        time: "12:00",
        name: "$3K Classic1",
        buyin: 30,
        guaranteed: 3000,
        lateReg: 150,
      },
      {
        time: "22:00",
        name: "$2K CLASSIC",
        buyin: 20,
        guaranteed: 2000,
        lateReg: 150,
      },
    ],
    bountyDailies: [
      {
        time: "08:00",
        name: "$5K Warrior",
        buyin: 30,
        guaranteed: 2000,
        lateReg: 150,
      },
      // ...demais bounties
    ],
  };

  dates.forEach((date) => {
    const dateStr = formatDateString(date);

    KKPOKERConfig.bigDailies.forEach((tpl) => {
      tournaments.push(
        buildTournament({
          date: dateStr,
          time: tpl.time,
          site: "KKPOKER",
          name: tpl.name,
          type: "REG",
          buyin: tpl.buyin,
          guaranteed: tpl.guaranteed,
          priority: "very-high",
          lateReg: tpl.lateReg,
        })
      );
    });

    KKPOKERConfig.bountyDailies.forEach((tpl) => {
      tournaments.push(
        buildTournament({
          date: dateStr,
          time: tpl.time,
          site: "KKPOKER",
          name: tpl.name,
          type: "REG KO",
          buyin: tpl.buyin,
          guaranteed: tpl.guaranteed,
          priority: "high",
          lateReg: tpl.lateReg,
        })
      );
    });
  });

  KKPOKERConfig.mainSeries.forEach((tpl) => {
    tournaments.push(
      buildTournament({
        ...tpl,
        site: "KKPOKER",
      })
    );
  });
}

/**
 * CoinPoker – reaproveita seu config. [file:3]
 */
function addCoinPokerTournaments(tournaments) {
  const dates = generateWeekdayDatesForAprAndMay2026();

  const CoinPokerConfig = {
    mainSeries: [
      {
        date: "2026-02-08",
        time: "09:08",
        name: "T22 Mini Sunday Special Asia",
        type: "REG",
        buyin: 22,
        guaranteed: 6000,
        priority: "very-high",
        lateReg: 150,
      },
      // ...resto do mainSeries que você já tinha
    ],
    bigDailies: [
      {
        time: "11:05",
        name: "T10 CoinPoker Mini Kickoff",
        buyin: 10,
        guaranteed: 3000,
        lateReg: 150,
      },
      // ...
    ],
    bountyDailies: [
      {
        time: "14:00",
        name: "DOJO",
        buyin: 10,
        guaranteed: 3000,
        lateReg: 150,
      },
    ],
  };

  dates.forEach((date) => {
    const dateStr = formatDateString(date);

    CoinPokerConfig.bigDailies.forEach((tpl) => {
      tournaments.push(
        buildTournament({
          date: dateStr,
          time: tpl.time,
          site: "CoinPoker",
          name: tpl.name,
          type: "REG",
          buyin: tpl.buyin,
          guaranteed: tpl.guaranteed,
          priority: "very-high",
          lateReg: tpl.lateReg,
        })
      );
    });

    CoinPokerConfig.bountyDailies.forEach((tpl) => {
      tournaments.push(
        buildTournament({
          date: dateStr,
          time: tpl.time,
          site: "CoinPoker",
          name: tpl.name,
          type: "REG KO",
          buyin: tpl.buyin,
          guaranteed: tpl.guaranteed,
          priority: "medium",
          lateReg: tpl.lateReg,
        })
      );
    });
  });

  CoinPokerConfig.mainSeries.forEach((tpl) => {
    tournaments.push(
      buildTournament({
        ...tpl,
        site: "CoinPoker",
      })
    );
  });
}

/**
 * Suprema, JackPoker, ClubGG, QQPK – stubs prontos para você plugar templates reais.
 */
function addSupremaTournaments(tournaments) {
  const dates = generateWeekdayDatesForAprAndMay2026();
  const supConfig = {
    mainSeries: [
      {date: "2026-04-19", time: "10:00", name: "R$ 50 - SAT Supremo", type: "REG",buyin: 10, guaranteed: 11700, priority: "high", lateReg: 65},
      {date: "2026-04-19", time: "11:30", name: "R$ 30+35 - SAT Supremo", type: "REG",buyin: 6, guaranteed: 19500, priority: "high", lateReg: 55},
      {date: "2026-04-19", time: "12:30", name: "R$ 75 - SAT Supremo", type: "REG",buyin: 15, guaranteed: 5850, priority: "high", lateReg: 60},
      {date: "2026-04-19", time: "13:00", name: "R$ 30+40 - SAT Supremo", type: "REG",buyin: 6, guaranteed: 19500, priority: "high", lateReg: 55},
      {date: "2026-04-19", time: "13:00", name: "R$75 - Sunday MB", type: "MYSTERY",buyin: 15, guaranteed: 50000, priority: "high", lateReg: 200},
      {date: "2026-04-19", time: "14:00", name: "R$110 - WarmUp", type: "REG KO",buyin: 22, guaranteed: 50000, priority: "high", lateReg: 200},
      {date: "2026-04-19", time: "14:00", name: "R$ 35+40 - SAT Supremo", type: "REG",buyin: 6, guaranteed: 11700, priority: "high", lateReg: 55},
      {date: "2026-04-19", time: "15:00", name: "####### R$ 390 - Supremo  #######", type: "REG KO",buyin: 78, guaranteed: 1000000, priority: "high", lateReg: 245},
      {date: "2026-04-19", time: "17:00", name: "R$250 - Freeze HR", type: "REG",buyin: 50, guaranteed: 100000, priority: "high", lateReg: 215},
      {date: "2026-04-19", time: "17:00", name: "R$ 39 - Supreminho", type: "REG KO",buyin: 7.80, guaranteed: 100000, priority: "high", lateReg: 245},
      {date: "2026-04-19", time: "18:00", name: "R$ 50 + R$100 - Sunday Plus", type: "REG KO",buyin: 10, guaranteed: 1000000, priority: "high", lateReg: 300},
      {date: "2026-04-19", time: "19:00", name: "R$ 150 - Battle HR", type: "REG KO",buyin: 30, guaranteed: 100000, priority: "high", lateReg: 300},
      {date: "2026-04-19", time: "19:00", name: "R$ 750 - HighS", type: "REG KO",buyin: 150, guaranteed: 100000, priority: "high", lateReg: 300},
      {date: "2026-04-19", time: "20:00", name: "R$ 75 - Bounty", type: "REG KO",buyin: 15, guaranteed: 30000, priority: "high", lateReg: 300},

    ],
  

    dailies: [
      {time: "11:00", name: "R$ 15+15 - Plus", type: "REG", buyin: 3, guaranteed: 15000, priority: "medium", lateReg: 112},
      {time: "13:00", name: "R$ 25 - Battle", type: "REG KO", buyin: 5, guaranteed: 15000, priority: "medium", lateReg: 156},
      {time: "13:15", name: "R$ 35 - Freeze", type: "REG", buyin: 7, guaranteed: 5000, priority: "medium", lateReg: 140},
      {time: "15:00", name: "R$ 15+15 - Plus", type: "REG", buyin: 3, guaranteed: 30000, priority: "medium", lateReg: 140},
      {time: "16:30", name: "R$ 35 - Freeze", type: "REG", buyin: 7, guaranteed: 5000, priority: "medium", lateReg: 140},
      {time: "17:30", name: "R$ 25 - Battle", type: "REG KO", buyin: 5, guaranteed: 15000, priority: "medium", lateReg: 156},
      {time: "18:00", name: "R$ 10+15 - Mini Plus", type: "REG", buyin: 2, guaranteed: 50000, priority: "medium", lateReg: 150},

    ],
  };

  dates.forEach((date) => {
    const dateStr = formatDateString(date);
    supConfig.dailies.forEach((tpl) => {
      tournaments.push(
        buildTournament({
          date: dateStr,
          time: tpl.time,
          site: "Suprema",
          name: tpl.name,
          type: tpl.type,
          buyin: tpl.buyin,
          guaranteed: tpl.guaranteed,
          priority: tpl.priority,
          lateReg: tpl.lateReg,
        })
      );
    });
  });
  supConfig.mainSeries.forEach((tpl) => {
    tournaments.push(
      buildTournament({
        ...tpl,
        site: "Suprema",
      })
    );
  });
}

function addJackPokerTournaments(tournaments) {
  const dates = generateWeekdayDatesForAprAndMay2026();
  const config = {
    dailies: [
      {
        time: "19:30",
        name: "Jack Daily KO 22",
        type: "REG KO",
        buyin: 22,
        guaranteed: 10000,
        priority: "medium",
        lateReg: 120,
      },
    ],
  };

  dates.forEach((date) => {
    const dateStr = formatDateString(date);
    config.dailies.forEach((tpl) => {
      tournaments.push(
        buildTournament({
          date: dateStr,
          time: tpl.time,
          site: "JackPoker",
          name: tpl.name,
          type: tpl.type,
          buyin: tpl.buyin,
          guaranteed: tpl.guaranteed,
          priority: tpl.priority,
          lateReg: tpl.lateReg,
        })
      );
    });
  });
}

function addClubGGTournaments(tournaments) {
  const dates = generateWeekdayDatesForAprAndMay2026();
  const config = {
    dailies: [
      {
        time: "18:00",
        name: "ClubGG Daily 11",
        type: "REG",
        buyin: 11,
        guaranteed: 5000,
        priority: "medium",
        lateReg: 120,
      },
    ],
  };

  dates.forEach((date) => {
    const dateStr = formatDateString(date);
    config.dailies.forEach((tpl) => {
      tournaments.push(
        buildTournament({
          date: dateStr,
          time: tpl.time,
          site: "ClubGG",
          name: tpl.name,
          type: tpl.type,
          buyin: tpl.buyin,
          guaranteed: tpl.guaranteed,
          priority: tpl.priority,
          lateReg: tpl.lateReg,
        })
      );
    });
  });
}

function addQQPKTournaments(tournaments) {
  const dates = generateWeekdayDatesForAprAndMay2026();
  const config = {
    dailies: [
      {
        time: "20:00",
        name: "QQPK Daily 33",
        type: "REG",
        buyin: 33,
        guaranteed: 8000,
        priority: "medium",
        lateReg: 120,
      },
    ],
  };

  dates.forEach((date) => {
    const dateStr = formatDateString(date);
    config.dailies.forEach((tpl) => {
      tournaments.push(
        buildTournament({
          date: dateStr,
          time: tpl.time,
          site: "QQPK",
          name: tpl.name,
          type: tpl.type,
          buyin: tpl.buyin,
          guaranteed: tpl.guaranteed,
          priority: tpl.priority,
          lateReg: tpl.lateReg,
        })
      );
    });
  });
}

/**
 * Função principal exportada para a rota /api/tournaments.
 */
export const getTournaments = async () => {
  const tournaments = [];

  addGGPokerTournaments(tournaments);
  addPokerStarsTournaments(tournaments);
  addYaPokerTournaments(tournaments);
  add888PokerTournaments(tournaments);
  addChampionTournaments(tournaments);
  addPartypokerTournaments(tournaments);
  addWPTTournaments(tournaments);
  addKKPOKERTournaments(tournaments);
  addCoinPokerTournaments(tournaments);
  addSupremaTournaments(tournaments);
  addJackPokerTournaments(tournaments);
  addClubGGTournaments(tournaments);
  addQQPKTournaments(tournaments);

  return tournaments;
};
