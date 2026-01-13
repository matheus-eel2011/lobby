export default function handler(req, res) {
  res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=300");

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
        { time: "08:00", name: "GGMasters Asia", type: "REG", buyin: 25, guaranteed: 40000, priority: "medium", lateReg: 170 },
        { time: "10:00", name: "GGMasters Double Stack", type: "REG", buyin: 25, guaranteed: 40000, priority: "medium", lateReg: 195 },
        { time: "14:00", name: "GGMasters Classic", type: "REG", buyin: 25, guaranteed: 50000, priority: "medium", lateReg: 170 },
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
        { time: "00:45", name: "Daily Hyper $100", buyin: 100, guaranteed: 2000, lateReg: 50 },
        { time: "00:45", name: "Daily Hyper $30", buyin: 30, guaranteed: 2000, lateReg: 50 },
        { time: "00:45", name: "Daily Hyper $8", buyin: 8, guaranteed: 1500, lateReg: 50 },
        { time: "01:45", name: "Daily Hyper $20", buyin: 20, guaranteed: 2000, lateReg: 50 },
        { time: "01:45", name: "Daily Hyper $60", buyin: 60, guaranteed: 1500, lateReg: 50 },
        { time: "01:45", name: "Daily Hyper $1", buyin: 1, guaranteed: 400, lateReg: 50 },
        { time: "01:45", name: "Daily Hyper $5", buyin: 5, guaranteed: 1000, lateReg: 50 },
        { time: "02:45", name: "Daily Hyper $10", buyin: 10, guaranteed: 1750, lateReg: 50 },
        { time: "02:45", name: "Daily Hyper $2", buyin: 2, guaranteed: 750, lateReg: 50 },
        { time: "02:45", name: "Daily Hyper $50", buyin: 50, guaranteed: 2000, lateReg: 50 },
        { time: "03:45", name: "Daily Hyper $8", buyin: 8, guaranteed: 1500, lateReg: 50 },
        { time: "03:45", name: "Daily Hyper $1", buyin: 1, guaranteed: 500, lateReg: 50 },
        { time: "03:45", name: "Daily Hyper $100", buyin: 100, guaranteed: 2000, lateReg: 50 },
        { time: "03:45", name: "Daily Hyper $30", buyin: 30, guaranteed: 2500, lateReg: 50 },
        { time: "04:45", name: "Daily Hyper $2", buyin: 2, guaranteed: 750, lateReg: 50 },
        { time: "04:45", name: "Daily Hyper $10", buyin: 10, guaranteed: 2500, lateReg: 50 },
        { time: "04:45", name: "Daily Hyper $60", buyin: 60, guaranteed: 2500, lateReg: 50 },
        { time: "05:45", name: "Daily Hyper $20", buyin: 20, guaranteed: 2500, lateReg: 50 },
        { time: "05:45", name: "Daily Hyper $5", buyin: 5, guaranteed: 1500, lateReg: 50 },
        { time: "05:45", name: "Daily Hyper $80", buyin: 80, guaranteed: 2000, lateReg: 50 },
        { time: "05:45", name: "Daily Hyper $1", buyin: 1, guaranteed: 500, lateReg: 50 },
        { time: "06:45", name: "Daily Hyper $10", buyin: 10, guaranteed: 3000, lateReg: 50 },
        { time: "06:45", name: "Daily Hyper $2", buyin: 2, guaranteed: 800, lateReg: 50 },
        { time: "06:45", name: "Daily Hyper $50", buyin: 50, guaranteed: 2500, lateReg: 50 },
        { time: "07:45", name: "Daily Hyper $1", buyin: 1, guaranteed: 600, lateReg: 50 },
        { time: "07:45", name: "Daily Hyper $5", buyin: 5, guaranteed: 1500, lateReg: 50 },
        { time: "07:45", name: "Daily Hyper $20", buyin: 20, guaranteed: 3000, lateReg: 50 },
        { time: "07:45", name: "Daily Hyper $60", buyin: 60, guaranteed: 2500, lateReg: 50 },
        { time: "08:45", name: "Daily Hyper $8", buyin: 8, guaranteed: 2500, lateReg: 50 },
        { time: "08:45", name: "Daily Hyper $1", buyin: 1, guaranteed: 750, lateReg: 50 },
        { time: "08:45", name: "Daily Hyper $30", buyin: 30, guaranteed: 3000, lateReg: 50 },
        { time: "08:45", name: "Daily Hyper $100", buyin: 100, guaranteed: 1500, lateReg: 50 },
        { time: "09:45", name: "Daily Hyper $50", buyin: 50, guaranteed: 3500, lateReg: 50 },
        { time: "09:45", name: "Daily Hyper $5", buyin: 5, guaranteed: 2000, lateReg: 50 },
        { time: "10:45", name: "Daily Hyper $20", buyin: 20, guaranteed: 4000, lateReg: 50 },
        { time: "10:45", name: "Daily Hyper $5", buyin: 5, guaranteed: 2500, lateReg: 50 },
        { time: "10:45", name: "Daily Hyper $80", buyin: 80, guaranteed: 2500, lateReg: 50 },
        { time: "10:45", name: "Daily Hyper $1", buyin: 1, guaranteed: 1000, lateReg: 50 },
        { time: "11:45", name: "Daily Hyper $2", buyin: 2, guaranteed: 2000, lateReg: 50 },
        { time: "11:45", name: "Daily Hypersonic $15", buyin: 15, guaranteed: 8000, lateReg: 50 },
        { time: "11:45", name: "Daily Hyper $50", buyin: 50, guaranteed: 4000, lateReg: 50 },
        { time: "12:45", name: "Daily Hyper $1", buyin: 1, guaranteed: 1000, lateReg: 50 },
        { time: "12:45", name: "Daily Hyper $100", buyin: 100, guaranteed: 3000, lateReg: 50 },
        { time: "12:45", name: "Daily Hyper $30", buyin: 30, guaranteed: 4000, lateReg: 50 },
        { time: "12:45", name: "Daily Hyper $8", buyin: 8, guaranteed: 5000, lateReg: 50 },
        { time: "13:45", name: "Daily Hyper Special $88", buyin: 88, guaranteed: 8000, lateReg: 50 },
        { time: "13:45", name: "Daily Hyper $20", buyin: 20, guaranteed: 6000, lateReg: 50 },
        { time: "13:45", name: "Daily Hyper $2", buyin: 2, guaranteed: 1500, lateReg: 50 },
        { time: "13:45", name: "Daily Hyper Special $8.88", buyin: 9, guaranteed: 8000, lateReg: 50 },
        { time: "13:45", name: "Daily Hyper $200", buyin: 200, guaranteed: 3000, lateReg: 50 },
        { time: "14:45", name: "Daily Hyper $5", buyin: 5, guaranteed: 4000, lateReg: 50 },
        { time: "14:45", name: "Daily Hyper $1", buyin: 1, guaranteed: 1000, lateReg: 50 },
        { time: "14:45", name: "Daily Hyper $50", buyin: 50, guaranteed: 5000, lateReg: 50 },
        { time: "15:45", name: "Daily Hyper $8", buyin: 8, guaranteed: 5000, lateReg: 50 },
        { time: "15:45", name: "Daily Hyper $80", buyin: 80, guaranteed: 3000, lateReg: 50 },
        { time: "15:45", name: "Daily Hyper $2", buyin: 2, guaranteed: 2000, lateReg: 50 },
        { time: "16:45", name: "Daily Hyper $10", buyin: 10, guaranteed: 7000, lateReg: 50 },
        { time: "16:45", name: "Daily Hyper $2", buyin: 2, guaranteed: 1750, lateReg: 50 },
        { time: "16:45", name: "Daily Hyper $50", buyin: 50, guaranteed: 5000, lateReg: 50 },
        { time: "17:45", name: "Daily Hyper $20", buyin: 20, guaranteed: 7000, lateReg: 50 },
        { time: "17:45", name: "Daily Hyper $1", buyin: 1, guaranteed: 750, lateReg: 50 },
        { time: "17:45", name: "Daily Hyper $100", buyin: 100, guaranteed: 3000, lateReg: 50 },
        { time: "17:45", name: "Daily Hyper $5", buyin: 5, guaranteed: 3000, lateReg: 50 },
        { time: "18:45", name: "Daily Hyper $50", buyin: 50, guaranteed: 4000, lateReg: 50 },
        { time: "18:45", name: "Daily Hyper $10", buyin: 10, guaranteed: 2500, lateReg: 50 },
        { time: "19:45", name: "Daily Hyper $1", buyin: 1, guaranteed: 600, lateReg: 50 },
        { time: "19:45", name: "Daily Hyper $20", buyin: 20, guaranteed: 4000, lateReg: 50 },
        { time: "19:45", name: "Daily Hyper $5", buyin: 5, guaranteed: 1500, lateReg: 50 },
        { time: "19:45", name: "Daily Hyper $80", buyin: 80, guaranteed: 3000, lateReg: 50 },
        { time: "20:45", name: "Daily Hyper $100", buyin: 100, guaranteed: 2000, lateReg: 50 },
        { time: "20:45", name: "Daily Hyper $30", buyin: 30, guaranteed: 2500, lateReg: 50 },
        { time: "20:45", name: "Daily Hyper $2", buyin: 2, guaranteed: 600, lateReg: 50 },
        { time: "21:45", name: "Daily Hyper $50", buyin: 50, guaranteed: 2000, lateReg: 50 },
        { time: "21:45", name: "Daily Hyper $10", buyin: 10, guaranteed: 2000, lateReg: 50 },
        { time: "22:45", name: "Daily Hyper $20", buyin: 20, guaranteed: 2500, lateReg: 50 },
        { time: "22:45", name: "Daily Hyper $1", buyin: 1, guaranteed: 500, lateReg: 50 },
        { time: "23:45", name: "Daily Hyper $5", buyin: 5, guaranteed: 1250, lateReg: 50 },
        { time: "23:45", name: "Daily Hyper $2", buyin: 2, guaranteed: 600, lateReg: 50 },
        { time: "23:45", name: "Daily Hyper $10", buyin: 10, guaranteed: 1500, lateReg: 50 },
        { time: "23:45", name: "Daily Hyper $50", buyin: 50, guaranteed: 1500, lateReg: 50 },
      ],
      //✅ Big diários
      bigDailies: [
        { time: "21:00", name: "Daily Big $20", buyin: 20, guaranteed: 750, lateReg: 120 },
        { time: "21:00", name: "Daily Big $2", buyin: 2, guaranteed: 350, lateReg: 90 },
        { time: "22:00", name: "Daily Big $30", buyin: 30, guaranteed: 600, lateReg: 120 },
        { time: "22:00", name: "Daily Big $10", buyin: 10, guaranteed: 600, lateReg: 90 },
        { time: "23:00", name: "Daily Big $3", buyin: 3, guaranteed: 250, lateReg: 90 },
        { time: "1:00", name: "Daily Big $2", buyin: 2, guaranteed: 200, lateReg: 90 },
        { time: "2:00", name: "Daily Big $3", buyin: 3, guaranteed: 300, lateReg: 90 },
        { time: "2:00", name: "Daily Big $20", buyin: 20, guaranteed: 500, lateReg: 120 },
        { time: "3:00", name: "Daily Big $15", buyin: 15, guaranteed: 600, lateReg: 90 },
        { time: "4:00", name: "Daily Big $3", buyin: 3, guaranteed: 600, lateReg: 90 },
        { time: "5:00", name: "Daily Big $40", buyin: 40, guaranteed: 800, lateReg: 120 },
        { time: "5:00", name: "Daily Big $4", buyin: 4, guaranteed: 500, lateReg: 90 },
        { time: "6:00", name: "Daily Big $3", buyin: 3, guaranteed: 600, lateReg: 90 },
        { time: "7:00", name: "Daily Big $50", buyin: 50, guaranteed: 800, lateReg: 120 },
        { time: "8:00", name: "Daily Big $2", buyin: 2, guaranteed: 500, lateReg: 90 },
        { time: "8:00", name: "Daily Big $20", buyin: 20, guaranteed: 1000, lateReg: 120 },
        { time: "9:00", name: "Daily Big $5", buyin: 5, guaranteed: 1000, lateReg: 90 },
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

      // Big Dailies
      ggPokerConfig.bigDailies.forEach(template => {
        tournaments.push({
          id: id++,
          date: dateStr,
          time: template.time,
          site: "GGPoker",
          name: template.name,
          type: "REG",
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
   * ✅ FUNÇÃO: Adicionar torneios partypoker
   * Organiza todos os templates partypoker com Late Reg definido
   */
  function addpartypokerTournaments(tournaments, startId) {
    let id = startId;

    // ✅ CONFIG: Templates de GGPoker com lateReg explícito
    const partypokerConfig = {
      mainSeries: [
        { id: 1, date: "2026-01-13", time: "06:00", name: "Bounty Hunter 8-Max: $1K Gtd", type: "REG KO", buyin: 109, guaranteed: 1000, priority: "high", lateReg: 80 },
        { id: 2, date: "2026-01-13", time: "06:05", name: "Daily Legends 8-Max PKO: $1.5K Gtd", type: "REG KO", buyin: 33, guaranteed: 1500, priority: "high", lateReg: 80 },
        { id: 3, date: "2026-01-13", time: "07:30", name: "Daily Legends 7-Max Early Mystery Turbo: $1K Gtd", type: "mystery", buyin: 11, guaranteed: 1000, priority: "medium", lateReg: 80 },
        { id: 4, date: "2026-01-13", time: "08:00", name: "Bounty Hunter 7-Max: $1.5K Gtd", type: "REG KO", buyin: 55, guaranteed: 1500, priority: "high", lateReg: 80 },
        { id: 5, date: "2026-01-13", time: "08:30", name: "Daily Legends 6-Max Deepstack Turbo: $1K Gtd", type: "TURBO", buyin: 22, guaranteed: 1000, priority: "medium", lateReg: 60 },
        { id: 6, date: "2026-01-13", time: "09:00", name: "Bounty Hunter 6-Max: $1K Gtd", type: "REG KO", buyin: 22, guaranteed: 1000, priority: "high", lateReg: 80 },
        { id: 7, date: "2026-01-13", time: "09:00", name: "Bounty Hunter 7-Max: $1K Gtd", type: "REG KO", buyin: 82, guaranteed: 1000, priority: "high", lateReg: 80 },
        { id: 8, date: "2026-01-13", time: "10:00", name: "Bounty Hunter 8-Max: $1.5K Gtd", type: "REG KO", buyin: 11, guaranteed: 1500, priority: "high", lateReg: 80 },
        { id: 9, date: "2026-01-13", time: "10:15", name: "Bounty Hunter 6-Max Turbo: $1K Gtd", type: "TURBO", buyin: 55, guaranteed: 1000, priority: "medium", lateReg: 80 },
        { id: 10, date: "2026-01-13", time: "11:05", name: "Daily Legends 7-Max PKO: $1.5K Gtd", type: "REG KO", buyin: 5.5, guaranteed: 1500, priority: "high", lateReg: 80 },
        { id: 11, date: "2026-01-13", time: "11:05", name: "Daily Legends 7-Max PKO: $3K Gtd", type: "REG KO", buyin: 33, guaranteed: 3000, priority: "high", lateReg: 80 },
        { id: 12, date: "2026-01-13", time: "12:00", name: "Bounty Hunter 8-Max: $2K Gtd", type: "REG KO", buyin: 16.5, guaranteed: 2000, priority: "high", lateReg: 80 },
        { id: 13, date: "2026-01-13", time: "12:00", name: "Bounty Hunter 8-Max: $1K Gtd", type: "REG KO", buyin: 55, guaranteed: 1000, priority: "high", lateReg: 80 },
        { id: 14, date: "2026-01-13", time: "12:30", name: "Daily Legends 8-Max Deepstack: $3K Gtd", type: "REG", buyin: 11, guaranteed: 3000, priority: "high", lateReg: 96 },
        { id: 15, date: "2026-01-13", time: "13:05", name: "Daily Legends 6-Max Mystery Bounty: $5K Gtd", type: "MYSTERY", buyin: 22, guaranteed: 5000, priority: "high", lateReg: 80 },
        { id: 16, date: "2026-01-13", time: "13:30", name: "8-Max: $1K Gtd", type: "REG", buyin: 22, guaranteed: 1000, priority: "medium", lateReg: 80 },
        { id: 17, date: "2026-01-13", time: "13:45", name: "Bounty Hunter 7-Max Turbo: $1K Gtd", type: "TURBO", buyin: 33, guaranteed: 1000, priority: "medium", lateReg: 80 },
        { id: 18, date: "2026-01-13", time: "14:00", name: "Bounty Hunter 6-Max: $1.5K Gtd", type: "REG KO", buyin: 55, guaranteed: 1500, priority: "high", lateReg: 80 },
        { id: 19, date: "2026-01-13", time: "14:00", name: "Super $215 Satellite: 5 x $215 Gtd", type: "REG", buyin: 33, guaranteed: 1075, priority: "medium", lateReg: 80 },
        { id: 20, date: "2026-01-13", time: "14:05", name: "Daily Legends Terminator: $6K Gtd", type: "REG KO", buyin: 11, guaranteed: 6000, priority: "high", lateReg: 80 },
        { id: 21, date: "2026-01-13", time: "14:30", name: "Daily Legends Masters: $3K Gtd", type: "REG", buyin: 55, guaranteed: 3000, priority: "high", lateReg: 80 },
        { id: 22, date: "2026-01-13", time: "14:30", name: "Daily Legends 7-Max: $3K Gtd", type: "REG", buyin: 11, guaranteed: 3000, priority: "high", lateReg: 80 },
        { id: 23, date: "2026-01-13", time: "14:45", name: "Bounty Hunter 6-Max Hyper: $1K Gtd", type: "HYPER", buyin: 55, guaranteed: 1000, priority: "low", lateReg: 80 },
        { id: 24, date: "2026-01-13", time: "15:05", name: "Daily Legends Centurion: $5K Gtd", type: "REG", buyin: 109, guaranteed: 5000, priority: "high", lateReg: 80 },
        { id: 25, date: "2026-01-13", time: "15:05", name: "Daily Legends Predator: $10K Gtd", type: "REG", buyin: 22, guaranteed: 10000, priority: "high", lateReg: 80 },
        { id: 26, date: "2026-01-13", time: "15:05", name: "Daily Legends Headhunter: $3K Gtd", type: "REG", buyin: 5.5, guaranteed: 3000, priority: "high", lateReg: 80 },
        { id: 27, date: "2026-01-13", time: "15:15", name: "Bounty Hunter 6-Max Turbo: $1K Gtd", type: "TURBO", buyin: 11, guaranteed: 1000, priority: "medium", lateReg: 80 },
        { id: 28, date: "2026-01-13", time: "15:15", name: "Bounty Hunter 7-Max Turbo: $1K Gtd", type: "TURBO", buyin: 55, guaranteed: 1000, priority: "medium", lateReg: 80 },
        { id: 29, date: "2026-01-13", time: "15:30", name: "Daily Legends 8-Max: $1K Gtd", type: "REG", buyin: 5.5, guaranteed: 1000, priority: "high", lateReg: 80 },
        { id: 30, date: "2026-01-13", time: "15:30", name: "Daily Legends Clásico: $4K Gtd", type: "REG", buyin: 22, guaranteed: 4000, priority: "high", lateReg: 80 },
        { id: 31, date: "2026-01-13", time: "16:05", name: "The Super $11: $10,000 Gtd", type: "REG", buyin: 11, guaranteed: 10000, priority: "high", lateReg: 80 },
        { id: 32, date: "2026-01-13", time: "16:05", name: "The Super $55: $20,000 Gtd", type: "REG", buyin: 55, guaranteed: 20000, priority: "high", lateReg: 80 },
        { id: 33, date: "2026-01-13", time: "16:05", name: "The Super $215: $10,000 Gtd", type: "REG", buyin: 215, guaranteed: 10000, priority: "high", lateReg: 80 },
        { id: 34, date: "2026-01-13", time: "16:15", name: "Bounty Hunter 6-Max Turbo: $1K Gtd", type: "TURBO", buyin: 5.5, guaranteed: 1000, priority: "medium", lateReg: 80 },
        { id: 35, date: "2026-01-13", time: "16:30", name: "6-Max: $1K Gtd", type: "REG", buyin: 11, guaranteed: 1000, priority: "medium", lateReg: 80 },
        { id: 36, date: "2026-01-13", time: "16:45", name: "Bounty Hunter 8-Max Hyper: $1K Gtd", type: "HYPER", buyin: 16.5, guaranteed: 1000, priority: "low", lateReg: 80 },
        { id: 37, date: "2026-01-13", time: "17:05", name: "Daily Legends Gladiator: $6K Gtd", type: "REG", buyin: 33, guaranteed: 6000, priority: "high", lateReg: 80 },
        { id: 38, date: "2026-01-13", time: "17:30", name: "8-Max Deepstack: $1K Gtd", type: "REG", buyin: 22, guaranteed: 1000, priority: "high", lateReg: 96 },
        { id: 39, date: "2026-01-13", time: "17:30", name: "Daily Legends 6-Max Turbo: $1.5K Gtd", type: "TURBO", buyin: 11, guaranteed: 1500, priority: "medium", lateReg: 80 },
        { id: 40, date: "2026-01-13", time: "18:00", name: "Bounty Hunter 6-Max: $2K Gtd", type: "REG KO", buyin: 55, guaranteed: 2000, priority: "high", lateReg: 80 },
        { id: 41, date: "2026-01-13", time: "18:00", name: "Bounty Hunter 6-Max: $1K Gtd", type: "REG KO", buyin: 11, guaranteed: 1000, priority: "high", lateReg: 80 },
        { id: 42, date: "2026-01-13", time: "18:05", name: "Daily Legends 7-Max Early Mystery Turbo: $7.5K Gtd", type: "TURBO", buyin: 22, guaranteed: 7500, priority: "medium", lateReg: 80 },
        { id: 43, date: "2026-01-13", time: "18:05", name: "Daily Legends 7-Max Early Mystery Turbo: $3K Gtd", type: "TURBO", buyin: 5.5, guaranteed: 3000, priority: "medium", lateReg: 80 },
        { id: 44, date: "2026-01-13", time: "18:30", name: "Daily Legends 6-Max Deepstack: $3K Gtd", type: "REG", buyin: 33, guaranteed: 3000, priority: "high", lateReg: 96 },
        { id: 45, date: "2026-01-13", time: "19:00", name: "Bounty Hunter 7-Max: $1.5K Gtd", type: "REG KO", buyin: 22, guaranteed: 1500, priority: "high", lateReg: 80 },
        { id: 46, date: "2026-01-13", time: "19:05", name: "Daily Legends 6-Max PKO Turbo: $2K Gtd", type: "TURBO KO", buyin: 11, guaranteed: 2000, priority: "high", lateReg: 80 },
        { id: 47, date: "2026-01-13", time: "19:05", name: "Daily Legends 6-Max PKO Turbo: $4K Gtd", type: "TURBO KO", buyin: 55, guaranteed: 4000, priority: "high", lateReg: 80 },
        { id: 48, date: "2026-01-13", time: "19:30", name: "8-Max: $1K Gtd", type: "REG", buyin: 11, guaranteed: 1000, priority: "medium", lateReg: 80 },
        { id: 49, date: "2026-01-13", time: "19:45", name: "Bounty Hunter 6-Max Hyper: $1K Gtd", type: "HYPER", buyin: 33, guaranteed: 1000, priority: "low", lateReg: 80 },
        { id: 50, date: "2026-01-14", time: "20:00", name: "Bounty Hunter 8-Max: $1K Gtd", type: "REG KO", buyin: 11, guaranteed: 1000, priority: "high", lateReg: 80 },
        { id: 51, date: "2026-01-14", time: "20:05", name: "Daily Legends 6-Max Deepstack Hyper: $2K Gtd", type: "HYPER", buyin: 55, guaranteed: 2000, priority: "low", lateReg: 96 },
        { id: 52, date: "2026-01-14", time: "20:15", name: "Bounty Hunter 7-Max Turbo: $1K Gtd", type: "TURBO", buyin: 22, guaranteed: 1000, priority: "medium", lateReg: 80 },
        { id: 53, date: "2026-01-14", time: "20:45", name: "Bounty Hunter 7-Max Hyper: $1.5K Gtd", type: "HYPER", buyin: 55, guaranteed: 1500, priority: "low", lateReg: 80 },
        { id: 54, date: "2026-01-14", time: "21:05", name: "The Super $22: $3,000 Gtd", type: "REG", buyin: 22, guaranteed: 3000, priority: "medium", lateReg: 80 },
        { id: 55, date: "2026-01-14", time: "21:05", name: "The Super $5.50: $2,000 Gtd", type: "REG", buyin: 5.5, guaranteed: 2000, priority: "medium", lateReg: 80 },
        { id: 56, date: "2026-01-14", time: "21:05", name: "The Super $109: $4,000 Gtd", type: "REG", buyin: 109, guaranteed: 4000, priority: "medium", lateReg: 80 },
        { id: 57, date: "2026-01-14", time: "22:05", name: "Daily Legends 7-Max PKO: $1K Gtd", type: "REG KO", buyin: 33, guaranteed: 1000, priority: "high", lateReg: 80 },
        { id: 58, date: "2026-01-14", time: "06:05", name: "Daily Legends 8-Max PKO: $1.5K Gtd", type: "REG KO", buyin: 33, guaranteed: 1500, priority: "high", lateReg: 80 },
        { id: 59, date: "2026-01-14", time: "07:30", name: "Daily Legends 7-Max Early Mystery Turbo: $1K Gtd", type: "TURBO", buyin: 11, guaranteed: 1000, priority: "medium", lateReg: 80 },
        { id: 60, date: "2026-01-14", time: "08:30", name: "Daily Legends 6-Max Deepstack Turbo: $1K Gtd", type: "TURBO", buyin: 22, guaranteed: 1000, priority: "medium", lateReg: 60 },
        { id: 61, date: "2026-01-14", time: "11:05", name: "Daily Legends 7-Max PKO: $1.5K Gtd", type: "REG KO", buyin: 5.5, guaranteed: 1500, priority: "high", lateReg: 80 },
        { id: 62, date: "2026-01-14", time: "11:05", name: "Daily Legends 7-Max PKO: $3K Gtd", type: "REG KO", buyin: 33, guaranteed: 3000, priority: "high", lateReg: 80 },
        { id: 63, date: "2026-01-14", time: "12:30", name: "Daily Legends 8-Max Deepstack: $3K Gtd", type: "REG", buyin: 11, guaranteed: 3000, priority: "high", lateReg: 96 },
        { id: 64, date: "2026-01-14", time: "13:05", name: "Daily Legends 6-Max Mystery Bounty: $5K Gtd", type: "MYSTERY", buyin: 22, guaranteed: 5000, priority: "high", lateReg: 80 },
        { id: 65, date: "2026-01-14", time: "14:00", name: "Super $320 Satellite: 5 x $320 Gtd", type: "REG", buyin: 55, guaranteed: 1600, priority: "medium", lateReg: 80 },
        { id: 66, date: "2026-01-14", time: "14:05", name: "Daily Legends Terminator: $6K Gtd", type: "REG", buyin: 11, guaranteed: 6000, priority: "high", lateReg: 80 },
        { id: 67, date: "2026-01-14", time: "14:30", name: "Daily Legends 7-Max: $3K Gtd", type: "REG", buyin: 11, guaranteed: 3000, priority: "high", lateReg: 80 },
        { id: 68, date: "2026-01-14", time: "14:30", name: "Daily Legends Masters: $3K Gtd", type: "REG", buyin: 55, guaranteed: 3000, priority: "high", lateReg: 80 },
        { id: 69, date: "2026-01-14", time: "15:05", name: "Daily Legends Centurion: $5K Gtd", type: "REG", buyin: 109, guaranteed: 5000, priority: "high", lateReg: 80 },
        { id: 70, date: "2026-01-14", time: "15:05", name: "Daily Legends Predator: $10K Gtd", type: "REG KO", buyin: 22, guaranteed: 10000, priority: "high", lateReg: 80 },
        { id: 71, date: "2026-01-14", time: "15:05", name: "Daily Legends Headhunter: $3K Gtd", type: "REG KO", buyin: 5.5, guaranteed: 3000, priority: "high", lateReg: 80 },
        { id: 72, date: "2026-01-14", time: "15:30", name: "Daily Legends 8-Max: $1K Gtd", type: "REG", buyin: 5.5, guaranteed: 1000, priority: "high", lateReg: 80 },
        { id: 73, date: "2026-01-14", time: "15:30", name: "Daily Legends Clásico: $4K Gtd", type: "REG", buyin: 22, guaranteed: 4000, priority: "high", lateReg: 80 },
        { id: 74, date: "2026-01-14", time: "16:05", name: "The Super $11: $10,000 Gtd", type: "REG KO", buyin: 11, guaranteed: 10000, priority: "high", lateReg: 80 },
        { id: 75, date: "2026-01-14", time: "16:05", name: "The Super $55: $20,000 Gtd", type: "REG KO", buyin: 55, guaranteed: 20000, priority: "high", lateReg: 80 },
        { id: 76, date: "2026-01-14", time: "16:05", name: "The Super $320: $10,000 Gtd", type: "REG", buyin: 320, guaranteed: 10000, priority: "high", lateReg: 80 },
        { id: 77, date: "2026-01-14", time: "17:05", name: "Daily Legends Gladiator: $6K Gtd", type: "REG", buyin: 33, guaranteed: 6000, priority: "high", lateReg: 80 },
        { id: 78, date: "2026-01-14", time: "17:30", name: "Daily Legends 6-Max Turbo: $1.5K Gtd", type: "TURBO", buyin: 11, guaranteed: 1500, priority: "medium", lateReg: 80 },
        { id: 79, date: "2026-01-14", time: "18:05", name: "Daily Legends 7-Max Early Mystery Turbo: $7.5K Gtd", type: "MYSTERY", buyin: 22, guaranteed: 7500, priority: "medium", lateReg: 80 },
        { id: 80, date: "2026-01-14", time: "18:05", name: "Daily Legends 7-Max Early Mystery Turbo: $3K Gtd", type: "MYSTERY", buyin: 5.5, guaranteed: 3000, priority: "medium", lateReg: 80 },
        { id: 81, date: "2026-01-14", time: "18:30", name: "Daily Legends 6-Max Deepstack: $3K Gtd", type: "REG", buyin: 33, guaranteed: 3000, priority: "high", lateReg: 96 },
        { id: 82, date: "2026-01-14", time: "19:05", name: "Daily Legends 6-Max PKO Turbo: $2K Gtd", type: "TURBO KO", buyin: 11, guaranteed: 2000, priority: "high", lateReg: 80 },
        { id: 83, date: "2026-01-14", time: "19:05", name: "Daily Legends 6-Max PKO Turbo: $4K Gtd", type: "TURBO KO", buyin: 55, guaranteed: 4000, priority: "high", lateReg: 80 },
        { id: 84, date: "2026-01-15", time: "20:05", name: "Daily Legends 6-Max Deepstack Hyper: $2K Gtd", type: "HYPER", buyin: 55, guaranteed: 2000, priority: "low", lateReg: 96 },
        { id: 85, date: "2026-01-15", time: "21:05", name: "The Super $22: $3,000 Gtd", type: "REG", buyin: 22, guaranteed: 3000, priority: "medium", lateReg: 80 },
        { id: 86, date: "2026-01-15", time: "21:05", name: "The Super $5.50: $2,000 Gtd", type: "REG", buyin: 5.5, guaranteed: 2000, priority: "medium", lateReg: 80 },
        { id: 87, date: "2026-01-15", time: "21:05", name: "The Super $109: $5,000 Gtd", type: "REG", buyin: 109, guaranteed: 5000, priority: "medium", lateReg: 80 },
        { id: 88, date: "2026-01-15", time: "22:05", name: "Daily Legends 7-Max PKO: $1K Gtd", type: "REG KO", buyin: 33, guaranteed: 1000, priority: "high", lateReg: 80 },
        { id: 89, date: "2026-01-15", time: "06:05", name: "Daily Legends 8-Max PKO: $1.5K Gtd", type: "REG KO", buyin: 33, guaranteed: 1500, priority: "high", lateReg: 80 },
        { id: 90, date: "2026-01-15", time: "07:30", name: "Daily Legends 7-Max Early Mystery Turbo: $1K Gtd", type: "MYSTERY", buyin: 11, guaranteed: 1000, priority: "medium", lateReg: 80 },
        { id: 91, date: "2026-01-15", time: "08:30", name: "Daily Legends 6-Max Deepstack Turbo: $1K Gtd", type: "MYSTERY", buyin: 22, guaranteed: 1000, priority: "medium", lateReg: 60 },
        { id: 92, date: "2026-01-15", time: "11:05", name: "Daily Legends 7-Max PKO: $1.5K Gtd", type: "REG KO", buyin: 5.5, guaranteed: 1500, priority: "high", lateReg: 80 },
        { id: 93, date: "2026-01-15", time: "11:05", name: "Daily Legends 7-Max PKO: $3K Gtd", type: "REG KO", buyin: 33, guaranteed: 3000, priority: "high", lateReg: 80 },
        { id: 94, date: "2026-01-15", time: "12:30", name: "Daily Legends 8-Max Deepstack: $3K Gtd", type: "REG", buyin: 11, guaranteed: 3000, priority: "high", lateReg: 96 },
        { id: 95, date: "2026-01-15", time: "13:05", name: "Daily Legends 6-Max Mystery Bounty: $5K Gtd", type: "MYSTERY", buyin: 22, guaranteed: 5000, priority: "high", lateReg: 80 },
        { id: 96, date: "2026-01-15", time: "14:05", name: "Daily Legends Terminator: $6K Gtd", type: "REG", buyin: 11, guaranteed: 6000, priority: "high", lateReg: 80 },
        { id: 97, date: "2026-01-15", time: "14:30", name: "Daily Legends 7-Max: $3K Gtd", type: "REG", buyin: 11, guaranteed: 3000, priority: "high", lateReg: 80 },
        { id: 98, date: "2026-01-15", time: "14:30", name: "Daily Legends Masters: $3K Gtd", type: "REG", buyin: 55, guaranteed: 3000, priority: "high", lateReg: 80 },
        { id: 99, date: "2026-01-15", time: "15:05", name: "Daily Legends Centurion: $5K Gtd", type: "REG", buyin: 109, guaranteed: 5000, priority: "high", lateReg: 80 },
        { id: 100, date: "2026-01-15", time: "15:05", name: "Daily Legends Predator: $10K Gtd", type: "REG", buyin: 22, guaranteed: 10000, priority: "high", lateReg: 80 },
        { id: 101, date: "2026-01-15", time: "15:05", name: "Daily Legends Headhunter: $3K Gtd", type: "REG", buyin: 5.5, guaranteed: 3000, priority: "high", lateReg: 80 },
        { id: 102, date: "2026-01-15", time: "15:30", name: "Daily Legends 8-Max: $1K Gtd", type: "REG", buyin: 5.5, guaranteed: 1000, priority: "high", lateReg: 80 },
        { id: 103, date: "2026-01-15", time: "15:30", name: "Daily Legends Clásico: $4K Gtd", type: "REG", buyin: 22, guaranteed: 4000, priority: "high", lateReg: 80 },
        { id: 104, date: "2026-01-15", time: "16:05", name: "The Super $11: $10,000 Gtd", type: "REG", buyin: 11, guaranteed: 10000, priority: "high", lateReg: 80 },
        { id: 105, date: "2026-01-15", time: "16:05", name: "The Super $55: $20,000 Gtd", type: "REG", buyin: 55, guaranteed: 20000, priority: "high", lateReg: 80 },
        { id: 106, date: "2026-01-15", time: "16:05", name: "The Super $320: $10,000 Gtd", type: "REG", buyin: 320, guaranteed: 10000, priority: "high", lateReg: 80 },
        { id: 107, date: "2026-01-15", time: "17:05", name: "Daily Legends Gladiator: $6K Gtd", type: "REG", buyin: 33, guaranteed: 6000, priority: "high", lateReg: 80 },
        { id: 108, date: "2026-01-15", time: "17:30", name: "Daily Legends 6-Max Turbo: $1.5K Gtd", type: "TURBO", buyin: 11, guaranteed: 1500, priority: "medium", lateReg: 80 },
        { id: 109, date: "2026-01-15", time: "18:05", name: "Daily Legends 7-Max Early Mystery Turbo: $7.5K Gtd", type: "MYSTERY", buyin: 22, guaranteed: 7500, priority: "medium", lateReg: 80 },
        { id: 110, date: "2026-01-15", time: "18:05", name: "Daily Legends 7-Max Early Mystery Turbo: $3K Gtd", type: "MYSTERY", buyin: 5.5, guaranteed: 3000, priority: "medium", lateReg: 80 },
        { id: 111, date: "2026-01-15", time: "18:30", name: "Daily Legends 6-Max Deepstack: $3K Gtd", type: "REG", buyin: 33, guaranteed: 3000, priority: "high", lateReg: 96 },
        { id: 112, date: "2026-01-15", time: "19:05", name: "Daily Legends 6-Max PKO Turbo: $2K Gtd", type: "TURBO KO", buyin: 11, guaranteed: 2000, priority: "high", lateReg: 80 },
        { id: 113, date: "2026-01-15", time: "19:05", name: "Daily Legends 6-Max PKO Turbo: $4K Gtd", type: "TURBO KO", buyin: 55, guaranteed: 4000, priority: "high", lateReg: 80 },
        { id: 114, date: "2026-01-16", time: "20:05", name: "Daily Legends 6-Max Deepstack Hyper: $2K Gtd", type: "HYPER", buyin: 55, guaranteed: 2000, priority: "low", lateReg: 96 },
        { id: 115, date: "2026-01-16", time: "21:05", name: "The Super $22: $3,000 Gtd", type: "REG", buyin: 22, guaranteed: 3000, priority: "medium", lateReg: 80 },
        { id: 116, date: "2026-01-16", time: "21:05", name: "The Super $5.50: $2,000 Gtd", type: "REG", buyin: 5.5, guaranteed: 2000, priority: "medium", lateReg: 80 },
        { id: 117, date: "2026-01-16", time: "21:05", name: "The Super $109: $5,000 Gtd", type: "REG", buyin: 109, guaranteed: 5000, priority: "medium", lateReg: 80 },
        { id: 118, date: "2026-01-16", time: "22:05", name: "Daily Legends 7-Max PKO: $1K Gtd", type: "REG KO", buyin: 33, guaranteed: 1000, priority: "high", lateReg: 80 },
        { id: 119, date: "2026-01-16", time: "06:05", name: "Daily Legends 8-Max PKO: $1.5K Gtd", type: "PKO", buyin: 33, guaranteed: 1500, priority: "high", lateReg: 80 },
        { id: 120, date: "2026-01-16", time: "07:30", name: "Daily Legends 7-Max Early Mystery Turbo: $1K Gtd", type: "TURBO", buyin: 11, guaranteed: 1000, priority: "medium", lateReg: 80 },
        { id: 121, date: "2026-01-16", time: "08:30", name: "Daily Legends 6-Max Deepstack Turbo: $1K Gtd", type: "TURBO", buyin: 22, guaranteed: 1000, priority: "medium", lateReg: 60 },
        { id: 122, date: "2026-01-16", time: "11:05", name: "Daily Legends 7-Max PKO: $1.5K Gtd", type: "PKO", buyin: 5.5, guaranteed: 1500, priority: "high", lateReg: 80 },
        { id: 123, date: "2026-01-16", time: "11:05", name: "Daily Legends 7-Max PKO: $3K Gtd", type: "PKO", buyin: 33, guaranteed: 3000, priority: "high", lateReg: 80 },
        { id: 124, date: "2026-01-16", time: "12:30", name: "Daily Legends 8-Max Deepstack: $3K Gtd", type: "REG", buyin: 11, guaranteed: 3000, priority: "high", lateReg: 96 },
        { id: 125, date: "2026-01-16", time: "13:05", name: "Daily Legends 6-Max Mystery Bounty: $5K Gtd", type: "KO", buyin: 22, guaranteed: 5000, priority: "high", lateReg: 80 },
        { id: 126, date: "2026-01-16", time: "14:05", name: "Daily Legends Terminator: $6K Gtd", type: "REG", buyin: 11, guaranteed: 6000, priority: "high", lateReg: 80 },
        { id: 127, date: "2026-01-16", time: "14:30", name: "Daily Legends 7-Max: $3K Gtd", type: "REG", buyin: 11, guaranteed: 3000, priority: "high", lateReg: 80 },
        { id: 128, date: "2026-01-16", time: "14:30", name: "Daily Legends Masters: $3K Gtd", type: "REG", buyin: 55, guaranteed: 3000, priority: "high", lateReg: 80 },
        { id: 129, date: "2026-01-16", time: "15:05", name: "Daily Legends Centurion: $5K Gtd", type: "REG", buyin: 109, guaranteed: 5000, priority: "high", lateReg: 80 },
        { id: 130, date: "2026-01-16", time: "15:05", name: "Daily Legends Predator: $10K Gtd", type: "REG", buyin: 22, guaranteed: 10000, priority: "high", lateReg: 80 },
        { id: 131, date: "2026-01-16", time: "15:05", name: "Daily Legends Headhunter: $3K Gtd", type: "REG", buyin: 5.5, guaranteed: 3000, priority: "high", lateReg: 80 },
        { id: 132, date: "2026-01-16", time: "15:30", name: "Daily Legends 8-Max: $1K Gtd", type: "REG", buyin: 5.5, guaranteed: 1000, priority: "high", lateReg: 80 },
        { id: 133, date: "2026-01-16", time: "15:30", name: "Daily Legends Clásico: $4K Gtd", type: "REG", buyin: 22, guaranteed: 4000, priority: "high", lateReg: 80 },
        { id: 134, date: "2026-01-16", time: "16:05", name: "The Super $11: $10,000 Gtd", type: "REG", buyin: 11, guaranteed: 10000, priority: "high", lateReg: 80 },
        { id: 135, date: "2026-01-16", time: "16:05", name: "The Super $55: $20,000 Gtd", type: "REG", buyin: 55, guaranteed: 20000, priority: "high", lateReg: 80 },
        { id: 136, date: "2026-01-16", time: "17:05", name: "Daily Legends Gladiator: $6K Gtd", type: "REG", buyin: 33, guaranteed: 6000, priority: "high", lateReg: 80 },
        { id: 137, date: "2026-01-16", time: "17:30", name: "Daily Legends 6-Max Turbo: $1.5K Gtd", type: "TURBO", buyin: 11, guaranteed: 1500, priority: "medium", lateReg: 80 },
        { id: 138, date: "2026-01-16", time: "18:05", name: "Daily Legends 7-Max Early Mystery Turbo: $7.5K Gtd", type: "MYSTERY", buyin: 22, guaranteed: 7500, priority: "medium", lateReg: 80 },
        { id: 139, date: "2026-01-16", time: "18:05", name: "Daily Legends 7-Max Early Mystery Turbo: $3K Gtd", type: "MYSTERY", buyin: 5.5, guaranteed: 3000, priority: "medium", lateReg: 80 },
        { id: 140, date: "2026-01-16", time: "18:30", name: "Daily Legends 6-Max Deepstack: $3K Gtd", type: "REG", buyin: 33, guaranteed: 3000, priority: "high", lateReg: 96 },
        { id: 141, date: "2026-01-16", time: "19:05", name: "Daily Legends 6-Max PKO Turbo: $2K Gtd", type: "TURBO KO", buyin: 11, guaranteed: 2000, priority: "high", lateReg: 80 },
        { id: 142, date: "2026-01-16", time: "19:05", name: "Daily Legends 6-Max PKO Turbo: $4K Gtd", type: "TURBO KO", buyin: 55, guaranteed: 4000, priority: "high", lateReg: 80 },
        { id: 143, date: "2026-01-17", time: "20:05", name: "Daily Legends 6-Max Deepstack Hyper: $2K Gtd", type: "HYPER", buyin: 55, guaranteed: 2000, priority: "low", lateReg: 96 },
        { id: 144, date: "2026-01-17", time: "21:05", name: "The Super $22: $3,000 Gtd", type: "REG", buyin: 22, guaranteed: 3000, priority: "medium", lateReg: 80 },
        { id: 145, date: "2026-01-17", time: "21:05", name: "The Super $5.50: $2,000 Gtd", type: "REG", buyin: 5.5, guaranteed: 2000, priority: "medium", lateReg: 80 },
        { id: 146, date: "2026-01-17", time: "21:05", name: "The Super $109: $5,000 Gtd", type: "REG", buyin: 109, guaranteed: 5000, priority: "medium", lateReg: 80 },
        { id: 147, date: "2026-01-17", time: "22:05", name: "Daily Legends 7-Max PKO: $1K Gtd", type: "PKO", buyin: 33, guaranteed: 1000, priority: "high", lateReg: 80 },
        { id: 148, date: "2026-01-17", time: "06:05", name: "Daily Legends 8-Max PKO: $1.5K Gtd", type: "PKO", buyin: 33, guaranteed: 1500, priority: "high", lateReg: 80 },
        { id: 149, date: "2026-01-17", time: "07:30", name: "Daily Legends 7-Max Early Mystery Turbo: $1K Gtd", type: "MYSTERY", buyin: 11, guaranteed: 1000, priority: "medium", lateReg: 80 },
        { id: 150, date: "2026-01-17", time: "08:30", name: "Daily Legends 6-Max Deepstack Turbo: $1K Gtd", type: "TURBO", buyin: 22, guaranteed: 1000, priority: "medium", lateReg: 60 },
        { id: 151, date: "2026-01-17", time: "11:05", name: "Daily Legends 7-Max PKO: $1.5K Gtd", type: "REG KO", buyin: 5.5, guaranteed: 1500, priority: "high", lateReg: 80 },
        { id: 152, date: "2026-01-17", time: "11:05", name: "Daily Legends 7-Max PKO: $3K Gtd", type: "REG KO", buyin: 33, guaranteed: 3000, priority: "high", lateReg: 80 },
        { id: 153, date: "2026-01-17", time: "12:30", name: "Daily Legends 8-Max Deepstack: $2.5K Gtd", type: "REG", buyin: 11, guaranteed: 2500, priority: "high", lateReg: 96 },
        { id: 154, date: "2026-01-17", time: "13:05", name: "Daily Legends 6-Max Mystery Bounty: $5K Gtd", type: "MYSTERY", buyin: 22, guaranteed: 5000, priority: "high", lateReg: 80 },
        { id: 155, date: "2026-01-17", time: "14:05", name: "Daily Legends Terminator: $5K Gtd", type: "REG", buyin: 11, guaranteed: 5000, priority: "high", lateReg: 80 },
        { id: 156, date: "2026-01-17", time: "14:30", name: "Daily Legends 7-Max: $2K Gtd", type: "REG", buyin: 11, guaranteed: 2000, priority: "high", lateReg: 80 },
        { id: 157, date: "2026-01-17", time: "14:30", name: "Daily Legends Masters: $2.5K Gtd", type: "REG", buyin: 55, guaranteed: 2500, priority: "high", lateReg: 80 },
        { id: 158, date: "2026-01-17", time: "15:05", name: "Daily Legends Centurion: $4K Gtd", type: "REG", buyin: 109, guaranteed: 4000, priority: "high", lateReg: 80 },
        { id: 159, date: "2026-01-17", time: "15:05", name: "Daily Legends Predator: $7.5K Gtd", type: "REG", buyin: 22, guaranteed: 7500, priority: "high", lateReg: 80 },
        { id: 160, date: "2026-01-17", time: "15:05", name: "Daily Legends Headhunter: $3K Gtd", type: "REG", buyin: 5.5, guaranteed: 3000, priority: "high", lateReg: 80 },
        { id: 161, date: "2026-01-17", time: "15:30", name: "Daily Legends 8-Max: $1K Gtd", type: "REG", buyin: 5.5, guaranteed: 1000, priority: "high", lateReg: 80 },
        { id: 162, date: "2026-01-17", time: "15:30", name: "Daily Legends Clásico: $3K Gtd", type: "REG", buyin: 22, guaranteed: 3000, priority: "high", lateReg: 80 },
        { id: 163, date: "2026-01-17", time: "16:05", name: "The Super $11: $10,000 Gtd", type: "REG", buyin: 11, guaranteed: 10000, priority: "high", lateReg: 80 },
        { id: 164, date: "2026-01-17", time: "16:05", name: "The Super $55: $20,000 Gtd", type: "REG", buyin: 55, guaranteed: 20000, priority: "high", lateReg: 80 },
        { id: 165, date: "2026-01-17", time: "17:05", name: "Daily Legends Gladiator: $6K Gtd", type: "REG", buyin: 33, guaranteed: 6000, priority: "high", lateReg: 80 },
        { id: 166, date: "2026-01-17", time: "17:30", name: "Daily Legends 6-Max Turbo: $1.5K Gtd", type: "TURBO", buyin: 11, guaranteed: 1500, priority: "medium", lateReg: 80 },
        { id: 167, date: "2026-01-17", time: "18:00", name: "The Sunday Party Mega Sat: 25 x $109 Gtd", type: "REG", buyin: 16.5, guaranteed: 2725, priority: "medium", lateReg: 80 },
        { id: 168, date: "2026-01-17", time: "18:05", name: "Daily Legends 7-Max Early Mystery Turbo: $7.5K Gtd", type: "MYSTERY", buyin: 22, guaranteed: 7500, priority: "medium", lateReg: 80 },
        { id: 169, date: "2026-01-17", time: "18:05", name: "Daily Legends 7-Max Early Mystery Turbo: $3K Gtd", type: "MYSTERY", buyin: 5.5, guaranteed: 3000, priority: "medium", lateReg: 80 },
        { id: 170, date: "2026-01-17", time: "18:30", name: "Daily Legends 6-Max Deepstack: $2.5K Gtd", type: "REG", buyin: 33, guaranteed: 2500, priority: "high", lateReg: 96 },
        { id: 171, date: "2026-01-17", time: "19:05", name: "Daily Legends 6-Max PKO Turbo: $2K Gtd", type: "TURBO KO", buyin: 11, guaranteed: 2000, priority: "high", lateReg: 80 },
        { id: 172, date: "2026-01-17", time: "19:05", name: "Daily Legends 6-Max PKO Turbo: $3K Gtd", type: "REG KO", buyin: 55, guaranteed: 3000, priority: "high", lateReg: 80 },
        { id: 173, date: "2026-01-18", time: "20:05", name: "Daily Legends 6-Max Deepstack Hyper: $2K Gtd", type: "HYPER", buyin: 55, guaranteed: 2000, priority: "low", lateReg: 96 },
        { id: 174, date: "2026-01-18", time: "21:05", name: "The Super $22: $3,000 Gtd", type: "REG", buyin: 22, guaranteed: 3000, priority: "medium", lateReg: 80 },
        { id: 175, date: "2026-01-18", time: "21:05", name: "The Super $5.50: $2,000 Gtd", type: "REG", buyin: 5.5, guaranteed: 2000, priority: "medium", lateReg: 80 },
        { id: 176, date: "2026-01-18", time: "21:05", name: "The Super $109: $5,000 Gtd", type: "REG", buyin: 109, guaranteed: 5000, priority: "medium", lateReg: 80 },
        { id: 177, date: "2026-01-18", time: "22:05", name: "Daily Legends 7-Max PKO: $1K Gtd", type: "PKO", buyin: 33, guaranteed: 1000, priority: "high", lateReg: 80 },
        { id: 178, date: "2026-01-18", time: "06:05", name: "Daily Legends 8-Max PKO: $1.5K Gtd", type: "PKO", buyin: 33, guaranteed: 1500, priority: "high", lateReg: 80 },
        { id: 179, date: "2026-01-18", time: "07:30", name: "Daily Legends 7-Max Early Mystery Turbo: $1K Gtd", type: "TURBO", buyin: 11, guaranteed: 1000, priority: "medium", lateReg: 80 },
        { id: 180, date: "2026-01-18", time: "08:30", name: "Daily Legends 6-Max Deepstack Turbo: $1K Gtd", type: "TURBO", buyin: 22, guaranteed: 1000, priority: "medium", lateReg: 60 },
        { id: 181, date: "2026-01-18", time: "11:05", name: "Daily Legends 7-Max PKO: $2K Gtd", type: "REG KO", buyin: 5.5, guaranteed: 2000, priority: "high", lateReg: 80 },
        { id: 182, date: "2026-01-18", time: "11:05", name: "Daily Legends 7-Max PKO: $5K Gtd", type: "REG KO", buyin: 33, guaranteed: 5000, priority: "high", lateReg: 80 },
        { id: 183, date: "2026-01-18", time: "12:30", name: "Daily Legends 8-Max Deepstack: $5K Gtd", type: "REG", buyin: 11, guaranteed: 5000, priority: "high", lateReg: 96 },
        { id: 184, date: "2026-01-18", time: "13:00", name: "The Sunday Party Mega Sat: 50 x $109 Gtd", type: "SAT", buyin: 16.5, guaranteed: 5450, priority: "medium", lateReg: 80 },
        { id: 185, date: "2026-01-18", time: "13:05", name: "Daily Legends 6-Max PKO: $6K Gtd", type: "REG KO", buyin: 22, guaranteed: 6000, priority: "high", lateReg: 80 },
        { id: 186, date: "2026-01-18", time: "14:00", name: "The Sunday Party Mega Sat: 40 x $109 Gtd", type: "SAT", buyin: 16.5, guaranteed: 4360, priority: "medium", lateReg: 80 },
        { id: 187, date: "2026-01-18", time: "14:05", name: "The Big Sunday: $25K Gtd", type: "REG", buyin: 215, guaranteed: 25000, priority: "high", lateReg: 80 },
        { id: 188, date: "2026-01-18", time: "14:05", name: "The Super $11 Early Mystery: $15,000 Gtd", type: "MYSTERY", buyin: 11, guaranteed: 15000, priority: "high", lateReg: 80 },
        { id: 189, date: "2026-01-18", time: "14:05", name: "The Super $55 Early Mystery: $40,000 Gtd", type: "MYSTERY", buyin: 55, guaranteed: 40000, priority: "high", lateReg: 80 },
        { id: 190, date: "2026-01-18", time: "14:05", name: "The Super $320 Early Mystery: $20,000 Gtd", type: "MYSTERY", buyin: 320, guaranteed: 20000, priority: "high", lateReg: 80 },
        { id: 191, date: "2026-01-18", time: "14:05", name: "The Sunday Party Sat: 75 x $109 Gtd", type: "SAT", buyin: 0, guaranteed: 8175, priority: "medium", lateReg: 80 },
        { id: 192, date: "2026-01-18", time: "14:30", name: "Daily Legends 7-Max: $4K Gtd", type: "REG", buyin: 11, guaranteed: 4000, priority: "high", lateReg: 80 },
        { id: 193, date: "2026-01-18", time: "14:30", name: "Daily Legends Masters: $4K Gtd", type: "REG", buyin: 55, guaranteed: 4000, priority: "high", lateReg: 80 },
        { id: 194, date: "2026-01-18", time: "15:00", name: "The Sunday Party Mega Sat: 30 x $109 Gtd", type: "SAT", buyin: 16.5, guaranteed: 3270, priority: "medium", lateReg: 80 },
        { id: 195, date: "2026-01-18", time: "15:05", name: "The Super $5.50: $5,000 Gtd", type: "REG", buyin: 5.5, guaranteed: 5000, priority: "high", lateReg: 80 },
        { id: 196, date: "2026-01-18", time: "15:05", name: "The Super $33: $20,000 Gtd", type: "REG", buyin: 33, guaranteed: 20000, priority: "high", lateReg: 80 },
        { id: 197, date: "2026-01-18", time: "15:05", name: "The Super $215: $15,000 Gtd", type: "REG", buyin: 215, guaranteed: 15000, priority: "high", lateReg: 80 },
        { id: 198, date: "2026-01-18", time: "15:30", name: "Daily Legends 8-Max: $2K Gtd", type: "REG", buyin: 5.5, guaranteed: 2000, priority: "high", lateReg: 80 },
        { id: 199, date: "2026-01-18", time: "15:30", name: "Daily Legends Clásico: $5K Gtd", type: "REG", buyin: 22, guaranteed: 5000, priority: "high", lateReg: 80 },
        { id: 200, date: "2026-01-18", time: "16:05", name: "The Sunday Carnival: $30,000 Gtd", type: "TURBO", buyin: 22, guaranteed: 30000, priority: "high", lateReg: 80 },
        { id: 201, date: "2026-01-18", time: "16:05", name: "Daily Legends 8-Max PKO: $1K Gtd", type: "REG KO", buyin: 2.2, guaranteed: 1000, priority: "high", lateReg: 80 },
        { id: 202, date: "2026-01-18", time: "16:05", name: "The Sunday Party: $80,000 Gtd", type: "REG", buyin: 109, guaranteed: 80000, priority: "high", lateReg: 80 },
        { id: 203, date: "2026-01-18", time: "17:00", name: "PartyPoker Tour Path Round 5: 10 x £1K Packages", type: "REG", buyin: 0, guaranteed: 10000, priority: "high", lateReg: 80 },
        { id: 204, date: "2026-01-18", time: "17:05", name: "Daily Legends Gladiator: $6K Gtd", type: "REG", buyin: 33, guaranteed: 6000, priority: "high", lateReg: 80 },
        { id: 205, date: "2026-01-18", time: "17:30", name: "Daily Legends 6-Max Turbo: $3K Gtd", type: "TURBO", buyin: 109, guaranteed: 3000, priority: "medium", lateReg: 80 },
        { id: 206, date: "2026-01-18", time: "17:30", name: "Daily Legends 6-Max Turbo: $1.5K Gtd", type: "TURBO", buyin: 11, guaranteed: 1500, priority: "medium", lateReg: 80 },
        { id: 207, date: "2026-01-18", time: "18:00", name: "PartyPoker Tour Sheffield Mini Main Event Sat", type: "OTHER", buyin: 5, guaranteed: 3750, priority: "high", lateReg: 80 },
        { id: 208, date: "2026-01-18", time: "18:00", name: "MILLIONS Online Main Event Day 1A Sat", type: "SAT", buyin: 11, guaranteed: 6400, priority: "high", lateReg: 80 },
        { id: 209, date: "2026-01-18", time: "18:05", name: "Daily Legends 7-Max Early Mystery Turbo: $10K Gtd", type: "TURBO", buyin: 22, guaranteed: 10000, priority: "high", lateReg: 80 },
        { id: 210, date: "2026-01-18", time: "18:05", name: "PartyPoker Tour Sheffield High Roller Sat", type: "OTHER", buyin: 25, guaranteed: 3000, priority: "high", lateReg: 80 },
        { id: 211, date: "2026-01-18", time: "18:05", name: "Daily Legends 7-Max Early Mystery Turbo: $3K Gtd", type: "TURBO", buyin: 5.5, guaranteed: 3000, priority: "medium", lateReg: 80 },
        { id: 212, date: "2026-01-18", time: "18:30", name: "Daily Legends 6-Max Deepstack: $3K Gtd", type: "REG", buyin: 33, guaranteed: 3000, priority: "high", lateReg: 96 },
        { id: 213, date: "2026-01-18", time: "19:05", name: "Daily Legends 6-Max PKO Turbo: $2.5K Gtd", type: "REG KO", buyin: 11, guaranteed: 2500, priority: "high", lateReg: 80 },
        { id: 214, date: "2026-01-18", time: "19:05", name: "Daily Legends 6-Max PKO Turbo: $6K Gtd", type: "REG KO", buyin: 55, guaranteed: 6000, priority: "high", lateReg: 80 },
        { id: 215, date: "2026-01-19", time: "20:05", name: "Daily Legends 6-Max Deepstack Hyper: $4K Gtd", type: "HYPER", buyin: 55, guaranteed: 4000, priority: "low", lateReg: 96 },
        { id: 216, date: "2026-01-19", time: "21:05", name: "The Super $109: $6,000 Gtd", type: "REG", buyin: 109, guaranteed: 6000, priority: "medium", lateReg: 80 },
        { id: 217, date: "2026-01-19", time: "21:05", name: "The Super $5.50: $2,000 Gtd", type: "REG", buyin: 5.5, guaranteed: 2000, priority: "medium", lateReg: 80 },
        { id: 218, date: "2026-01-19", time: "21:05", name: "The Super $22: $3,000 Gtd", type: "REG", buyin: 22, guaranteed: 3000, priority: "medium", lateReg: 80 },
        { id: 219, date: "2026-01-19", time: "22:05", name: "Daily Legends 7-Max PKO: $1K Gtd", type: "REG KO", buyin: 33, guaranteed: 1000, priority: "high", lateReg: 80 },
        { id: 220, date: "2026-01-19", time: "06:05", name: "Daily Legends 8-Max PKO: $1.5K Gtd", type: "REG KO", buyin: 33, guaranteed: 1500, priority: "high", lateReg: 80 },
        { id: 221, date: "2026-01-19", time: "07:30", name: "Daily Legends 7-Max Early Mystery Turbo: $1K Gtd", type: "TURBO", buyin: 11, guaranteed: 1000, priority: "medium", lateReg: 80 },
        { id: 222, date: "2026-01-19", time: "08:30", name: "Daily Legends 6-Max Deepstack Turbo: $1K Gtd", type: "TURBO", buyin: 22, guaranteed: 1000, priority: "medium", lateReg: 60 },
        { id: 223, date: "2026-01-19", time: "11:05", name: "Daily Legends 7-Max PKO: $1.5K Gtd", type: "REG KO", buyin: 5.5, guaranteed: 1500, priority: "high", lateReg: 80 },
        { id: 224, date: "2026-01-19", time: "11:05", name: "Daily Legends 7-Max PKO: $3K Gtd", type: "REG KO", buyin: 33, guaranteed: 3000, priority: "high", lateReg: 80 },
        { id: 225, date: "2026-01-19", time: "12:30", name: "Daily Legends 8-Max Deepstack: $3K Gtd", type: "REG", buyin: 11, guaranteed: 3000, priority: "high", lateReg: 96 },
        { id: 226, date: "2026-01-19", time: "13:05", name: "Daily Legends 6-Max Mystery Bounty: $5K Gtd", type: "REG KO", buyin: 22, guaranteed: 5000, priority: "high", lateReg: 80 },
        { id: 227, date: "2026-01-19", time: "14:05", name: "Daily Legends Terminator: $6K Gtd", type: "REG", buyin: 11, guaranteed: 6000, priority: "high", lateReg: 80 },
        { id: 228, date: "2026-01-19", time: "14:30", name: "Daily Legends 7-Max: $3K Gtd", type: "REG", buyin: 11, guaranteed: 3000, priority: "high", lateReg: 80 },
        { id: 229, date: "2026-01-19", time: "14:30", name: "Daily Legends Masters: $3K Gtd", type: "REG", buyin: 55, guaranteed: 3000, priority: "high", lateReg: 80 },
        { id: 230, date: "2026-01-19", time: "15:05", name: "Daily Legends Centurion: $5K Gtd", type: "REG", buyin: 109, guaranteed: 5000, priority: "high", lateReg: 80 },
        { id: 231, date: "2026-01-19", time: "15:05", name: "Daily Legends Predator: $10K Gtd", type: "REG", buyin: 22, guaranteed: 10000, priority: "high", lateReg: 80 },
        { id: 232, date: "2026-01-19", time: "15:05", name: "Daily Legends Headhunter: $3K Gtd", type: "REG", buyin: 5.5, guaranteed: 3000, priority: "high", lateReg: 80 },
        { id: 233, date: "2026-01-19", time: "15:30", name: "Daily Legends 8-Max: $1K Gtd", type: "REG", buyin: 5.5, guaranteed: 1000, priority: "high", lateReg: 80 },
        { id: 234, date: "2026-01-19", time: "15:30", name: "Daily Legends Clásico: $4K Gtd", type: "REG", buyin: 22, guaranteed: 4000, priority: "high", lateReg: 80 },
        { id: 235, date: "2026-01-19", time: "16:05", name: "The Super $320: $10,000 Gtd", type: "REG", buyin: 320, guaranteed: 10000, priority: "high", lateReg: 80 },
        { id: 236, date: "2026-01-19", time: "16:05", name: "The Super $55: $20,000 Gtd", type: "REG", buyin: 55, guaranteed: 20000, priority: "high", lateReg: 80 },
        { id: 237, date: "2026-01-19", time: "16:05", name: "The Super $11: $10,000 Gtd", type: "REG", buyin: 11, guaranteed: 10000, priority: "high", lateReg: 80 },
        { id: 238, date: "2026-01-19", time: "17:05", name: "Daily Legends Gladiator: $6K Gtd", type: "REG", buyin: 33, guaranteed: 6000, priority: "high", lateReg: 80 },
        { id: 239, date: "2026-01-19", time: "17:30", name: "Daily Legends 6-Max Turbo: $1.5K Gtd", type: "TURBO", buyin: 11, guaranteed: 1500, priority: "medium", lateReg: 80 },
        { id: 240, date: "2026-01-19", time: "18:05", name: "Daily Legends 7-Max Early Mystery Turbo: $7.5K Gtd", type: "TURBO", buyin: 22, guaranteed: 7500, priority: "medium", lateReg: 80 },
        { id: 241, date: "2026-01-19", time: "18:05", name: "Daily Legends 7-Max Early Mystery Turbo: $3K Gtd", type: "TURBO", buyin: 5.5, guaranteed: 3000, priority: "medium", lateReg: 80 },
        { id: 242, date: "2026-01-19", time: "18:30", name: "Daily Legends 6-Max Deepstack: $3K Gtd", type: "REG", buyin: 33, guaranteed: 3000, priority: "high", lateReg: 96 },
        { id: 243, date: "2026-01-19", time: "19:05", name: "Daily Legends 6-Max PKO Turbo: $2K Gtd", type: "TURBO KO", buyin: 11, guaranteed: 2000, priority: "high", lateReg: 80 },
        { id: 244, date: "2026-01-19", time: "19:05", name: "Daily Legends 6-Max PKO Turbo: $4K Gtd", type: "TURBO KO", buyin: 55, guaranteed: 4000, priority: "high", lateReg: 80 },
        { id: 245, date: "2026-01-20", time: "20:05", name: "Daily Legends 6-Max Deepstack Hyper: $2K Gtd", type: "HYPER", buyin: 55, guaranteed: 2000, priority: "low", lateReg: 96 },
        { id: 246, date: "2026-01-20", time: "21:05", name: "The Super $22: $3,000 Gtd", type: "REG", buyin: 22, guaranteed: 3000, priority: "medium", lateReg: 80 },
        { id: 247, date: "2026-01-20", time: "21:05", name: "The Super $5.50: $2,000 Gtd", type: "REG", buyin: 5.5, guaranteed: 2000, priority: "medium", lateReg: 80 },
        { id: 248, date: "2026-01-20", time: "21:05", name: "The Super $109: $5,000 Gtd", type: "REG", buyin: 109, guaranteed: 5000, priority: "medium", lateReg: 80 },
        { id: 249, date: "2026-01-20", time: "22:05", name: "Daily Legends 7-Max PKO: $1K Gtd", type: "REG KO", buyin: 33, guaranteed: 1000, priority: "high", lateReg: 80 },
      ],
    };
    // ✅ Adicionar Main Event Series (fixos, com datas)
    partypokerConfig.mainSeries.forEach(tournament => {
      tournaments.push({
        id: tournament.id,
        date: tournament.date,
        time: tournament.time,
        site: "Partypoker",
        name: tournament.name,
        type: tournament.type,
        buyin: tournament.buyin,
        guaranteed: tournament.guaranteed,
        priority: tournament.priority,
        status: "Aberto",
        lateReg: tournament.lateReg || LATE_REG_DEFAULTS[tournament.type] || 30,
      });
    });
    return tournaments;
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

  res.json(tournaments);
}
