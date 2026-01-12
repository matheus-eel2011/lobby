export default function handler(req, res) {
  res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=300");

  // ✅ Defaults para Late Reg
  const LATE_REG_DEFAULTS = {
    'REG': 60,
    'TURBO': 30,
    'HYPER': 15,
    'REG KO': 45,
    'TURBO KO': 20,
    'MYSTERY': 45,
    'BOUNTY': 45,
  };

  // ✅ Função: Determinar prioridade para torneios YaPoker
  const getYaPriority = (tournamentName) => {
    const nameLower = tournamentName.toLowerCase();
    
    if (nameLower.includes('mega stack') || nameLower.includes('deep') ||
        nameLower.includes('freezeout') || nameLower.includes('special') ||
        nameLower.includes('daily double') || nameLower.includes('loncar') ||
        nameLower.includes('boski') || nameLower.includes('early special') ||
        (nameLower.includes('$') && !nameLower.includes('pko') && !nameLower.includes('bounty') && !nameLower.includes('hyper') && !nameLower.includes('turbo'))) {
      return "high";
    }

    if (nameLower.includes('turbo')) {
      return "medium";
    }

    if (nameLower.includes('pko') || nameLower.includes('bounty') || nameLower.includes('lightning')) {
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

  const tournaments = [];
  const dates = generateDatesForJanuary();
  let id = 1;

  // ============================================
  // ✅ OPÇÃO 4: FUNÇÕES SEPARADAS POR SALA
  // ============================================

  /**
   * ✅ FUNÇÃO: Adicionar torneios GGPoker
   * Organiza todos os templates GGPoker com Late Reg definido
   */
  function addGGPokerTournaments(tournaments, startId) {
    let id = startId;

    // ✅ CONFIG: Templates de GGPoker com lateReg explícito
    const ggPokerConfig = {
      mainSeries: [
        { id: 25, date: "2026-01-07", time: "15:00", name: "#25: $100 Winter Classic [9-Max]", type: "REG", buyin: 100, guaranteed: 200000, priority: "medium", lateReg: 60 },
        { id: 30, date: "2026-01-12", time: "15:00", name: "#30: $54 Lucky Fortune Mystery Bounty [Day 2]", type: "MYSTERY", buyin: 54, guaranteed: 3000000, priority: "medium", lateReg: 180 },
        { id: 31, date: "2026-01-13", time: "15:00", name: "#31: $125 Winter Marathon", type: "REG", buyin: 125, guaranteed: 200000, priority: "medium", lateReg: 160 },
        { id: 32, date: "2026-01-14", time: "15:00", name: "#32: $25 Bounty Takedown [25 BB]", type: "REG KO", buyin: 25, guaranteed: 100000, priority: "medium", lateReg: 150 },
        { id: 33, date: "2026-01-15", time: "15:00", name: "#33: $88 Crystal Ball [Mystery Bounty]", type: "REG KO", buyin: 88, guaranteed: 500000, priority: "medium", lateReg: 150 },
        { id: 34, date: "2026-01-16", time: "15:00", name: "#34: $100 Frostfire Rising [Rebuy]", type: "REG", buyin: 100, guaranteed: 150000, priority: "medium", lateReg: 160 },
        { id: 35, date: "2026-01-17", time: "15:00", name: "#35: $54 Saturday Icebreaker [Bounty Hyper]", type: "HYPER", buyin: 54, guaranteed: 200000, priority: "medium", lateReg: 60 },
        { id: 36, date: "2026-01-18", time: "15:00", name: "#36: $200 Sunday Snowfall [6-Max]", type: "REG", buyin: 200, guaranteed: 400000, priority: "medium", lateReg: 160 },
        { id: 37, date: "2026-01-19", time: "15:00", name: "#37: $32 Omaholic Bounty [Final Day]", type: "REG KO", buyin: 32, guaranteed: 500000, priority: "medium", lateReg: 150 },
        { id: 38, date: "2026-01-20", time: "15:00", name: "#38: $215 Winter Frost Freezeout Bounty", type: "REG KO", buyin: 215, guaranteed: 300000, priority: "medium", lateReg: 150 },
        { id: 39, date: "2026-01-21", time: "15:00", name: "#39: $100 Deepstack [Slower Levels]", type: "REG", buyin: 100, guaranteed: 200000, priority: "medium", lateReg: 160 },
        { id: 40, date: "2026-01-22", time: "15:00", name: "#40: $54 Bankroll Builder Bounty", type: "REG KO", buyin: 54, guaranteed: 300000, priority: "medium", lateReg: 150 },
        { id: 41, date: "2026-01-23", time: "15:00", name: "#41: $10 Flip & Go Friday [Go Stage]", type: "REG", buyin: 10, guaranteed: 300000, priority: "medium", lateReg: 160 },
        { id: 42, date: "2026-01-24", time: "15:00", name: "#42: $108 Omaholic Secret KO [Mystery Bounty]", type: "REG KO", buyin: 108, guaranteed: 150000, priority: "medium", lateReg: 150 },
        { id: 43, date: "2026-01-25", time: "15:00", name: "#43: $150 Winter Bounty Closer", type: "REG KO", buyin: 150, guaranteed: 500000, priority: "medium", lateReg: 150 },
        { id: 44, date: "2026-01-26", time: "15:00", name: "#44: $250 Winter Giveaway Grand Finale [Day 2]", type: "REG", buyin: 250, guaranteed: 5000000, priority: "medium", lateReg: 160 },
        { id: 1, date: "2026-01-11", time: "09:00", name: "$125 Sunday Winter KICK-OFF", type: "REG", buyin: 125, guaranteed: 100000, priority: "medium", lateReg: 160 },
        { id: 2, date: "2026-01-11", time: "09:30", name: "$54 Sunday SNOWSTORM Bounty Turbo", type: "HYPER", buyin: 54, guaranteed: 75000, priority: "medium", lateReg: 60 },
        { id: 3, date: "2026-01-11", time: "10:00", name: "$250 Sunday MERRY Monster Stack", type: "REG", buyin: 250, guaranteed: 100000, priority: "medium", lateReg: 160 },
        { id: 4, date: "2026-01-11", time: "10:30", name: "$108 Sunday Bounty Blastoff [Big Bounties]", type: "REG KO", buyin: 108, guaranteed: 200000, priority: "medium", lateReg: 150 },
        { id: 5, date: "2026-01-11", time: "11:00", name: "$30 Sunday MERRYTHON", type: "REG", buyin: 30, guaranteed: 100000, priority: "medium", lateReg: 160 },
        { id: 6, date: "2026-01-11", time: "11:30", name: "$88 Bounty Winter BLAST", type: "REG KO", buyin: 88, guaranteed: 200000, priority: "medium", lateReg: 150 },
        { id: 7, date: "2026-01-11", time: "12:00", name: "$150 Winter GRAND PRIX", type: "REG", buyin: 150, guaranteed: 250000, priority: "medium", lateReg: 160 },
        { id: 8, date: "2026-01-11", time: "12:00", name: "$25 Mini Winter GRAND PRIX", type: "REG", buyin: 25, guaranteed: 150000, priority: "medium", lateReg: 160 },
        { id: 9, date: "2026-01-11", time: "12:30", name: "$44 Bounty Frozen FORTY STACK", type: "REG KO", buyin: 44, guaranteed: 250000, priority: "medium", lateReg: 150 },
        { id: 10, date: "2026-01-11", time: "13:00", name: "$88 Sunday DOUBLE Eights [2-Stack]", type: "REG", buyin: 88, guaranteed: 150000, priority: "medium", lateReg: 160 },
        { id: 11, date: "2026-01-11", time: "13:30", name: "$100 Sunday Omaholic 5-Card Double Stack", type: "REG", buyin: 100, guaranteed: 25000, priority: "medium", lateReg: 160 },
        { id: 12, date: "2026-01-11", time: "14:30", name: "$215 Bounty Hunters Sunday Winter GAMES", type: "REG KO", buyin: 215, guaranteed: 400000, priority: "medium", lateReg: 150 },
        { id: 13, date: "2026-01-11", time: "14:30", name: "$25 Bounty Hunters Sunday Winter GAMES", type: "REG KO", buyin: 25, guaranteed: 250000, priority: "medium", lateReg: 150 },
        { id: 14, date: "2026-01-11", time: "16:00", name: "$250 Sunday Winter CLASSIC", type: "REG", buyin: 250, guaranteed: 250000, priority: "medium", lateReg: 160 },
        { id: 15, date: "2026-01-11", time: "16:00", name: "$25 Mini Sunday Winter CLASSIC", type: "REG", buyin: 25, guaranteed: 100000, priority: "medium", lateReg: 160 },
        { id: 16, date: "2026-01-11", time: "16:30", name: "$32 Sunday Bounty KING Frozen Throne", type: "REG KO", buyin: 32, guaranteed: 150000, priority: "medium", lateReg: 150 },
        { id: 17, date: "2026-01-11", time: "16:30", name: "$215 Omaholic Bounty MAIN EVENT", type: "REG KO", buyin: 215, guaranteed: 50000, priority: "medium", lateReg: 150 },
        { id: 18, date: "2026-01-11", time: "17:00", name: "$108 Sunday SNOWDOWN [Mystery]", type: "REG KO", buyin: 108, guaranteed: 600000, priority: "medium", lateReg: 150 },
        { id: 19, date: "2026-01-11", time: "18:00", name: "$215 Sunday Heater [Bounty Turbo]", type: "REG KO", buyin: 215, guaranteed: 150000, priority: "medium", lateReg: 150 },
        { id: 20, date: "2026-01-11", time: "18:00", name: "$25 Mini Sunday Heater [Bounty Turbo]", type: "REG KO", buyin: 25, guaranteed: 100000, priority: "medium", lateReg: 150 },
        { id: 21, date: "2026-01-11", time: "18:30", name: "$150 Omaholic Heater [Bounty Turbo]", type: "REG KO", buyin: 150, guaranteed: 30000, priority: "medium", lateReg: 150 },
        { id: 22, date: "2026-01-11", time: "19:15", name: "$77 Sunday Snowy Sevens Turbo", type: "HYPER", buyin: 77, guaranteed: 100000, priority: "medium", lateReg: 60 },
        { id: 23, date: "2026-01-11", time: "20:00", name: "$50 Winter Tick Tock BOOM [Levels Decrease]", type: "HYPER", buyin: 50, guaranteed: 75000, priority: "medium", lateReg: 60 },
        { id: 24, date: "2026-01-12", time: "09:30", name: "$25 Bounty Snowstorm Deepstack Turbo", type: "REG KO", buyin: 25, guaranteed: 50000, priority: "medium", lateReg: 150 },
        { id: 25, date: "2026-01-12", time: "10:00", name: "$250 Merry Monster Stack", type: "REG", buyin: 250, guaranteed: 25000, priority: "medium", lateReg: 160 },
        { id: 26, date: "2026-01-12", time: "10:30", name: "$150 Bounty Blastoff [Big Bounties]", type: "REG KO", buyin: 150, guaranteed: 50000, priority: "medium", lateReg: 150 },
        { id: 27, date: "2026-01-12", time: "11:00", name: "$54 Bounty Fifty Stack", type: "REG KO", buyin: 54, guaranteed: 75000, priority: "medium", lateReg: 150 },
        { id: 28, date: "2026-01-12", time: "12:00", name: "$44 Frost Forty Stack", type: "REG", buyin: 44, guaranteed: 50000, priority: "medium", lateReg: 160 },
        { id: 29, date: "2026-01-12", time: "12:30", name: "$15 Bounty Hunters Holiday Special", type: "REG KO", buyin: 15, guaranteed: 100000, priority: "medium", lateReg: 150 },
        { id: 30, date: "2026-01-12", time: "13:00", name: "$88 Double Eights [2-Stack]", type: "REG", buyin: 88, guaranteed: 75000, priority: "medium", lateReg: 160 },
        { id: 31, date: "2026-01-12", time: "13:30", name: "$55 Omaholic 5-Card Double Stack", type: "REG", buyin: 55, guaranteed: 10000, priority: "medium", lateReg: 160 },
        { id: 32, date: "2026-01-12", time: "14:00", name: "$250 Daily Winter Freezeout", type: "REG", buyin: 250, guaranteed: 50000, priority: "medium", lateReg: 160 },
        { id: 33, date: "2026-01-12", time: "14:30", name: "$215 Bounty Hunters Winter Games", type: "REG KO", buyin: 215, guaranteed: 125000, priority: "medium", lateReg: 150 },
        { id: 34, date: "2026-01-12", time: "15:05", name: "$150 Monday Merry Monster Stack", type: "REG", buyin: 150, guaranteed: 150000, priority: "medium", lateReg: 160 },
        { id: 35, date: "2026-01-12", time: "15:05", name: "$15 Monday Merry Monster Stack", type: "REG", buyin: 15, guaranteed: 60000, priority: "medium", lateReg: 160 },
        { id: 36, date: "2026-01-12", time: "16:00", name: "$108 Omaholic Bounty Daily Main", type: "REG KO", buyin: 108, guaranteed: 15000, priority: "medium", lateReg: 150 },
        { id: 37, date: "2026-01-12", time: "16:30", name: "$32 Bounty King Frozen Throne", type: "REG KO", buyin: 32, guaranteed: 60000, priority: "medium", lateReg: 150 },
        { id: 38, date: "2026-01-12", time: "17:00", name: "$77 Snowy Sevens Turbo", type: "HYPER", buyin: 77, guaranteed: 50000, priority: "medium", lateReg: 60 },
        { id: 39, date: "2026-01-12", time: "17:30", name: "$54 Bounty Snowball [Big Bounties]", type: "REG KO", buyin: 54, guaranteed: 75000, priority: "medium", lateReg: 150 },
        { id: 40, date: "2026-01-12", time: "18:00", name: "$108 Holiday Heater [Bounty Turbo]", type: "REG KO", buyin: 108, guaranteed: 50000, priority: "medium", lateReg: 150 },
        { id: 41, date: "2026-01-12", time: "18:30", name: "$150 Omaholic Heater [Bounty Turbo]", type: "REG KO", buyin: 150, guaranteed: 15000, priority: "medium", lateReg: 150 },
        { id: 42, date: "2026-01-12", time: "19:00", name: "$66 Snowy Super Six [Bounty Turbo]", type: "REG KO", buyin: 66, guaranteed: 60000, priority: "medium", lateReg: 150 },
        { id: 43, date: "2026-01-12", time: "20:00", name: "$50 Winter Tick Tock BOOM [Levels Decrease]", type: "HYPER", buyin: 50, guaranteed: 25000, priority: "medium", lateReg: 60 }
      ],
      
      // ✅ GGMasters (REG) - 3 torneios com tempos diferentes
      ggmasters: [
        { time: "11:00", name: "GGMasters Asia", type: "REG", buyin: 25, guaranteed: 40000, priority: "medium", lateReg: 170 },
        { time: "13:00", name: "GGMasters Double Stack", type: "REG", buyin: 25, guaranteed: 40000, priority: "medium", lateReg: 195 },
        { time: "17:00", name: "GGMasters Classic", type: "REG", buyin: 25, guaranteed: 50000, priority: "medium", lateReg: 170 },
      ],

      // ✅ GGMasters Bounty (REG KO) - 3 torneios com tempos diferentes
      ggmastersBounty: [
        { time: "12:00", name: "GGMasters Bounty Warm-up", type: "REG KO", buyin: 25, guaranteed: 100000, priority: "medium", lateReg: 170 },
        { time: "16:00", name: "GGMasters Bounty", type: "REG KO", buyin: 25, guaranteed: 50000, priority: "medium", lateReg: 170 },
        { time: "18:00", name: "GGMasters Bounty Turbo", type: "REG KO", buyin: 25, guaranteed: 40000, priority: "medium", lateReg: 100 },
      ],

      // ✅ Turbo diários
      turboDailies: [
        { time: "21:15", name: "Daily Turbo $10", buyin: 10, guaranteed: 600, lateReg: 70 },
        { time: "21:15", name: "Daily Turbo $50", buyin: 50, guaranteed: 750, lateReg: 70 },
        { time: "21:15", name: "Daily Turbo $2", buyin: 2, guaranteed: 300, lateReg: 70 },
        { time: "22:15", name: "Daily Turbo $1", buyin: 1, guaranteed: 300, lateReg: 70 },
        { time: "22:15", name: "Daily Turbo $20", buyin: 20, guaranteed: 500, lateReg: 70 },
        { time: "23:15", name: "Daily Turbo $40", buyin: 40, guaranteed: 500, lateReg: 70 },
        { time: "23:15", name: "Daily Turbo $10", buyin: 10, guaranteed: 400, lateReg: 70 },
        { time: "23:15", name: "Daily Turbo $2", buyin: 2, guaranteed: 300, lateReg: 70 },
        { time: "0:15", name: "Daily Turbo $5", buyin: 5, guaranteed: 400, lateReg: 70 },
        { time: "0:15", name: "Daily Turbo $20", buyin: 20, guaranteed: 400, lateReg: 70 },
        { time: "0:15", name: "Daily Turbo $1", buyin: 1, guaranteed: 225, lateReg: 70 },
        { time: "1:15", name: "Daily Turbo $15", buyin: 15, guaranteed: 500, lateReg: 70 },
        { time: "1:15", name: "Daily Turbo $60", buyin: 60, guaranteed: 500, lateReg: 70 },
        { time: "1:15", name: "Daily Turbo $2", buyin: 2, guaranteed: 250, lateReg: 70 },
        { time: "2:15", name: "Daily Turbo $50", buyin: 50, guaranteed: 700, lateReg: 70 },
        { time: "2:15", name: "Daily Turbo $10", buyin: 10, guaranteed: 500, lateReg: 70 },
        { time: "2:15", name: "Daily Turbo $1", buyin: 1, guaranteed: 300, lateReg: 70 },
        { time: "3:15", name: "Daily Turbo $20", buyin: 20, guaranteed: 500, lateReg: 70 },
        { time: "3:15", name: "Daily Turbo $1", buyin: 1, guaranteed: 350, lateReg: 70 },
        { time: "3:15", name: "Daily Turbo $5", buyin: 5, guaranteed: 500, lateReg: 70 },
        { time: "4:15", name: "Superstack Turbo Special $25", buyin: 25, guaranteed: 5000, lateReg: 70 },
        { time: "4:15", name: "Daily Turbo $50", buyin: 50, guaranteed: 750, lateReg: 70 },
        { time: "4:15", name: "Daily Turbo $10", buyin: 10, guaranteed: 600, lateReg: 70 },
        { time: "5:15", name: "Daily Turbo $1", buyin: 1, guaranteed: 300, lateReg: 70 },
        { time: "5:15", name: "Daily Turbo $20", buyin: 20, guaranteed: 600, lateReg: 70 },
        { time: "5:15", name: "Daily Turbo $60", buyin: 60, guaranteed: 750, lateReg: 70 },
        { time: "5:15", name: "Daily Turbo $5", buyin: 5, guaranteed: 600, lateReg: 70 },
        { time: "6:15", name: "Daily Turbo $8", buyin: 8, guaranteed: 800, lateReg: 70 },
        { time: "6:15", name: "Daily Turbo $2", buyin: 2, guaranteed: 400, lateReg: 70 },
        { time: "6:15", name: "Daily Turbo $30", buyin: 30, guaranteed: 750, lateReg: 70 },
        { time: "7:15", name: "Daily Turbo $20", buyin: 20, guaranteed: 1000, lateReg: 70 },
        { time: "7:15", name: "Daily Turbo $80", buyin: 80, guaranteed: 1000, lateReg: 70 },
        { time: "7:15", name: "Daily Turbo $1", buyin: 1, guaranteed: 400, lateReg: 70 },
        { time: "7:15", name: "Daily Turbo $5", buyin: 5, guaranteed: 750, lateReg: 70 },
        { time: "8:15", name: "Daily Turbo $10", buyin: 10, guaranteed: 1000, lateReg: 70 },
        { time: "8:15", name: "Daily Turbo $50", buyin: 50, guaranteed: 600, lateReg: 70 },
        { time: "8:15", name: "Daily Turbo $2", buyin: 2, guaranteed: 500, lateReg: 70 },
        { time: "9:15", name: "Daily Turbo $100", buyin: 100, guaranteed: 1000, lateReg: 70 },
        { time: "9:15", name: "Daily Turbo $5", buyin: 5, guaranteed: 1000, lateReg: 70 },
        { time: "9:15", name: "Daily Turbo $1", buyin: 1, guaranteed: 600, lateReg: 70 },
        { time: "9:15", name: "Daily Turbo $20", buyin: 20, guaranteed: 1000, lateReg: 70 },
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
      ],

      // ✅ Hyper diários
      hyperDailies: [
        { time: "00:45", name: "Daily Hyper $50", buyin: 50, guaranteed: 2000, lateReg: 50 },
        { time: "00:45", name: "Daily Hyper $10", buyin: 10, guaranteed: 2000, lateReg: 50 },
        { time: "01:45", name: "Daily Hyper $20", buyin: 20, guaranteed: 2500, lateReg: 50 },
        { time: "01:45", name: "Daily Hyper $1", buyin: 1, guaranteed: 500, lateReg: 50 },
        { time: "01:45", name: "Daily Hyper $5", buyin: 5, guaranteed: 1250, lateReg: 50 },
        { time: "02:45", name: "Daily Hyper $2", buyin: 2, guaranteed: 600, lateReg: 50 },
        { time: "02:45", name: "Daily Hyper $10", buyin: 10, guaranteed: 1500, lateReg: 50 },
        { time: "02:45", name: "Daily Hyper $50", buyin: 50, guaranteed: 1500, lateReg: 50 },
        { time: "03:45", name: "Daily Hyper $1", buyin: 1, guaranteed: 400, lateReg: 50 },
        { time: "03:45", name: "Daily Hyper $100", buyin: 100, guaranteed: 2000, lateReg: 50 },
        { time: "03:45", name: "Daily Hyper $30", buyin: 30, guaranteed: 2000, lateReg: 50 },
        { time: "03:45", name: "Daily Hyper $8", buyin: 8, guaranteed: 1500, lateReg: 50 },
        { time: "04:45", name: "Daily Hyper $20", buyin: 20, guaranteed: 2000, lateReg: 50 },
        { time: "04:45", name: "Daily Hyper $60", buyin: 60, guaranteed: 1500, lateReg: 50 },
        { time: "04:45", name: "Daily Hyper $1", buyin: 1, guaranteed: 400, lateReg: 50 },
        { time: "04:45", name: "Daily Hyper $5", buyin: 5, guaranteed: 1000, lateReg: 50 },
        { time: "05:45", name: "Daily Hyper $10", buyin: 10, guaranteed: 1750, lateReg: 50 },
        { time: "05:45", name: "Daily Hyper $2", buyin: 2, guaranteed: 750, lateReg: 50 },
        { time: "05:45", name: "Daily Hyper $50", buyin: 50, guaranteed: 2000, lateReg: 50 },
        { time: "06:45", name: "Daily Hyper $8", buyin: 8, guaranteed: 1500, lateReg: 50 },
        { time: "06:45", name: "Daily Hyper $1", buyin: 1, guaranteed: 500, lateReg: 50 },
        { time: "06:45", name: "Daily Hyper $100", buyin: 100, guaranteed: 2000, lateReg: 50 },
        { time: "06:45", name: "Daily Hyper $30", buyin: 30, guaranteed: 2500, lateReg: 50 },
        { time: "07:45", name: "Daily Hyper $2", buyin: 2, guaranteed: 750, lateReg: 50 },
        { time: "07:45", name: "Daily Hyper $10", buyin: 10, guaranteed: 2500, lateReg: 50 },
        { time: "07:45", name: "Daily Hyper $60", buyin: 60, guaranteed: 2500, lateReg: 50 },
        { time: "08:45", name: "Daily Hyper $20", buyin: 20, guaranteed: 2500, lateReg: 50 },
        { time: "08:45", name: "Daily Hyper $5", buyin: 5, guaranteed: 1500, lateReg: 50 },
        { time: "08:45", name: "Daily Hyper $80", buyin: 80, guaranteed: 2000, lateReg: 50 },
        { time: "08:45", name: "Daily Hyper $1", buyin: 1, guaranteed: 500, lateReg: 50 },
        { time: "09:45", name: "Daily Hyper $10", buyin: 10, guaranteed: 3000, lateReg: 50 },
        { time: "09:45", name: "Daily Hyper $2", buyin: 2, guaranteed: 800, lateReg: 50 },
        { time: "09:45", name: "Daily Hyper $50", buyin: 50, guaranteed: 2500, lateReg: 50 },
        { time: "10:45", name: "Daily Hyper $1", buyin: 1, guaranteed: 600, lateReg: 50 },
        { time: "10:45", name: "Daily Hyper $5", buyin: 5, guaranteed: 1500, lateReg: 50 },
        { time: "10:45", name: "Daily Hyper $20", buyin: 20, guaranteed: 3000, lateReg: 50 },
        { time: "10:45", name: "Daily Hyper $60", buyin: 60, guaranteed: 2500, lateReg: 50 },
        { time: "11:45", name: "Daily Hyper $8", buyin: 8, guaranteed: 2500, lateReg: 50 },
        { time: "11:45", name: "Daily Hyper $1", buyin: 1, guaranteed: 750, lateReg: 50 },
        { time: "11:45", name: "Daily Hyper $30", buyin: 30, guaranteed: 3000, lateReg: 50 },
        { time: "11:45", name: "Daily Hyper $100", buyin: 100, guaranteed: 1500, lateReg: 50 },
        { time: "12:45", name: "Daily Hyper $50", buyin: 50, guaranteed: 3500, lateReg: 50 },
        { time: "12:45", name: "Daily Hyper $5", buyin: 5, guaranteed: 2000, lateReg: 50 },
        { time: "13:45", name: "Daily Hyper $20", buyin: 20, guaranteed: 4000, lateReg: 50 },
        { time: "13:45", name: "Daily Hyper $5", buyin: 5, guaranteed: 2500, lateReg: 50 },
        { time: "13:45", name: "Daily Hyper $80", buyin: 80, guaranteed: 2500, lateReg: 50 },
        { time: "13:45", name: "Daily Hyper $1", buyin: 1, guaranteed: 1000, lateReg: 50 },
        { time: "14:45", name: "Daily Hyper $2", buyin: 2, guaranteed: 2000, lateReg: 50 },
        { time: "14:45", name: "Daily Hypersonic $15", buyin: 15, guaranteed: 8000, lateReg: 50 },
        { time: "14:45", name: "Daily Hyper $50", buyin: 50, guaranteed: 4000, lateReg: 50 },
        { time: "15:45", name: "Daily Hyper $1", buyin: 1, guaranteed: 1000, lateReg: 50 },
        { time: "15:45", name: "Daily Hyper $100", buyin: 100, guaranteed: 3000, lateReg: 50 },
        { time: "15:45", name: "Daily Hyper $30", buyin: 30, guaranteed: 4000, lateReg: 50 },
        { time: "15:45", name: "Daily Hyper $8", buyin: 8, guaranteed: 5000, lateReg: 50 },
        { time: "16:45", name: "Daily Hyper Special $88", buyin: 88, guaranteed: 8000, lateReg: 50 },
        { time: "16:45", name: "Daily Hyper $20", buyin: 20, guaranteed: 6000, lateReg: 50 },
        { time: "16:45", name: "Daily Hyper $2", buyin: 2, guaranteed: 1500, lateReg: 50 },
        { time: "16:45", name: "Daily Hyper Special $8.88", buyin: 9, guaranteed: 8000, lateReg: 50 },
        { time: "16:45", name: "Daily Hyper $200", buyin: 200, guaranteed: 3000, lateReg: 50 },
        { time: "17:45", name: "Daily Hyper $5", buyin: 5, guaranteed: 4000, lateReg: 50 },
        { time: "17:45", name: "Daily Hyper $1", buyin: 1, guaranteed: 1000, lateReg: 50 },
        { time: "17:45", name: "Daily Hyper $50", buyin: 50, guaranteed: 5000, lateReg: 50 },
        { time: "18:45", name: "Daily Hyper $8", buyin: 8, guaranteed: 5000, lateReg: 50 },
        { time: "18:45", name: "Daily Hyper $80", buyin: 80, guaranteed: 3000, lateReg: 50 },
        { time: "18:45", name: "Daily Hyper $2", buyin: 2, guaranteed: 2000, lateReg: 50 },
        { time: "19:45", name: "Daily Hyper $10", buyin: 10, guaranteed: 7000, lateReg: 50 },
        { time: "19:45", name: "Daily Hyper $2", buyin: 2, guaranteed: 1750, lateReg: 50 },
        { time: "19:45", name: "Daily Hyper $50", buyin: 50, guaranteed: 5000, lateReg: 50 },
        { time: "20:45", name: "Daily Hyper $20", buyin: 20, guaranteed: 7000, lateReg: 50 },
        { time: "20:45", name: "Daily Hyper $1", buyin: 1, guaranteed: 750, lateReg: 50 },
        { time: "20:45", name: "Daily Hyper $100", buyin: 100, guaranteed: 3000, lateReg: 50 },
        { time: "20:45", name: "Daily Hyper $5", buyin: 5, guaranteed: 3000, lateReg: 50 },
        { time: "21:45", name: "Daily Hyper $50", buyin: 50, guaranteed: 4000, lateReg: 50 },
        { time: "21:45", name: "Daily Hyper $10", buyin: 10, guaranteed: 2500, lateReg: 50 },
        { time: "22:45", name: "Daily Hyper $1", buyin: 1, guaranteed: 600, lateReg: 50 },
        { time: "22:45", name: "Daily Hyper $20", buyin: 20, guaranteed: 4000, lateReg: 50 },
        { time: "22:45", name: "Daily Hyper $5", buyin: 5, guaranteed: 1500, lateReg: 50 },
        { time: "22:45", name: "Daily Hyper $80", buyin: 80, guaranteed: 3000, lateReg: 50 },
        { time: "23:45", name: "Daily Hyper $100", buyin: 100, guaranteed: 2000, lateReg: 50 },
        { time: "23:45", name: "Daily Hyper $30", buyin: 30, guaranteed: 2500, lateReg: 50 },
        { time: "23:45", name: "Daily Hyper $2", buyin: 2, guaranteed: 600, lateReg: 50 }
      //✅ Big diários
      bigDailies: [
        { time: "21:00", name: "Daily Big $20", buyin: 20, guaranteed: 750, lateReg: 90 },
        { time: "21:00", name: "Daily Big $2", buyin: 2, guaranteed: 350, lateReg: 90 },
        { time: "22:00", name: "Daily Big $30", buyin: 30, guaranteed: 600, lateReg: 90 },
        { time: "22:00", name: "Daily Big $10", buyin: 10, guaranteed: 600, lateReg: 90 },
        { time: "23:00", name: "Daily Big $3", buyin: 3, guaranteed: 250, lateReg: 90 },
        { time: "1:00", name: "Daily Big $2", buyin: 2, guaranteed: 200, lateReg: 90 },
        { time: "2:00", name: "Daily Big $3", buyin: 3, guaranteed: 300, lateReg: 90 },
        { time: "2:00", name: "Daily Big $20", buyin: 20, guaranteed: 500, lateReg: 90 },
        { time: "3:00", name: "Daily Big $15", buyin: 15, guaranteed: 600, lateReg: 90 },
        { time: "4:00", name: "Daily Big $3", buyin: 3, guaranteed: 600, lateReg: 90 },
        { time: "5:00", name: "Daily Big $40", buyin: 40, guaranteed: 800, lateReg: 90 },
        { time: "5:00", name: "Daily Big $4", buyin: 4, guaranteed: 500, lateReg: 90 },
        { time: "6:00", name: "Daily Big $3", buyin: 3, guaranteed: 600, lateReg: 90 },
        { time: "7:00", name: "Daily Big $50", buyin: 50, guaranteed: 800, lateReg: 90 },
        { time: "8:00", name: "Daily Big $2", buyin: 2, guaranteed: 500, lateReg: 90 },
        { time: "8:00", name: "Daily Big $20", buyin: 20, guaranteed: 1000, lateReg: 90 },
        { time: "9:00", name: "Daily Big $5", buyin: 5, guaranteed: 1000, lateReg: 90 },
        { time: "10:00", name: "Daily Big $40", buyin: 40, guaranteed: 1000, lateReg: 90 },
        { time: "10:00", name: "Daily Big $3", buyin: 3, guaranteed: 1000, lateReg: 90 },
        { time: "11:00", name: "Daily Big $2", buyin: 2, guaranteed: 750, lateReg: 90 },
        { time: "12:00", name: "Daily Big $5", buyin: 5, guaranteed: 1500, lateReg: 90 },
        { time: "12:00", name: "Daily Big $15", buyin: 15, guaranteed: 2500, lateReg: 90 },
        { time: "13:00", name: "Daily Big $3", buyin: 3, guaranteed: 1250, lateReg: 90 },
        { time: "14:00", name: "Daily Big $20", buyin: 20, guaranteed: 4000, lateReg: 90 },
        { time: "14:00", name: "Daily Big $1", buyin: 1, guaranteed: 1000, lateReg: 90 },
        { time: "15:00", name: "Daily Big $2", buyin: 2, guaranteed: 1000, lateReg: 90 },
        { time: "15:00", name: "Daily Big $10", buyin: 10, guaranteed: 3000, lateReg: 90 },
        { time: "16:00", name: "Daily Big $3", buyin: 3, guaranteed: 1000, lateReg: 90 },
        { time: "17:00", name: "Daily Big $5", buyin: 5, guaranteed: 1250, lateReg: 90 },
        { time: "17:00", name: "Daily Big $30", buyin: 30, guaranteed: 1500, lateReg: 90 },
        { time: "18:00", name: "Daily Big $50", buyin: 50, guaranteed: 1000, lateReg: 90 },
        { time: "18:00", name: "Daily Big $3", buyin: 3, guaranteed: 750, lateReg: 90 },
        { time: "19:00", name: "Daily Big $20", buyin: 20, guaranteed: 800, lateReg: 90 },
        { time: "20:00", name: "Daily Big $1", buyin: 1, guaranteed: 250, lateReg: 90 },
        { time: "20:00", name: "Daily Big $10", buyin: 10, guaranteed: 1000, lateReg: 90 },
      ]
    };

    // ✅ Adicionar Main Event Series (fixos, com datas)
    ggPokerConfig.mainSeries.forEach(tournament => {
      tournaments.push({
        id: tournament.id,
        date: tournament.date,
        time: tournament.time,
        site: "GGPoker",
        name: tournament.name,
        type: tournament.type,
        buyin: tournament.buyin,
        guaranteed: tournament.guaranteed,
        priority: tournament.priority,
        status: "Aberto",
        lateReg: tournament.lateReg || LATE_REG_DEFAULTS[tournament.type] || 30,
      });
    });

    // ✅ Adicionar GGMasters (diários)
    dates.forEach(date => {
      const dateStr = formatDateString(date);

      // GGMasters REG
      ggPokerConfig.ggmasters.forEach(template => {
        tournaments.push({
          id: id++,
          date: dateStr,
          time: template.time,
          site: "GGPoker",
          name: template.name,
          type: template.type,
          buyin: template.buyin,
          guaranteed: template.guaranteed,
          priority: template.priority,
          status: "Aberto",
          lateReg: template.lateReg,
        });
      });

      // GGMasters Bounty
      ggPokerConfig.ggmastersBounty.forEach(template => {
        tournaments.push({
          id: id++,
          date: dateStr,
          time: template.time,
          site: "GGPoker",
          name: template.name,
          type: template.type,
          buyin: template.buyin,
          guaranteed: template.guaranteed,
          priority: template.priority,
          status: "Aberto",
          lateReg: template.lateReg,
        });
      });

      // Turbo Dailies
      ggPokerConfig.turboDailies.forEach(template => {
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
          status: "Aberto",
          lateReg: template.lateReg,
        });
      });

      // Hyper Dailies
      ggPokerConfig.hyperDailies.forEach(template => {
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
          status: "Aberto",
          lateReg: template.lateReg,
        });
      });
    });

    return id;
  }

  /**
   * ✅ FUNÇÃO: Adicionar torneios PokerStars
   * Template para PokerStars (expandir conforme necessário)
   */
  function addPokerStarsTournaments(tournaments, startId) {
    let id = startId;

    const pokerStarsConfig = {
      featured: [
        { time: "09:00", name: "Sunday Million $1M GTD", type: "REG", buyin: 11, guaranteed: 1000000, priority: "very-high", lateReg: 120 },
        { time: "15:00", name: "Turbo Series $100K GTD", type: "TURBO", buyin: 5.50, guaranteed: 100000, priority: "high", lateReg: 30 },
        { time: "19:00", name: "PKO Tournament $50K GTD", type: "REG KO", buyin: 2.20, guaranteed: 50000, priority: "medium", lateReg: 45 },
      ],
    };

    const dates = generateDatesForJanuary();
    dates.forEach(date => {
      const dateStr = formatDateString(date);

      pokerStarsConfig.featured.forEach(template => {
        tournaments.push({
          id: id++,
          date: dateStr,
          time: template.time,
          site: "PokerStars",
          name: template.name,
          type: template.type,
          buyin: template.buyin,
          guaranteed: template.guaranteed,
          priority: template.priority,
          status: "Aberto",
          lateReg: template.lateReg,
        });
      });
    });

    return id;
  }

  /**
   * ✅ FUNÇÃO: Adicionar torneios YaPoker
   * Torneios de segunda a sábado
   */
  function addYaPokerTournaments(tournaments, startId) {
    let id = startId;

    const yaPokerConfig = {
      dailies: [
        { time: "02:05", name: "Hyper $5,000 GTD", type: "HYPER", buyin: 21.00, guaranteed: 5000, lateReg: 15 },
        { time: "02:05", name: "Lightning PKO $400 GTD", type: "REG KO", buyin: 10.50, guaranteed: 400, lateReg: 20 },
        { time: "02:15", name: "Turbo $600 GTD", type: "TURBO", buyin: 16.50, guaranteed: 600, lateReg: 20 },
        { time: "03:30", name: "PKO $5,000 GTD", type: "REG KO", buyin: 66.00, guaranteed: 5000, lateReg: 45 },
        { time: "09:15", name: "Early Special $6,000 GTD", type: "REG", buyin: 44.00, guaranteed: 6000, lateReg: 60 },
        { time: "10:45", name: "Mega Stack $1,500 GTD", type: "REG", buyin: 16.50, guaranteed: 1500, lateReg: 90 },
      ],
    };

    const dates = generateDatesForJanuary();
    dates.forEach(date => {
      const dayOfWeek = date.getDay();
      const dateStr = formatDateString(date);

      // YaPoker: segunda (1) a sábado (6)
      if (dayOfWeek >= 1 && dayOfWeek <= 6) {
        yaPokerConfig.dailies.forEach(template => {
          tournaments.push({
            id: id++,
            date: dateStr,
            time: template.time,
            site: "YaPoker",
            name: template.name,
            type: template.type,
            buyin: template.buyin,
            guaranteed: template.guaranteed,
            priority: getYaPriority(template.name),
            status: "Aberto",
            lateReg: template.lateReg,
          });
        });
      }
    });

    return id;
  }

  /**
   * ✅ FUNÇÃO: Adicionar torneios 888Poker
   * Template para 888Poker (expandir conforme necessário)
   */
  function add888PokerTournaments(tournaments, startId) {
    let id = startId;

    const pokerConfig888 = {
      dailies: [
        { time: "10:00", name: "Daily High $20K GTD", type: "REG", buyin: 10, guaranteed: 20000, priority: "high", lateReg: 60 },
        { time: "15:00", name: "Turbo Madness $10K GTD", type: "TURBO", buyin: 5, guaranteed: 10000, priority: "medium", lateReg: 25 },
        { time: "20:00", name: "Zone Poker KO $15K GTD", type: "REG KO", buyin: 25, guaranteed: 15000, priority: "medium", lateReg: 40 },
      ],
    };

    const dates = generateDatesForJanuary();
    dates.forEach(date => {
      const dateStr = formatDateString(date);

      pokerConfig888.dailies.forEach(template => {
        tournaments.push({
          id: id++,
          date: dateStr,
          time: template.time,
          site: "888Poker",
          name: template.name,
          type: template.type,
          buyin: template.buyin,
          guaranteed: template.guaranteed,
          priority: template.priority,
          status: "Aberto",
          lateReg: template.lateReg,
        });
      });
    });

    return id;
  }

  /**
   * ✅ FUNÇÃO: Adicionar torneios Champion
   * Template para Champion (expandir conforme necessário)
   */
  function addChampionTournaments(tournaments, startId) {
    let id = startId;

    const championConfig = {
      dailies: [
        { time: "12:00", name: "Champion Gold $5K GTD", type: "REG", buyin: 8, guaranteed: 5000, priority: "medium", lateReg: 60 },
        { time: "18:00", name: "Champion Turbo $3K GTD", type: "TURBO", buyin: 4, guaranteed: 3000, priority: "low", lateReg: 20 },
        { time: "21:00", name: "Champion Bounty $2K GTD", type: "REG KO", buyin: 11, guaranteed: 2000, priority: "medium", lateReg: 45 },
      ],
    };

    const dates = generateDatesForJanuary();
    dates.forEach(date => {
      const dateStr = formatDateString(date);

      championConfig.dailies.forEach(template => {
        tournaments.push({
          id: id++,
          date: dateStr,
          time: template.time,
          site: "Champion",
          name: template.name,
          type: template.type,
          buyin: template.buyin,
          guaranteed: template.guaranteed,
          priority: template.priority,
          status: "Aberto",
          lateReg: template.lateReg,
        });
      });
    });

    return id;
  }

  // ============================================
  // ✅ MAIN: EXECUTAR TODAS AS FUNÇÕES
  // ============================================

  id = addGGPokerTournaments(tournaments, id);
  id = addPokerStarsTournaments(tournaments, id);
  id = addYaPokerTournaments(tournaments, id);
  id = add888PokerTournaments(tournaments, id);
  id = addChampionTournaments(tournaments, id);

  // ✅ Garantir que todo torneio tem lateReg
  tournaments.forEach(t => {
    if (!t.lateReg || t.lateReg === 0) {
      t.lateReg = LATE_REG_DEFAULTS[t.type] || 30;
    }
  });

  res.json(tournaments);
}
