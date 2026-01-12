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
        { id: 26, date: "2026-01-08", time: "15:00", name: "#26-A: $10 Speed Racer Bounty WINTER HOUR", type: "TURBO KO", buyin: 10, guaranteed: 40000, priority: "low", lateReg: 20 },
        { id: 27, date: "2026-01-09", time: "15:00", name: "#27: $15 Friday Freezeout", type: "REG", buyin: 15, guaranteed: 100000, priority: "very-high", lateReg: 60 },
        { id: 28, date: "2026-01-10", time: "15:00", name: "#28: $215 Omaholic Deepstack Turbo", type: "TURBO", buyin: 215, guaranteed: 100000, priority: "low", lateReg: 30 },
        { id: 45, date: "2026-01-27", time: "15:00", name: "#45: $50 Winter Super Saver [Hyper]", type: "TURBO", buyin: 50, guaranteed: 150000, priority: "low", lateReg: 15 },
        { id: 29, date: "2026-01-11", time: "15:00", name: "#29: $77 Holiday Lucky Sevens [7-Max]", type: "REG", buyin: 77, guaranteed: 400000, priority: "medium", lateReg: 60 },
        { id: 30, date: "2026-01-12", time: "15:00", name: "#30: $54 Lucky Fortune Mystery Bounty [Day 2]", type: "MYSTERY", buyin: 54, guaranteed: 3000000, priority: "medium", lateReg: 45 },
      ],
      
      // ✅ GGMasters (REG) - 3 torneios com tempos diferentes
      ggmasters: [
        { time: "11:00", name: "GGMasters Asia", type: "REG", buyin: 25, guaranteed: 40000, priority: "medium", lateReg: 60 },
        { time: "13:00", name: "GGMasters Double Stack", type: "REG", buyin: 25, guaranteed: 40000, priority: "medium", lateReg: 90 },
        { time: "17:00", name: "GGMasters Classic", type: "REG", buyin: 25, guaranteed: 50000, priority: "medium", lateReg: 60 },
      ],

      // ✅ GGMasters Bounty (REG KO) - 3 torneios com tempos diferentes
      ggmastersBounty: [
        { time: "15:00", name: "GGMasters Bounty Warm-up", type: "REG KO", buyin: 25, guaranteed: 100000, priority: "medium", lateReg: 45 },
        { time: "19:00", name: "GGMasters Bounty", type: "REG KO", buyin: 25, guaranteed: 50000, priority: "medium", lateReg: 60 },
        { time: "21:00", name: "GGMasters Bounty Turbo", type: "REG KO", buyin: 25, guaranteed: 40000, priority: "medium", lateReg: 20 },
      ],

      // ✅ Turbo diários
      turboDailies: [
        { time: "00:15", name: "Daily Turbo $10", buyin: 10, guaranteed: 600, lateReg: 20 },
        { time: "00:15", name: "Daily Turbo $50", buyin: 50, guaranteed: 750, lateReg: 20 },
        { time: "00:15", name: "Daily Turbo $2", buyin: 2, guaranteed: 300, lateReg: 20 },
        { time: "01:15", name: "Daily Turbo $1", buyin: 1, guaranteed: 300, lateReg: 20 },
        { time: "01:15", name: "Daily Turbo $20", buyin: 20, guaranteed: 500, lateReg: 20 },
      ],

      // ✅ Hyper diários
      hyperDailies: [
        { time: "20:45", name: "Daily Hyper $20", buyin: 20, guaranteed: 750, lateReg: 15 },
        { time: "20:45", name: "Daily Hyper $5", buyin: 5, guaranteed: 1500, lateReg: 15 },
        { time: "20:45", name: "Daily Hyper $80", buyin: 80, guaranteed: 3000, lateReg: 15 },
        { time: "23:45", name: "Daily Hyper $100", buyin: 100, guaranteed: 2000, lateReg: 15 },
        { time: "23:45", name: "Daily Hyper $30", buyin: 30, guaranteed: 2500, lateReg: 15 },
      ],
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
