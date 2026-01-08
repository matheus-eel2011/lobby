export default function handler(req, res) {
  res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=300");

  // Função para determinar prioridade baseada no tipo de evento
  const getPriority = (eventName) => {
    const nameLower = eventName.toLowerCase();
    
    if (nameLower.includes('daily') || nameLower.includes('hyper')) {
      return "very-high";
    }
    if (nameLower.includes('turbo') || nameLower.includes('speed')) {
      return "very-high";
    }
    if (nameLower.includes('omaholic') && !nameLower.includes('bounty')) {
      return "low";
    }
    if (nameLower.includes('bounty') || nameLower.includes('hunters') || nameLower.includes('ko')) {
      return "high";
    }
    return "medium";
  };

  // Data atual: 2026-01-07
  // Gerar datas para todo janeiro a partir de 2026-01-07
  function generateDatesForJanuary() {
    const dates = [];
    const startDate = new Date(2026, 01, 7);  // Ano, Mês (0-11), Dia
    const endDate = new Date(2026, 01, 31);

    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }
    return dates;
  }

  // Templates de torneios diários
  const dailyHyperTemplate = [
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
  ];

  const dailyTurboTemplate = [
    { time: "00:15", name: "Daily Turbo $10", buyin: 10, guaranteed: 600 },
    { time: "00:15", name: "Daily Turbo $50", buyin: 50, guaranteed: 750 },
    { time: "00:15", name: "Daily Turbo $2", buyin: 2, guaranteed: 300 },
    { time: "01:15", name: "Daily Turbo $1", buyin: 1, guaranteed: 300 },
    { time: "01:15", name: "Daily Turbo $20", buyin: 20, guaranteed: 500 },
    { time: "02:15", name: "Daily Turbo $40", buyin: 40, guaranteed: 500 },
    { time: "02:15", name: "Daily Turbo $10", buyin: 10, guaranteed: 400 },
    { time: "02:15", name: "Daily Turbo $2", buyin: 2, guaranteed: 300 },
    { time: "03:15", name: "Daily Turbo $5", buyin: 5, guaranteed: 400 },
    { time: "03:15", name: "Daily Turbo $20", buyin: 20, guaranteed: 400 },
  ];

  const mainEventSeries = [
    { id: 25, date: "2026-01-07", time: "18:00", name: "#25: $100 Winter Classic [9-Max]", type: "REGULAR", buyin: 100, guaranteed: 200000, priority: "medium" },
    { id: 26, date: "2026-01-08", time: "18:00", name: "#26-A: $10 Speed Racer Bounty WINTER HOUR [10 BB]", type: "BOUNTY", buyin: 10, guaranteed: 40000, priority: "high" },
    { id: 27, date: "2026-01-08", time: "18:10", name: "#26-B: $25 Speed Racer Bounty WINTER HOUR [10 BB]", type: "BOUNTY", buyin: 25, guaranteed: 40000, priority: "high" },
    { id: 28, date: "2026-01-08", time: "18:20", name: "#26-C: $50 Speed Racer Bounty WINTER HOUR [10 BB]", type: "BOUNTY", buyin: 50, guaranteed: 40000, priority: "high" },
    { id: 29, date: "2026-01-08", time: "18:30", name: "#26-D: $100 Speed Racer Bounty WINTER HOUR [10 BB]", type: "BOUNTY", buyin: 100, guaranteed: 40000, priority: "high" },
    { id: 30, date: "2026-01-08", time: "18:40", name: "#26-E: $200 Speed Racer Bounty WINTER HOUR [10 BB]", type: "BOUNTY", buyin: 200, guaranteed: 40000, priority: "high" },
    { id: 31, date: "2026-01-09", time: "18:00", name: "#27: $15 Friday Freezeout", type: "REGULAR", buyin: 15, guaranteed: 100000, priority: "medium" },
    { id: 32, date: "2026-01-10", time: "18:00", name: "#28: $215 Omaholic Deepstack Turbo", type: "TURBO", buyin: 215, guaranteed: 100000, priority: "very-high" },
    { id: 33, date: "2026-01-11", time: "18:00", name: "#29: $77 Holiday Lucky Sevens [7-Max]", type: "REGULAR", buyin: 77, guaranteed: 400000, priority: "medium" },
    { id: 34, date: "2026-01-12", time: "18:00", name: "#30: $54 Lucky Fortune Mystery Bounty [Day 2]", type: "BOUNTY", buyin: 54, guaranteed: 3000000, priority: "high" },
    { id: 35, date: "2026-01-13", time: "18:00", name: "#31: $125 Winter Marathon", type: "REGULAR", buyin: 125, guaranteed: 200000, priority: "medium" },
    { id: 36, date: "2026-01-14", time: "18:00", name: "#32: $25 Bounty Takedown [25 BB]", type: "BOUNTY", buyin: 25, guaranteed: 100000, priority: "high" },
    { id: 37, date: "2026-01-15", time: "18:00", name: "#33: $88 Crystal Ball [Mystery Bounty]", type: "BOUNTY", buyin: 88, guaranteed: 500000, priority: "high" },
    { id: 38, date: "2026-01-16", time: "18:00", name: "#34: $100 Frostfire Rising [Rebuy]", type: "REGULAR", buyin: 100, guaranteed: 150000, priority: "medium" },
    { id: 39, date: "2026-01-17", time: "18:00", name: "#35: $54 Saturday Icebreaker [Bounty Hyper]", type: "BOUNTY", buyin: 54, guaranteed: 200000, priority: "high" },
    { id: 40, date: "2026-01-18", time: "18:00", name: "#36: $200 Sunday Snowfall [6-Max]", type: "REGULAR", buyin: 200, guaranteed: 400000, priority: "medium" },
    { id: 41, date: "2026-01-19", time: "18:00", name: "#37: $32 Omaholic Bounty [Final Day]", type: "BOUNTY", buyin: 32, guaranteed: 500000, priority: "high" },
    { id: 42, date: "2026-01-20", time: "18:00", name: "#38: $215 Winter Frost Freezeout Bounty", type: "BOUNTY", buyin: 215, guaranteed: 300000, priority: "high" },
    { id: 43, date: "2026-01-21", time: "18:00", name: "#39: $100 Deepstack [Slower Levels]", type: "REGULAR", buyin: 100, guaranteed: 200000, priority: "medium" },
    { id: 44, date: "2026-01-22", time: "18:00", name: "#40: $54 Bankroll Builder Bounty", type: "BOUNTY", buyin: 54, guaranteed: 300000, priority: "high" },
    { id: 45, date: "2026-01-23", time: "18:00", name: "#41: $10 Flip & Go Friday [Go Stage]", type: "REGULAR", buyin: 10, guaranteed: 300000, priority: "medium" },
    { id: 46, date: "2026-01-24", time: "18:00", name: "#42: $108 Omaholic Secret KO [Mystery Bounty]", type: "BOUNTY", buyin: 108, guaranteed: 150000, priority: "high" },
    { id: 47, date: "2026-01-25", time: "18:00", name: "#43: $150 Winter Bounty Closer", type: "BOUNTY", buyin: 150, guaranteed: 500000, priority: "high" },
    { id: 48, date: "2026-01-26", time: "18:00", name: "#44: $250 Winter Giveaway Grand Finale [Day 2]", type: "REGULAR", buyin: 250, guaranteed: 5000000, priority: "medium" },
    { id: 49, date: "2026-01-27", time: "18:00", name: "#45: $50 Winter Super Saver [Hyper]", type: "TURBO", buyin: 50, guaranteed: 150000, priority: "very-high" },
  ];

  const tournaments = [];
  const dates = generateDatesForJanuary();
  let id = 1;

  // Adicionar Main Event Series
  tournaments.push(...mainEventSeries);
  id = Math.max(...mainEventSeries.map(t => t.id)) + 1;

  // Adicionar Daily Hypers e Turbos para cada dia
  dates.forEach(date => {
    const dateStr = date.toISOString().split('T')[0];
    
    // Daily Hyper
    dailyHyperTemplate.forEach(template => {
      tournaments.push({
        id: id++,
        date: dateStr,
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

    // Daily Turbo
    dailyTurboTemplate.forEach(template => {
      tournaments.push({
        id: id++,
        date: dateStr,
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

  // Adicionar Sunday Special Series para domingos
  const sundaySpecials = [
    { time: "12:00", name: "$125 Sunday Winter KICK-OFF", buyin: 125, guaranteed: 100000 },
    { time: "12:30", name: "$54 Sunday SNOWSTORM Bounty Turbo", buyin: 54, guaranteed: 75000, type: "BOUNTY", priority: "high" },
    { time: "13:00", name: "$250 Sunday MERRY Monster Stack", buyin: 250, guaranteed: 100000 },
    { time: "13:30", name: "$108 Sunday Bounty Blastoff [Big Bounties]", buyin: 108, guaranteed: 200000, type: "BOUNTY", priority: "high" },
    { time: "14:00", name: "$30 Sunday MERRYTHON", buyin: 30, guaranteed: 100000 },
    { time: "14:30", name: "$88 Bounty Winter BLAST", buyin: 88, guaranteed: 200000, type: "BOUNTY", priority: "high" },
    { time: "15:00", name: "$150 Winter GRAND PRIX", buyin: 150, guaranteed: 250000 },
    { time: "15:00", name: "$25 Mini Winter GRAND PRIX", buyin: 25, guaranteed: 150000 },
    { time: "15:30", name: "$44 Bounty Frozen FORTY STACK", buyin: 44, guaranteed: 250000, type: "BOUNTY", priority: "high" },
    { time: "16:00", name: "$88 Sunday DOUBLE Eights [2-Stack]", buyin: 88, guaranteed: 150000 },
    { time: "16:30", name: "$100 Sunday Omaholic 5-Card Double Stack", buyin: 100, guaranteed: 25000, priority: "low" },
    { time: "17:30", name: "$215 Bounty Hunters Sunday Winter GAMES", buyin: 215, guaranteed: 400000, type: "BOUNTY", priority: "high" },
    { time: "17:30", name: "$25 Bounty Hunters Sunday Winter GAMES", buyin: 25, guaranteed: 250000, type: "BOUNTY", priority: "high" },
    { time: "19:00", name: "$250 Sunday Winter CLASSIC", buyin: 250, guaranteed: 250000 },
    { time: "19:00", name: "$25 Mini Sunday Winter CLASSIC", buyin: 25, guaranteed: 100000 },
    { time: "19:30", name: "$32 Sunday Bounty KING Frozen Throne", buyin: 32, guaranteed: 150000, type: "BOUNTY", priority: "high" },
    { time: "19:30", name: "$215 Omaholic Bounty MAIN EVENT", buyin: 215, guaranteed: 50000, type: "BOUNTY", priority: "high" },
    { time: "20:00", name: "$108 Sunday SNOWDOWN [Mystery]", buyin: 108, guaranteed: 600000 },
    { time: "21:00", name: "$215 Sunday Heater [Bounty Turbo]", buyin: 215, guaranteed: 150000, type: "BOUNTY", priority: "high" },
    { time: "21:00", name: "$25 Mini Sunday Heater [Bounty Turbo]", buyin: 25, guaranteed: 100000, type: "BOUNTY", priority: "high" },
    { time: "21:30", name: "$150 Omaholic Heater [Bounty Turbo]", buyin: 150, guaranteed: 30000, type: "BOUNTY", priority: "high" },
    { time: "22:15", name: "$77 Sunday Snowy Sevens Turbo", buyin: 77, guaranteed: 100000, type: "TURBO", priority: "very-high" },
    { time: "23:00", name: "$50 Winter Tick Tock BOOM [Levels Decrease]", buyin: 50, guaranteed: 75000 }
  ];

  dates.forEach(date => {
    const dayOfWeek = date.getDay();
    // Sunday = 0
    if (dayOfWeek === 0) {
      const dateStr = date.toISOString().split('T')[0];
      sundaySpecials.forEach(special => {
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
    }
  });

  res.status(200).json(tournaments);
}
