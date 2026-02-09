export const getTournaments = async () => {
  
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

  function generateDatesForFebruary() {
    const dates = [];
    const startDate = new Date(2026, 1, 4);
    const endDate = new Date(2026, 1, 28);
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }
    return dates;
  }

  const tournaments = [];
  const dates = generateDatesForFebruary();
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
        { id: 44, date: "2026-01-13", time: "09:30", name: "$25 Bounty Snowstorm Deepstack Turbo", type: "REG KO", buyin: 25, guaranteed: 50000, priority: "medium", lateReg: 150 }, 
        { id: 313, date: "2026-01-26", time: "11:00", name: "$54 Bounty Fifty Stack", type: "REG KO", buyin: 54, guaranteed: 75000, priority: "medium", lateReg: 150 },

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
      // ✅ Bountys diarios
      bountyhunterdailies: [
        { id: 1, time: "22:10", name: "Speed Racer Bounty $1.08 [10 BB]", buyin: 1.08, guaranteed: 400, type: "speed_racer", lateReg: 20 },
        { id: 2, time: "22:10", name: "Speed Racer Bounty $32 [10 BB]", buyin: 32, guaranteed: 7000, type: "speed_racer", lateReg: 20 },
        { id: 3, time: "22:10", name: "Speed Racer Bounty $5.40 [10 BB]", buyin: 5.40, guaranteed: 2000, type: "speed_racer", lateReg: 20 },
        { id: 4, time: "22:30", name: "Bounty Hunters $2.50", buyin: 2.50, guaranteed: 1000, type: "bounty_hunter", lateReg: 90 },
        { id: 5, time: "22:30", name: "Bounty Hunters $21.60", buyin: 21.60, guaranteed: 750, type: "bounty_hunter", lateReg: 90 },
        { id: 6, time: "22:30", name: "Bounty Hunters Big Game $108", buyin: 108, guaranteed: 25000, type: "bounty_hunter", lateReg: 90 },
        { id: 7, time: "22:30", name: "Bounty Hunters Mini Big Game $10.80", buyin: 10.80, guaranteed: 12500, type: "bounty_hunter", lateReg: 90 },
        { id: 8, time: "22:45", name: "Bounty Hunters Hyper Special $21.60", buyin: 21.60, guaranteed: 7500, type: "bounty_hunter_hyper", lateReg: 75 },
        { id: 9, time: "23:10", name: "Speed Racer Bounty $10.80 [10 BB]", buyin: 10.80, guaranteed: 3000, type: "speed_racer", lateReg: 20 },
        { id: 10, time: "23:10", name: "Speed Racer Bounty $88 [10 BB]", buyin: 88, guaranteed: 5000, type: "speed_racer", lateReg: 20 },
        { id: 11, time: "23:15", name: "Bounty Hunters Deepstack Turbo $5.40", buyin: 5.40, guaranteed: 4500, type: "bounty_hunter", lateReg: 90 },
        { id: 12, time: "23:15", name: "Bounty Hunters Deepstack Turbo $54", buyin: 54, guaranteed: 15000, type: "bounty_hunter", lateReg: 90 },
        { id: 13, time: "23:30", name: "Bounty Hunters $5.40", buyin: 5.40, guaranteed: 600, type: "bounty_hunter", lateReg: 90 },
        { id: 14, time: "23:30", name: "Bounty Hunters $54", buyin: 54, guaranteed: 600, type: "bounty_hunter", lateReg: 90 },
        { id: 15, time: "23:30", name: "Bounty Hunters Special $10.80 [6-Max]", buyin: 10.80, guaranteed: 7500, type: "bounty_hunter_special", lateReg: 135 },
        { id: 16, time: "23:30", name: "Bounty Hunters Special $108 [6-Max]", buyin: 108, guaranteed: 6000, type: "bounty_hunter_special", lateReg: 135 },
        { id: 17, time: "23:30", name: "Bounty Hunters Special $2.50 [6-Max]", buyin: 2.50, guaranteed: 2000, type: "bounty_hunter_special", lateReg: 135 },
        { id: 18, time: "23:35", name: "Bounty Hunters Special $3.20", buyin: 3.20, guaranteed: 2250, type: "bounty_hunter_special", lateReg: 135 },
        { id: 19, time: "23:45", name: "Bounty Hunters Hyper Special $15", buyin: 15, guaranteed: 6000, type: "bounty_hunter_hyper", lateReg: 75 },
        { id: 20, time: "00:10", name: "Speed Racer Bounty $3.20 [10 BB]", buyin: 3.20, guaranteed: 1250, type: "speed_racer", lateReg: 20 },
        { id: 21, time: "00:10", name: "Speed Racer Bounty $32 [10 BB]", buyin: 32, guaranteed: 3500, type: "speed_racer", lateReg: 20 },
        { id: 22, time: "00:10", name: "Speed Racer Bounty Closer $108 [10 BB]", buyin: 108, guaranteed: 4000, type: "speed_racer", lateReg: 20 },
        { id: 23, time: "00:30", name: "Bounty Hunters $1.08", buyin: 1.08, guaranteed: 400, type: "bounty_hunter", lateReg: 90 },
        { id: 24, time: "00:30", name: "Bounty Hunters $10.80", buyin: 10.80, guaranteed: 1000, type: "bounty_hunter", lateReg: 90 },
        { id: 25, time: "00:30", name: "Bounty Hunters Turbo Special $2.50", buyin: 2.50, guaranteed: 2000, type: "bounty_hunter_special", lateReg: 135 },
        { id: 26, time: "00:30", name: "Bounty Hunters Turbo Special $21.60", buyin: 21.60, guaranteed: 6500, type: "bounty_hunter_special", lateReg: 135 },
        { id: 27, time: "00:30", name: "Bounty Hunters Turbo Special $215", buyin: 215, guaranteed: 6000, type: "bounty_hunter_special", lateReg: 135 },
        { id: 28, time: "00:45", name: "Bounty Hunters Hyper Special $32", buyin: 32, guaranteed: 7500, type: "bounty_hunter_hyper", lateReg: 75 },
        { id: 29, time: "01:10", name: "Speed Racer Bounty $5.40 [10 BB]", buyin: 5.40, guaranteed: 1750, type: "speed_racer", lateReg: 20 },
        { id: 30, time: "01:10", name: "Speed Racer Bounty $54 [10 BB]", buyin: 54, guaranteed: 3000, type: "speed_racer", lateReg: 20 },
        { id: 31, time: "01:15", name: "Bounty Hunters Deepstack Turbo $8.88", buyin: 8.88, guaranteed: 6500, type: "bounty_hunter", lateReg: 90 },
        { id: 32, time: "01:15", name: "Bounty Hunters Deepstack Turbo $88", buyin: 88, guaranteed: 7000, type: "bounty_hunter", lateReg: 90 },
        { id: 33, time: "01:30", name: "Bounty Hunters $2.50", buyin: 2.50, guaranteed: 750, type: "bounty_hunter", lateReg: 90 },
        { id: 34, time: "01:30", name: "Bounty Hunters $21.60", buyin: 21.60, guaranteed: 750, type: "bounty_hunter", lateReg: 90 },
        { id: 35, time: "01:30", name: "Bounty Hunters Special $5.40", buyin: 5.40, guaranteed: 4000, type: "bounty_hunter_special", lateReg: 135 },
        { id: 36, time: "01:30", name: "Bounty Hunters Special $54", buyin: 54, guaranteed: 15000, type: "bounty_hunter_special", lateReg: 135 },
        { id: 37, time: "02:10", name: "Speed Racer Bounty $10.80 [10 BB]", buyin: 10.80, guaranteed: 2500, type: "speed_racer", lateReg: 20 },
        { id: 38, time: "02:10", name: "Speed Racer Bounty $2.50 [10 BB]", buyin: 2.50, guaranteed: 1000, type: "speed_racer", lateReg: 20 },
        { id: 39, time: "02:10", name: "Speed Racer Bounty $32 [10 BB]", buyin: 32, guaranteed: 2500, type: "speed_racer", lateReg: 20 },
        { id: 40, time: "02:30", name: "Bounty Hunters $1.08", buyin: 1.08, guaranteed: 600, type: "bounty_hunter", lateReg: 90 },
        { id: 41, time: "02:30", name: "Bounty Hunters $10.80", buyin: 10.80, guaranteed: 1000, type: "bounty_hunter", lateReg: 90 },
        { id: 42, time: "02:30", name: "Bounty Hunters Special $108", buyin: 108, guaranteed: 5000, type: "bounty_hunter_special", lateReg: 135 },
        { id: 43, time: "02:30", name: "Bounty Hunters Special $32", buyin: 32, guaranteed: 15000, type: "bounty_hunter_special", lateReg: 135 },
        { id: 44, time: "02:31", name: "Bounty Hunters Daily Double $3.20", buyin: 3.20, guaranteed: 3000, type: "bounty_hunter", lateReg: 90 },
        { id: 45, time: "02:32", name: "Bounty Hunters Daily Double II $3.20", buyin: 3.20, guaranteed: 1500, type: "bounty_hunter", lateReg: 90 },
        { id: 46, time: "03:10", name: "Speed Racer Bounty $3.20 [10 BB]", buyin: 3.20, guaranteed: 1500, type: "speed_racer", lateReg: 20 },
        { id: 47, time: "03:10", name: "Speed Racer Bounty $32 [10 BB]", buyin: 32, guaranteed: 2500, type: "speed_racer", lateReg: 20 },
        { id: 48, time: "03:15", name: "Bounty Hunters Turbo Special $2.50 [6-Max]", buyin: 2.50, guaranteed: 2000, type: "bounty_hunter_special", lateReg: 135 },
        { id: 49, time: "03:15", name: "Bounty Hunters Turbo Special $21.60 [6-Max]", buyin: 21.60, guaranteed: 6500, type: "bounty_hunter_special", lateReg: 135 },
        { id: 50, time: "03:30", name: "Bounty Hunters $2.50", buyin: 2.50, guaranteed: 600, type: "bounty_hunter", lateReg: 90 },
        { id: 51, time: "03:30", name: "Bounty Hunters $21.60", buyin: 21.60, guaranteed: 750, type: "bounty_hunter", lateReg: 90 },
        { id: 52, time: "03:30", name: "Bounty Hunters Special $8.88", buyin: 8.88, guaranteed: 7000, type: "bounty_hunter_special", lateReg: 135 },
        { id: 53, time: "03:30", name: "Bounty Hunters Special $88", buyin: 88, guaranteed: 8500, type: "bounty_hunter_special", lateReg: 135 },
        { id: 54, time: "04:10", name: "Speed Racer Bounty $2.50 [10 BB]", buyin: 2.50, guaranteed: 1250, type: "speed_racer", lateReg: 20 },
        { id: 55, time: "04:10", name: "Speed Racer Bounty $21.60 [10 BB]", buyin: 21.60, guaranteed: 2500, type: "speed_racer", lateReg: 20 },
        { id: 56, time: "04:30", name: "Bounty Hunters $3.20", buyin: 3.20, guaranteed: 1250, type: "bounty_hunter", lateReg: 90 },
        { id: 57, time: "04:30", name: "Bounty Hunters $32", buyin: 32, guaranteed: 1000, type: "bounty_hunter", lateReg: 90 },
        { id: 58, time: "04:30", name: "Bounty Hunters Special $108", buyin: 108, guaranteed: 6000, type: "bounty_hunter_special", lateReg: 135 },
        { id: 59, time: "04:31", name: "Bounty Hunters Daily Double $10.80", buyin: 10.80, guaranteed: 15000, type: "bounty_hunter", lateReg: 90 },
        { id: 60, time: "04:32", name: "Bounty Hunters Daily Double II $10.80", buyin: 10.80, guaranteed: 6000, type: "bounty_hunter", lateReg: 90 },
        { id: 61, time: "04:45", name: "Bounty Hunters Hyper Special $5.40", buyin: 5.40, guaranteed: 4000, type: "bounty_hunter_hyper", lateReg: 75 },
        { id: 62, time: "04:45", name: "Bounty Hunters Hyper Special $54", buyin: 54, guaranteed: 7500, type: "bounty_hunter_hyper", lateReg: 75 },
        { id: 63, time: "05:10", name: "Speed Racer Bounty $32 [10 BB]", buyin: 32, guaranteed: 3000, type: "speed_racer", lateReg: 20 },
        { id: 64, time: "05:10", name: "Speed Racer Bounty $5.40 [10 BB]", buyin: 5.40, guaranteed: 2250, type: "speed_racer", lateReg: 20 },
        { id: 65, time: "05:30", name: "Bounty Hunters $2.50", buyin: 2.50, guaranteed: 1000, type: "bounty_hunter", lateReg: 90 },
        { id: 66, time: "05:30", name: "Bounty Hunters $21.60", buyin: 21.60, guaranteed: 1250, type: "bounty_hunter", lateReg: 90 },
        { id: 67, time: "05:30", name: "Bounty Hunters Special $1.08", buyin: 1.08, guaranteed: 2000, type: "bounty_hunter_special", lateReg: 135 },
        { id: 68, time: "05:30", name: "Bounty Hunters Special $5.40", buyin: 5.40, guaranteed: 7500, type: "bounty_hunter_special", lateReg: 135 },
        { id: 69, time: "05:30", name: "Bounty Hunters Special $54", buyin: 54, guaranteed: 20000, type: "bounty_hunter_special", lateReg: 135 },
        { id: 70, time: "06:10", name: "Speed Racer Bounty $2.50 [10 BB]", buyin: 2.50, guaranteed: 1500, type: "speed_racer", lateReg: 20 },
        { id: 71, time: "06:10", name: "Speed Racer Bounty $21.60 [10 BB]", buyin: 21.60, guaranteed: 4000, type: "speed_racer", lateReg: 20 },
        { id: 72, time: "06:30", name: "Bounty Hunters $1.08", buyin: 1.08, guaranteed: 500, type: "bounty_hunter", lateReg: 90 },
        { id: 73, time: "06:30", name: "Bounty Hunters $10.80", buyin: 10.80, guaranteed: 2000, type: "bounty_hunter", lateReg: 90 },
        { id: 74, time: "06:30", name: "Bounty Hunters Special $215", buyin: 215, guaranteed: 7500, type: "bounty_hunter_special", lateReg: 135 },
        { id: 75, time: "06:30", name: "Bounty Hunters Special $3.20", buyin: 3.20, guaranteed: 5000, type: "bounty_hunter_special", lateReg: 135 },
        { id: 76, time: "06:30", name: "Bounty Hunters Special $32", buyin: 32, guaranteed: 20000, type: "bounty_hunter_special", lateReg: 135 },
        { id: 77, time: "06:45", name: "Bounty Hunters Hyper Special $2.50", buyin: 2.50, guaranteed: 2000, type: "bounty_hunter_hyper", lateReg: 75 },
        { id: 78, time: "06:45", name: "Bounty Hunters Hyper Special $21.60", buyin: 21.60, guaranteed: 8000, type: "bounty_hunter_hyper", lateReg: 75 },
        { id: 79, time: "07:10", name: "Speed Racer Bounty $1.08 [10 BB]", buyin: 1.08, guaranteed: 600, type: "speed_racer", lateReg: 20 },
        { id: 80, time: "07:10", name: "Speed Racer Bounty $5.40 [10 BB]", buyin: 5.40, guaranteed: 2500, type: "speed_racer", lateReg: 20 },
        { id: 81, time: "07:10", name: "Speed Racer Bounty $54 [10 BB]", buyin: 54, guaranteed: 5000, type: "speed_racer", lateReg: 20 },
        { id: 82, time: "07:30", name: "Bounty Hunters $2.50", buyin: 2.50, guaranteed: 1000, type: "bounty_hunter", lateReg: 90 },
        { id: 83, time: "07:30", name: "Bounty Hunters $21.60", buyin: 21.60, guaranteed: 1750, type: "bounty_hunter", lateReg: 90 },
        { id: 84, time: "07:30", name: "Bounty Hunters Big One $1.08", buyin: 1.08, guaranteed: 2500, type: "bounty_hunter", lateReg: 90 },
        { id: 85, time: "07:30", name: "Bounty Hunters Special $10.80", buyin: 10.80, guaranteed: 20000, type: "bounty_hunter_special", lateReg: 135 },
        { id: 86, time: "07:30", name: "Bounty Hunters Special $108", buyin: 108, guaranteed: 10000, type: "bounty_hunter_special", lateReg: 135 },
        { id: 87, time: "08:10", name: "Speed Racer Bounty $3.20 [10 BB]", buyin: 3.20, guaranteed: 2000, type: "speed_racer", lateReg: 20 },
        { id: 88, time: "08:10", name: "Speed Racer Bounty $32 [10 BB]", buyin: 32, guaranteed: 5000, type: "speed_racer", lateReg: 20 },
        { id: 89, time: "08:30", name: "Bounty Hunters $5.40", buyin: 5.40, guaranteed: 2500, type: "bounty_hunter", lateReg: 90 },
        { id: 90, time: "08:30", name: "Bounty Hunters $54", buyin: 54, guaranteed: 1000, type: "bounty_hunter", lateReg: 90 },
        { id: 91, time: "08:30", name: "Bounty Hunters Special $88", buyin: 88, guaranteed: 12500, type: "bounty_hunter_special", lateReg: 135 },
        { id: 92, time: "08:31", name: "Bounty Hunters Daily Double $8.88", buyin: 8.88, guaranteed: 10000, type: "bounty_hunter", lateReg: 90 },
        { id: 93, time: "08:32", name: "Bounty Hunters Daily Double II $8.88", buyin: 8.88, guaranteed: 5000, type: "bounty_hunter", lateReg: 90 },
        { id: 94, time: "08:45", name: "Bounty Hunters Hyper Special $3.20", buyin: 3.20, guaranteed: 3500, type: "bounty_hunter_hyper", lateReg: 75 },
        { id: 95, time: "08:45", name: "Bounty Hunters Hyper Special $32", buyin: 32, guaranteed: 10000, type: "bounty_hunter_hyper", lateReg: 75 },
        { id: 96, time: "09:10", name: "Speed Racer Bounty $5.40 [10 BB]", buyin: 5.40, guaranteed: 3000, type: "speed_racer", lateReg: 20 },
        { id: 97, time: "09:10", name: "Speed Racer Bounty $54 [10 BB]", buyin: 54, guaranteed: 5000, type: "speed_racer", lateReg: 20 },
        { id: 98, time: "09:15", name: "Bounty Hunters Deepstack Turbo $10.80", buyin: 10.80, guaranteed: 10000, type: "bounty_hunter", lateReg: 90 },
        { id: 99, time: "09:15", name: "Bounty Hunters Deepstack Turbo $3.20", buyin: 3.20, guaranteed: 6500, type: "bounty_hunter", lateReg: 90 },
        { id: 100, time: "09:15", name: "Bounty Hunters Deepstack Turbo $32", buyin: 32, guaranteed: 15000, type: "bounty_hunter", lateReg: 90 },
        { id: 101, time: "09:30", name: "Bounty Hunters $3.20", buyin: 3.20, guaranteed: 1250, type: "bounty_hunter", lateReg: 90 },
        { id: 102, time: "09:30", name: "Bounty Hunters $32", buyin: 32, guaranteed: 1250, type: "bounty_hunter", lateReg: 90 },
        { id: 103, time: "09:30", name: "Bounty Hunters Special $10.80 [7-Max]", buyin: 10.80, guaranteed: 20000, type: "bounty_hunter_special", lateReg: 135 },
        { id: 104, time: "09:30", name: "Bounty Hunters Special $108 [7-Max]", buyin: 108, guaranteed: 7500, type: "bounty_hunter_special", lateReg: 135 },
        { id: 105, time: "09:30", name: "Bounty Hunters Special $2.50 [7-Max]", buyin: 2.50, guaranteed: 4000, type: "bounty_hunter_special", lateReg: 135 },
        { id: 106, time: "10:10", name: "Speed Racer Bounty $2.50 [10 BB]", buyin: 2.50, guaranteed: 2000, type: "speed_racer", lateReg: 20 },
        { id: 107, time: "10:10", name: "Speed Racer Bounty $32 [10 BB]", buyin: 32, guaranteed: 5000, type: "speed_racer", lateReg: 20 },
        { id: 108, time: "10:15", name: "Bounty Hunters Deepstack Turbo $8.88", buyin: 8.88, guaranteed: 15000, type: "bounty_hunter", lateReg: 90 },
        { id: 109, time: "10:15", name: "Bounty Hunters Deepstack Turbo $88", buyin: 88, guaranteed: 15000, type: "bounty_hunter", lateReg: 90 },
        { id: 110, time: "10:30", name: "Bounty Hunters $5.40", buyin: 5.40, guaranteed: 3000, type: "bounty_hunter", lateReg: 90 },
        { id: 111, time: "10:30", name: "Bounty Hunters $54", buyin: 54, guaranteed: 1250, type: "bounty_hunter", lateReg: 90 },
        { id: 112, time: "10:30", name: "Bounty Hunters Special $2.50", buyin: 2.50, guaranteed: 6000, type: "bounty_hunter_special", lateReg: 135 },
        { id: 113, time: "10:30", name: "Bounty Hunters Special $21.60", buyin: 21.60, guaranteed: 25000, type: "bounty_hunter_special", lateReg: 135 },
        { id: 114, time: "10:30", name: "Bounty Hunters Special $215", buyin: 215, guaranteed: 10000, type: "bounty_hunter_special", lateReg: 135 },
        { id: 115, time: "11:10", name: "Speed Racer Bounty $5.40 [10 BB]", buyin: 5.40, guaranteed: 4000, type: "speed_racer", lateReg: 20 },
        { id: 116, time: "11:10", name: "Speed Racer Bounty $54 [10 BB]", buyin: 54, guaranteed: 10000, type: "speed_racer", lateReg: 20 },
        { id: 117, time: "11:15", name: "Bounty Hunters Deepstack Turbo $5.40", buyin: 5.40, guaranteed: 15000, type: "bounty_hunter", lateReg: 90 },
        { id: 118, time: "11:15", name: "Bounty Hunters Deepstack Turbo $54", buyin: 54, guaranteed: 40000, type: "bounty_hunter", lateReg: 90 },
        { id: 119, time: "11:30", name: "Bounty Hunters $3.20", buyin: 3.20, guaranteed: 2500, type: "bounty_hunter", lateReg: 90 },
        { id: 120, time: "11:30", name: "Bounty Hunters $32", buyin: 32, guaranteed: 2000, type: "bounty_hunter", lateReg: 90 },
        { id: 121, time: "11:30", name: "Bounty Hunters Special $108", buyin: 108, guaranteed: 7500, type: "bounty_hunter_special", lateReg: 135 },
        { id: 122, time: "11:31", name: "Bounty Hunters Daily Double $10.80", buyin: 10.80, guaranteed: 25000, type: "bounty_hunter", lateReg: 90 },
        { id: 123, time: "11:32", name: "Bounty Hunters Daily Double II $10.80", buyin: 10.80, guaranteed: 10000, type: "bounty_hunter", lateReg: 90 },
        { id: 124, time: "12:05", name: "Bounty Hunters Fifty Stack $5.40", buyin: 5.40, guaranteed: 20000, type: "bounty_hunter", lateReg: 90 },
        { id: 125, time: "12:05", name: "Bounty Hunters Fifty Stack $54", buyin: 54, guaranteed: 50000, type: "bounty_hunter", lateReg: 90 },
        { id: 126, time: "12:10", name: "Speed Racer Bounty $2.50 [10 BB]", buyin: 2.50, guaranteed: 2500, type: "speed_racer", lateReg: 20 },
        { id: 127, time: "12:10", name: "Speed Racer Bounty $21.60 [10 BB]", buyin: 21.60, guaranteed: 7000, type: "speed_racer", lateReg: 20 },
        { id: 128, time: "12:10", name: "Speed Racer Bounty Asia $88 [10 BB]", buyin: 88, guaranteed: 7500, type: "speed_racer", lateReg: 20 },
        { id: 129, time: "12:15", name: "Bounty Hunters Deepstack Turbo $3.20", buyin: 3.20, guaranteed: 10000, type: "bounty_hunter", lateReg: 90 },
        { id: 130, time: "12:15", name: "Bounty Hunters Deepstack Turbo $32", buyin: 32, guaranteed: 30000, type: "bounty_hunter", lateReg: 90 },
        { id: 131, time: "12:30", name: "Bounty Hunters $2.50", buyin: 2.50, guaranteed: 1500, type: "bounty_hunter", lateReg: 90 },
        { id: 132, time: "12:30", name: "Bounty Hunters $21.60", buyin: 21.60, guaranteed: 3000, type: "bounty_hunter", lateReg: 90 },
        { id: 133, time: "12:30", name: "Bounty Hunters Special $8.88", buyin: 8.88, guaranteed: 15000, type: "bounty_hunter_special", lateReg: 135 },
        { id: 134, time: "12:30", name: "Bounty Hunters Special $88", buyin: 88, guaranteed: 20000, type: "bounty_hunter_special", lateReg: 135 },
        { id: 135, time: "13:10", name: "Speed Racer Bounty $10.80 [10 BB]", buyin: 10.80, guaranteed: 7500, type: "speed_racer", lateReg: 20 },
        { id: 136, time: "13:10", name: "Speed Racer Bounty $88 [10 BB]", buyin: 88, guaranteed: 8000, type: "speed_racer", lateReg: 20 },
        { id: 137, time: "13:15", name: "Bounty Hunters Deepstack Turbo $2.50", buyin: 2.50, guaranteed: 7500, type: "bounty_hunter", lateReg: 90 },
        { id: 138, time: "13:15", name: "Bounty Hunters Deepstack Turbo $21.60", buyin: 21.60, guaranteed: 25000, type: "bounty_hunter", lateReg: 90 },
        { id: 139, time: "13:30", name: "Bounty Hunters $3.20", buyin: 3.20, guaranteed: 2000, type: "bounty_hunter", lateReg: 90 },
        { id: 140, time: "13:30", name: "Bounty Hunters $32", buyin: 32, guaranteed: 1250, type: "bounty_hunter", lateReg: 90 },
        { id: 141, time: "13:30", name: "Bounty Hunters Big One $1.08", buyin: 1.08, guaranteed: 3500, type: "bounty_hunter", lateReg: 90 },
        { id: 142, time: "13:30", name: "Bounty Hunters Special $10.80", buyin: 10.80, guaranteed: 50000, type: "bounty_hunter_special", lateReg: 135 },
        { id: 143, time: "13:30", name: "Bounty Hunters Special $150", buyin: 150, guaranteed: 25000, type: "bounty_hunter_special", lateReg: 135 },
        { id: 144, time: "13:35", name: "Bounty Hunters Forty Stack $44", buyin: 44, guaranteed: 60000, type: "bounty_hunter", lateReg: 90 },
        { id: 145, time: "14:10", name: "Speed Racer Bounty $3.20 [10 BB]", buyin: 3.20, guaranteed: 3000, type: "speed_racer", lateReg: 20 },
        { id: 146, time: "14:10", name: "Speed Racer Bounty $32 [10 BB]", buyin: 32, guaranteed: 7000, type: "speed_racer", lateReg: 20 },
        { id: 147, time: "14:10", name: "Speed Racer Bounty Europe $108 [10 BB]", buyin: 108, guaranteed: 7500, type: "speed_racer", lateReg: 20 },
        { id: 148, time: "14:15", name: "Bounty Hunters Deepstack Turbo $3.20", buyin: 3.20, guaranteed: 10000, type: "bounty_hunter", lateReg: 90 },
        { id: 149, time: "14:15", name: "Bounty Hunters Deepstack Turbo $32", buyin: 32, guaranteed: 20000, type: "bounty_hunter", lateReg: 90 },
        { id: 150, time: "14:30", name: "Bounty Hunters $2.50", buyin: 2.50, guaranteed: 1500, type: "bounty_hunter", lateReg: 90 },
        { id: 151, time: "14:30", name: "Bounty Hunters $21.60", buyin: 21.60, guaranteed: 2500, type: "bounty_hunter", lateReg: 90 },
        { id: 152, time: "14:30", name: "Bounty Hunters Daily Main $54", buyin: 54, guaranteed: 200000, type: "bounty_hunter", lateReg: 90 },
        { id: 153, time: "14:30", name: "Bounty Hunters Mini Main $5.40", buyin: 5.40, guaranteed: 30000, type: "bounty_hunter", lateReg: 90 },
        { id: 154, time: "15:10", name: "Speed Racer Bounty $10.80 [10 BB]", buyin: 10.80, guaranteed: 7000, type: "speed_racer", lateReg: 20 },
        { id: 155, time: "15:10", name: "Speed Racer Bounty $2.50 [10 BB]", buyin: 2.50, guaranteed: 2500, type: "speed_racer", lateReg: 20 },
        { id: 156, time: "15:15", name: "Bounty Hunters Deepstack Turbo $8.88", buyin: 8.88, guaranteed: 15000, type: "bounty_hunter", lateReg: 90 },
        { id: 157, time: "15:15", name: "Bounty Hunters Deepstack Turbo $88", buyin: 88, guaranteed: 15000, type: "bounty_hunter", lateReg: 90 },
        { id: 158, time: "15:30", name: "Bounty Hunters $5.40", buyin: 5.40, guaranteed: 3000, type: "bounty_hunter", lateReg: 90 },
        { id: 159, time: "15:30", name: "Bounty Hunters $54", buyin: 54, guaranteed: 2000, type: "bounty_hunter", lateReg: 90 },
        { id: 160, time: "15:30", name: "Bounty Hunters Big Game $21.60", buyin: 21.60, guaranteed: 60000, type: "bounty_hunter", lateReg: 90 },
        { id: 161, time: "15:30", name: "Bounty Hunters Mini Big Game $2.50", buyin: 2.50, guaranteed: 12500, type: "bounty_hunter", lateReg: 90 },
        { id: 162, time: "15:35", name: "Bounty Hunters Big Game II $21.60", buyin: 21.60, guaranteed: 20000, type: "bounty_hunter", lateReg: 90 },
        { id: 163, time: "15:35", name: "Bounty Hunters Mini Big Game II $2.50", buyin: 2.50, guaranteed: 4000, type: "bounty_hunter", lateReg: 90 },
        { id: 164, time: "16:10", name: "Speed Racer Bounty $108 [10 BB]", buyin: 108, guaranteed: 10000, type: "speed_racer", lateReg: 20 },
        { id: 165, time: "16:10", name: "Speed Racer Bounty $32 [10 BB]", buyin: 32, guaranteed: 7000, type: "speed_racer", lateReg: 20 },
        { id: 166, time: "16:15", name: "Bounty Hunters Deepstack Turbo $5.40", buyin: 5.40, guaranteed: 15000, type: "bounty_hunter", lateReg: 90 },
        { id: 167, time: "16:15", name: "Bounty Hunters Deepstack Turbo $54", buyin: 54, guaranteed: 30000, type: "bounty_hunter", lateReg: 90 },
        { id: 168, time: "16:30", name: "Bounty Hunters $3.20", buyin: 3.20, guaranteed: 1250, type: "bounty_hunter", lateReg: 90 },
        { id: 169, time: "16:30", name: "Bounty Hunters $32", buyin: 32, guaranteed: 1250, type: "bounty_hunter", lateReg: 90 },
        { id: 170, time: "16:30", name: "Bounty Hunters Special $108", buyin: 108, guaranteed: 7500, type: "bounty_hunter_special", lateReg: 135 },
        { id: 171, time: "16:31", name: "Bounty Hunters Daily Double $10.80", buyin: 10.80, guaranteed: 25000, type: "bounty_hunter", lateReg: 90 },
        { id: 172, time: "16:32", name: "Bounty Hunters Daily Double II $10.80", buyin: 10.80, guaranteed: 10000, type: "bounty_hunter", lateReg: 90 },
        { id: 173, time: "17:05", name: "Bounty Hunters Fifty Stack $5.40", buyin: 5.40, guaranteed: 20000, type: "bounty_hunter", lateReg: 90 },
        { id: 174, time: "17:05", name: "Bounty Hunters Fifty Stack $54", buyin: 54, guaranteed: 50000, type: "bounty_hunter", lateReg: 90 },
        { id: 175, time: "17:10", name: "Speed Racer Bounty $5.40 [10 BB]", buyin: 5.40, guaranteed: 6000, type: "speed_racer", lateReg: 20 },
        { id: 176, time: "17:10", name: "Speed Racer Bounty $54 [10 BB]", buyin: 54, guaranteed: 10000, type: "speed_racer", lateReg: 20 },
        { id: 177, time: "17:30", name: "Bounty Hunters $1.08", buyin: 1.08, guaranteed: 700, type: "bounty_hunter", lateReg: 90 },
        { id: 178, time: "17:30", name: "Bounty Hunters $10.80", buyin: 10.80, guaranteed: 2000, type: "bounty_hunter", lateReg: 90 },
        { id: 179, time: "17:30", name: "Bounty Hunters Encore $54", buyin: 54, guaranteed: 25000, type: "bounty_hunter", lateReg: 90 },
        { id: 180, time: "17:30", name: "Bounty Hunters Special $5.40", buyin: 5.40, guaranteed: 6000, type: "bounty_hunter_special", lateReg: 135 },
        { id: 181, time: "17:45", name: "Bounty Hunters Hyper Special $10.80", buyin: 10.80, guaranteed: 10000, type: "bounty_hunter_hyper", lateReg: 75 },
        { id: 182, time: "17:45", name: "Bounty Hunters Hyper Special $108", buyin: 108, guaranteed: 7500, type: "bounty_hunter_hyper", lateReg: 75 },
        { id: 183, time: "19:05", name: "Daily Heater $215 [Bounty Turbo]", buyin: 215, guaranteed: 30000, type: "bounty_hunter_special", lateReg: 135 },
        { id: 184, time: "19:05", name: "Mini Heater $2.50 [Bounty Turbo]", buyin: 2.50, guaranteed: 6000, type: "bounty_hunter_special", lateReg: 135 },
        { id: 185, time: "19:10", name: "Speed Racer Bounty $1.08 [10 BB]", buyin: 1.08, guaranteed: 1000, type: "speed_racer", lateReg: 20 },
        { id: 186, time: "19:10", name: "Speed Racer Bounty $10.80 [10 BB]", buyin: 10.80, guaranteed: 7000, type: "speed_racer", lateReg: 20 },
        { id: 187, time: "19:10", name: "Speed Racer Bounty $108 [10 BB]", buyin: 108, guaranteed: 6000, type: "speed_racer", lateReg: 20 },
        { id: 188, time: "19:30", name: "Bounty Hunters $2.50", buyin: 2.50, guaranteed: 750, type: "bounty_hunter", lateReg: 90 },
        { id: 189, time: "19:30", name: "Bounty Hunters $21.60", buyin: 21.60, guaranteed: 1500, type: "bounty_hunter", lateReg: 90 },
        { id: 190, time: "19:31", name: "Bounty Hunters Daily Double $8.88", buyin: 8.88, guaranteed: 5000, type: "bounty_hunter", lateReg: 90 },
        { id: 191, time: "19:32", name: "Bounty Hunters Daily Double II $8.88", buyin: 8.88, guaranteed: 3000, type: "bounty_hunter", lateReg: 90 },
        { id: 192, time: "20:05", name: "Mini SUPER SIX Bounty Turbo $6.60", buyin: 6.60, guaranteed: 6000, type: "bounty_hunter_special", lateReg: 135 },
        { id: 193, time: "20:05", name: "SUPER SIX Bounty Turbo $66", buyin: 66, guaranteed: 25000, type: "bounty_hunter_special", lateReg: 135 },
        { id: 194, time: "20:10", name: "Speed Racer Bounty $5.40 [10 BB]", buyin: 5.40, guaranteed: 3500, type: "speed_racer", lateReg: 20 },
        { id: 195, time: "20:10", name: "Speed Racer Bounty $54 [10 BB]", buyin: 54, guaranteed: 12500, type: "speed_racer", lateReg: 20 },
        { id: 196, time: "20:15", name: "Bounty Hunters Deepstack Turbo $10.80", buyin: 10.80, guaranteed: 12500, type: "bounty_hunter", lateReg: 90 },
        { id: 197, time: "20:15", name: "Bounty Hunters Deepstack Turbo $108", buyin: 108, guaranteed: 7000, type: "bounty_hunter", lateReg: 90 },
        { id: 198, time: "20:30", name: "Bounty Hunters $3.20", buyin: 3.20, guaranteed: 1000, type: "bounty_hunter", lateReg: 90 },
        { id: 199, time: "20:30", name: "Bounty Hunters $32", buyin: 32, guaranteed: 1000, type: "bounty_hunter", lateReg: 90 },
        { id: 200, time: "20:30", name: "Bounty Hunters Closer $10.80", buyin: 10.80, guaranteed: 7000, type: "bounty_hunter", lateReg: 90 },
        { id: 201, time: "20:30", name: "Bounty Hunters Closer $108", buyin: 108, guaranteed: 5000, type: "bounty_hunter", lateReg: 90 },
        { id: 202, time: "20:45", name: "Bounty Hunters Hyper Special $5.40", buyin: 5.40, guaranteed: 3500, type: "bounty_hunter_hyper", lateReg: 75 },
        { id: 203, time: "20:45", name: "Bounty Hunters Hyper Special $54", buyin: 54, guaranteed: 12500, type: "bounty_hunter_hyper", lateReg: 75 },
        { id: 204, time: "21:10", name: "Speed Racer Bounty $2.50 [10 BB]", buyin: 2.50, guaranteed: 1250, type: "speed_racer", lateReg: 20 },
        { id: 205, time: "21:10", name: "Speed Racer Bounty $21.60 [10 BB]", buyin: 21.60, guaranteed: 5000, type: "speed_racer", lateReg: 20 },
        { id: 206, time: "21:10", name: "Speed Racer Bounty Americas $108 [10 BB]", buyin: 108, guaranteed: 7500, type: "speed_racer", lateReg: 20 },
        { id: 207, time: "21:15", name: "Bounty Hunters Deepstack Turbo $3.20", buyin: 3.20, guaranteed: 4000, type: "bounty_hunter", lateReg: 90 },
        { id: 208, time: "21:15", name: "Bounty Hunters Deepstack Turbo $32", buyin: 32, guaranteed: 15000, type: "bounty_hunter", lateReg: 90 },
        { id: 209, time: "21:30", name: "Bounty Hunters $1.08", buyin: 1.08, guaranteed: 600, type: "bounty_hunter", lateReg: 90 },
        { id: 210, time: "21:30", name: "Bounty Hunters $8.88", buyin: 8.88, guaranteed: 1500, type: "bounty_hunter", lateReg: 90 },
        { id: 211, time: "21:30", name: "Bounty Hunters $88", buyin: 88, guaranteed: 1000, type: "bounty_hunter", lateReg: 90 },
        { id: 212, time: "21:30", name: "Daily Last Call $21.60 [Bounty Hyper]", buyin: 21.60, guaranteed: 10000, type: "bounty_hunter_hyper", lateReg: 75 },
        { id: 213, time: "21:30", name: "Daily Last Call $215 [Bounty Hyper]", buyin: 215, guaranteed: 10000, type: "bounty_hunter_hyper", lateReg: 75 },
        { id: 214, time: "21:30", name: "Mini Last Call $2.50 [Bounty Hyper]", buyin: 2.50, guaranteed: 2000, type: "bounty_hunter_hyper", lateReg: 75 },
        { id: 215, time: "17:10", name: "Speed Racer Bounty $3.20 [10 BB]", buyin: 3.20, guaranteed: 3000, type: "speed_racer", lateReg: 20 },
        { id: 216, time: "17:10", name: "Speed Racer Bounty $32 [10 BB]", buyin: 32, guaranteed: 7000, type: "speed_racer", lateReg: 20 },
        { id: 217, time: "17:10", name: "Speed Racer Bounty Europe $108 [10 BB]", buyin: 108, guaranteed: 7500, type: "speed_racer", lateReg: 20 },
        { id: 218, time: "17:15", name: "Bounty Hunters Deepstack Turbo $3.20", buyin: 3.20, guaranteed: 10000, type: "bounty_hunter", lateReg: 90 },
        { id: 219, time: "17:15", name: "Bounty Hunters Deepstack Turbo $32", buyin: 32, guaranteed: 20000, type: "bounty_hunter", lateReg: 90 },
        { id: 220, time: "17:30", name: "Bounty Hunters $2.50", buyin: 2.50, guaranteed: 1500, type: "bounty_hunter", lateReg: 90 },
        { id: 221, time: "17:30", name: "Bounty Hunters $21.60", buyin: 21.60, guaranteed: 2500, type: "bounty_hunter", lateReg: 90 },
        { id: 222, time: "17:30", name: "Bounty Hunters Daily Main $54", buyin: 54, guaranteed: 200000, type: "bounty_hunter", lateReg: 90 },
        { id: 223, time: "17:30", name: "Bounty Hunters Mini Main $5.40", buyin: 5.40, guaranteed: 30000, type: "bounty_hunter", lateReg: 90 },
        { id: 224, time: "18:10", name: "Speed Racer Bounty $10.80 [10 BB]", buyin: 10.80, guaranteed: 7000, type: "speed_racer", lateReg: 20 },
        { id: 225, time: "18:10", name: "Speed Racer Bounty $2.50 [10 BB]", buyin: 2.50, guaranteed: 2500, type: "speed_racer", lateReg: 20 },
        { id: 226, time: "18:15", name: "Bounty Hunters Deepstack Turbo $8.88", buyin: 8.88, guaranteed: 15000, type: "bounty_hunter", lateReg: 90 },
        { id: 227, time: "18:15", name: "Bounty Hunters Deepstack Turbo $88", buyin: 88, guaranteed: 15000, type: "bounty_hunter", lateReg: 90 },
        { id: 228, time: "18:30", name: "Bounty Hunters $5.40", buyin: 5.40, guaranteed: 3000, type: "bounty_hunter", lateReg: 90 },
        { id: 229, time: "18:30", name: "Bounty Hunters $54", buyin: 54, guaranteed: 2000, type: "bounty_hunter", lateReg: 90 },
        { id: 252, time: "18:30", name: "Bounty Hunters Special $8.88", buyin: 8.88, guaranteed: 6000, type: "bounty_hunter", lateReg: 125},
        { id: 230, time: "14:30", name: "Bounty Hunters Big Game $21.60", buyin: 21.60, guaranteed: 60000, type: "bounty_hunter", lateReg: 90 },
        { id: 231, time: "18:30", name: "Bounty Hunters Mini Big Game $2.50", buyin: 2.50, guaranteed: 12500, type: "bounty_hunter", lateReg: 90 },
        { id: 232, time: "18:35", name: "Bounty Hunters Big Game II $21.60", buyin: 21.60, guaranteed: 20000, type: "bounty_hunter", lateReg: 90 },
        { id: 233, time: "18:35", name: "Bounty Hunters Mini Big Game II $2.50", buyin: 2.50, guaranteed: 4000, type: "bounty_hunter", lateReg: 90 },
        { id: 234, time: "19:10", name: "Speed Racer Bounty $108 [10 BB]", buyin: 108, guaranteed: 10000, type: "speed_racer", lateReg: 20 },
        { id: 235, time: "19:10", name: "Speed Racer Bounty $32 [10 BB]", buyin: 32, guaranteed: 7000, type: "speed_racer", lateReg: 20 },
        { id: 236, time: "19:15", name: "Bounty Hunters Deepstack Turbo $5.40", buyin: 5.40, guaranteed: 15000, type: "bounty_hunter", lateReg: 90 },
        { id: 237, time: "19:15", name: "Bounty Hunters Deepstack Turbo $54", buyin: 54, guaranteed: 30000, type: "bounty_hunter", lateReg: 90 },
        { id: 238, time: "19:30", name: "Bounty Hunters $3.20", buyin: 3.20, guaranteed: 1250, type: "bounty_hunter", lateReg: 90 },
        { id: 239, time: "19:30", name: "Bounty Hunters $32", buyin: 32, guaranteed: 1500, type: "bounty_hunter", lateReg: 90 },
        { id: 240, time: "19:30", name: "Bounty Hunters 25 Grand $10.80", buyin: 10.80, guaranteed: 25000, type: "bounty_hunter", lateReg: 90 },
        { id: 241, time: "19:30", name: "Bounty Hunters Special $1.08", buyin: 1.08, guaranteed: 2500, type: "bounty_hunter_special", lateReg: 135 },
        { id: 242, time: "20:10", name: "Speed Racer Bounty $21.60 [10 BB]", buyin: 21.60, guaranteed: 7000, type: "speed_racer", lateReg: 20 },
        { id: 243, time: "20:10", name: "Speed Racer Bounty $3.20 [10 BB]", buyin: 3.20, guaranteed: 3000, type: "speed_racer", lateReg: 20 },
        { id: 244, time: "20:10", name: "Speed Racer Bounty Europe $108 [10 BB]", buyin: 108, guaranteed: 7500, type: "speed_racer", lateReg: 20 },
        { id: 245, time: "20:15", name: "Bounty Hunters Deepstack Turbo $8.88", buyin: 8.88, guaranteed: 15000, type: "bounty_hunter", lateReg: 90 },
        { id: 246, time: "20:15", name: "Bounty Hunters Deepstack Turbo $88", buyin: 88, guaranteed: 10000, type: "bounty_hunter", lateReg: 90 },
        { id: 247, time: "20:30", name: "Bounty Hunters $1.08", buyin: 1.08, guaranteed: 1000, type: "bounty_hunter", lateReg: 90 },
        { id: 248, time: "20:30", name: "Bounty Hunters $10.80", buyin: 10.80, guaranteed: 2500, type: "bounty_hunter", lateReg: 90 },
        { id: 249, time: "20:30", name: "Bounty King $32", buyin: 32, guaranteed: 35000, type: "bounty_king", lateReg: 135 },
        { id: 250, time: "20:30", name: "Bounty King HR $320", buyin: 320, guaranteed: 15000, type: "bounty_king", lateReg: 135 },
        { id: 251, time: "20:30", name: "Bounty King Jr $3.20", buyin: 3.20, guaranteed: 8000, type: "bounty_king", lateReg: 135 },          
      ],
      // ✅ Turbo diários
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
      //✅ Special diários
      specialdailies: [
        { id: 1, time: "21:05", name: "Micro Madness $1.88 [Hyper]", buyin: 1.88, guaranteed: 1250, type: "micro_madness", lateReg: 75 },
        { id: 2, time: "21:05", name: "Mini Midnight Madness $8.88 [Hyper]", buyin: 8.88, guaranteed: 5000, type: "midnight_madness", lateReg: 75 },
        { id: 3, time: "21:05", name: "Daily Special $250", buyin: 250, guaranteed: 10000, type: "daily_special", lateReg: 90 },
        { id: 4, time: "21:05", name: "Daily Special $50", buyin: 50, guaranteed: 7500, type: "daily_special", lateReg: 90 },
        { id: 5, time: "21:05", name: "Midnight Madness $88 [Hyper]", buyin: 88, guaranteed: 30000, type: "midnight_madness", lateReg: 75 },
        { id: 6, time: "22:05", name: "Midnight Madness II $8.88 [Hyper]", buyin: 8.88, guaranteed: 4000, type: "midnight_madness", lateReg: 75 },
        { id: 7, time: "22:05", name: "Midnight Madness II $88 [Hyper]", buyin: 88, guaranteed: 8500, type: "midnight_madness", lateReg: 75 },
        { id: 8, time: "23:05", name: "Midnight Madness III $88 [Hyper]", buyin: 88, guaranteed: 6000, type: "midnight_madness", lateReg: 75 },
        { id: 9, time: "23:05", name: "Midnight Madness III $8.88 [Hyper]", buyin: 8.88, guaranteed: 2500, type: "midnight_madness", lateReg: 75 },
        { id: 10, time: "00:05", name: "Daily Special $88", buyin: 88, guaranteed: 3500, type: "daily_special", lateReg: 90 },
        { id: 11, time: "00:05", name: "Daily Special $10", buyin: 10, guaranteed: 3000, type: "daily_special", lateReg: 90 },
        { id: 12, time: "01:05", name: "Daily Special $3", buyin: 3, guaranteed: 1000, type: "daily_special", lateReg: 90 },
        { id: 13, time: "01:05", name: "Daily Special $30", buyin: 30, guaranteed: 3000, type: "daily_special", lateReg: 90 },
        { id: 14, time: "01:15", name: "Superstack Turbo Special $8.80", buyin: 8.80, guaranteed: 3500, type: "superstack", lateReg: 90 },
        { id: 15, time: "02:05", name: "Daily Monster Stack $5", buyin: 5, guaranteed: 2500, type: "monster_stack", lateReg: 90 },
        { id: 16, time: "02:05", name: "Daily Monster Stack $50", buyin: 50, guaranteed: 10000, type: "monster_stack", lateReg: 90 },
        { id: 17, time: "03:05", name: "Daily Special $250", buyin: 250, guaranteed: 10000, type: "daily_special", lateReg: 90 },
        { id: 18, time: "03:05", name: "Daily Special $25", buyin: 25, guaranteed: 5000, type: "daily_special", lateReg: 90 },
        { id: 19, time: "03:05", name: "Daily Special $2.50", buyin: 2.50, guaranteed: 1500, type: "daily_special", lateReg: 90 },
        { id: 20, time: "04:05", name: "Daily Special $125", buyin: 125, guaranteed: 4000, type: "daily_special", lateReg: 90 },
        { id: 21, time: "04:05", name: "Daily Special $15", buyin: 15, guaranteed: 5000, type: "daily_special", lateReg: 90 },
        { id: 22, time: "04:15", name: "Mini Superstack Turbo $2.50", buyin: 2.50, guaranteed: 2250, type: "superstack", lateReg: 90 },
        { id: 23, time: "05:05", name: "Daily Special $30", buyin: 30, guaranteed: 5000, type: "daily_special", lateReg: 90 },
        { id: 24, time: "06:05", name: "Fifty Stack $55", buyin: 55, guaranteed: 15000, type: "fifty_stack", lateReg: 90 },
        { id: 25, time: "06:05", name: "Fifty Stack $5.50", buyin: 5.50, guaranteed: 4000, type: "fifty_stack", lateReg: 90 },
        { id: 26, time: "07:05", name: "Daily Special $4", buyin: 4, guaranteed: 2000, type: "daily_special", lateReg: 90 },
        { id: 27, time: "07:05", name: "Daily Special $40", buyin: 40, guaranteed: 5000, type: "daily_special", lateReg: 90 },
        { id: 28, time: "07:15", name: "Superstack Turbo Special $30", buyin: 30, guaranteed: 6000, type: "superstack", lateReg: 90 },
        { id: 29, time: "07:15", name: "Mini Superstack Turbo $3", buyin: 3, guaranteed: 2500, type: "superstack", lateReg: 90 },
        { id: 30, time: "08:05", name: "Superstack Special $88", buyin: 88, guaranteed: 10000, type: "superstack", lateReg: 90 },
        { id: 31, time: "08:05", name: "Superstack Special $8.88", buyin: 8.88, guaranteed: 6500, type: "superstack", lateReg: 90 },
        { id: 32, time: "09:05", name: "Daily Special $3", buyin: 3, guaranteed: 2000, type: "daily_special", lateReg: 90 },
        { id: 33, time: "09:05", name: "Daily Special $30", buyin: 30, guaranteed: 7000, type: "daily_special", lateReg: 90 },
        { id: 34, time: "09:45", name: "Mini Hypersonic $2.50", buyin: 2.50, guaranteed: 2000, type: "hypersonic", lateReg: 75 },
        { id: 35, time: "09:45", name: "Daily Hypersonic $20", buyin: 20, guaranteed: 7500, type: "hypersonic", lateReg: 75 },
        { id: 36, time: "10:05", name: "Daily Monster Stack $250", buyin: 250, guaranteed: 30000, type: "monster_stack", lateReg: 90 },
        { id: 37, time: "10:05", name: "Daily Monster Stack $2.50", buyin: 2.50, guaranteed: 4000, type: "monster_stack", lateReg: 90 },
        { id: 38, time: "11:05", name: "Daily Deepstack Special $125", buyin: 125, guaranteed: 15000, type: "deepstack", lateReg: 90 },
        { id: 39, time: "11:45", name: "Mini Hypersonic $2.50", buyin: 2.50, guaranteed: 2000, type: "hypersonic", lateReg: 75 },
        { id: 40, time: "12:05", name: "Daily 7-Max Special $200", buyin: 200, guaranteed: 12500, type: "daily_special", lateReg: 90 },
        { id: 41, time: "12:05", name: "Mini Forty Stack $4.40", buyin: 4.40, guaranteed: 6000, type: "fifty_stack", lateReg: 90 },
        { id: 42, time: "12:05", name: "Forty Stack $44", buyin: 44, guaranteed: 22500, type: "fifty_stack", lateReg: 90 },
        { id: 43, time: "13:05", name: "Daily Special $10", buyin: 10, guaranteed: 10000, type: "daily_special", lateReg: 90 },
        { id: 44, time: "13:05", name: "Daily Special $88", buyin: 88, guaranteed: 25000, type: "daily_special", lateReg: 90 },
        { id: 45, time: "14:05", name: "Daily Special $2.50", buyin: 2.50, guaranteed: 2500, type: "daily_special", lateReg: 90 },
        { id: 46, time: "14:05", name: "Daily Main Event $250", buyin: 250, guaranteed: 25000, type: "main_event", lateReg: 90 },
        { id: 47, time: "15:05", name: "Mini Monday Monster Stack $15", buyin: 15, guaranteed: 30000, type: "monster_stack", lateReg: 90 },
        { id: 48, time: "15:05", name: "Monday Monster Stack $150", buyin: 150, guaranteed: 80000, type: "monster_stack", lateReg: 90 },
        { id: 49, time: "15:45", name: "Mini Hypersonic $2.50", buyin: 2.50, guaranteed: 2500, type: "hypersonic", lateReg: 75 },
        { id: 50, time: "15:45", name: "Daily Hypersonic $20", buyin: 20, guaranteed: 15000, type: "hypersonic", lateReg: 75 },
        { id: 51, time: "16:05", name: "Fifty Stack $5.50", buyin: 5.50, guaranteed: 5000, type: "fifty_stack", lateReg: 90 },
        { id: 52, time: "16:05", name: "Fifty Stack $55", buyin: 55, guaranteed: 20000, type: "fifty_stack", lateReg: 90 },
        { id: 53, time: "17:05", name: "Mini LUCKY SEVENS Superstack Turbo $17.77 [7-Max]", buyin: 17.77, guaranteed: 20000, type: "superstack", lateReg: 90 },
        { id: 54, time: "17:05", name: "LUCKY SEVENS Superstack Turbo $77 [7-Max]", buyin: 77, guaranteed: 25000, type: "superstack", lateReg: 90 },
        { id: 55, time: "17:05", name: "Mini LUCKY SEVENS Superstack Turbo $17.77 [7-Max]", buyin: 17.77, guaranteed: 20000, type: "superstack", lateReg: 90 },
        { id: 56, time: "18:45", name: "Daily Hypersonic $20", buyin: 20, guaranteed: 12500, type: "hypersonic", lateReg: 75 },
        { id: 57, time: "18:45", name: "Mini Hypersonic $2.50", buyin: 2.50, guaranteed: 2000, type: "hypersonic", lateReg: 75 },
        { id: 58, time: "20:05", name: "Mini Saver $5 [Hyper]", buyin: 5, guaranteed: 3000, type: "hypersonic", lateReg: 75 },
        { id: 59, time: "20:05", name: "Day Saver $50 [Hyper]", buyin: 50, guaranteed: 17500, type: "hypersonic", lateReg: 75 },
        { id: 60, time: "20:05", name: "Day Saver $250 [Hyper]", buyin: 250, guaranteed: 15000, type: "hypersonic", lateReg: 75 },
        { id: 61, time: "20:45", name: "Daily Hypersonic $50", buyin: 50, guaranteed: 7000, type: "hypersonic", lateReg: 75 },
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
      // Bountys Dailies
      ggPokerConfig.bountyhunterdailies.forEach(template => {
        tournaments.push({
          id: id++,
          date: dateStr,
          time: template.time,
          site: "GGPoker",
          name: template.name,
          type: "TURBO KO",
          buyin: template.buyin,
          guaranteed: template.guaranteed,
          priority: "medium",
          status: "Aberto",
          lateReg: template.lateReg,
        });
      });
      // special Dailies
      ggPokerConfig.specialdailies.forEach(template => {
        tournaments.push({
          id: id++,
          date: dateStr,
          time: template.time,
          site: "GGPoker",
          name: template.name,
          type: "REG",
          buyin: template.buyin,
          guaranteed: template.guaranteed,
          priority: "high",
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

    // ✅ CONFIG: Templates de partypoker com lateReg explícito
    const partypokerConfig = {
      mainSeries: [
        { id: 244, date: "2026-01-21", time: "20:05", name: "Daily Legends 6-Max Deepstack Hyper: $2K Gtd", type: "REG", buyin: 55.00, guaranteed: 2000, priority: "medium", lateReg: 96 },
        { id: 1, date: "2026-01-29", time: "19:30", name: "Daily Legends 6-Max Turbo: $400 Gtd", type: "TURBO", buyin: 3.30, guaranteed: 400, priority: "very low", lateReg: 120 },
        { id: 2, date: "2026-01-29", time: "20:30", name: "Daily Legends 6-Max Turbo: $750 Gtd", type: "TURBO", buyin: 11, guaranteed: 750, priority: "very low", lateReg: 120 },
        { id: 3, date: "2026-01-29", time: "21:05", name: "The Super $22: $3,000 Gtd", type: "REG", buyin: 22, guaranteed: 3000, priority: "medium", lateReg: 120 },
        { id: 4, date: "2026-01-29", time: "21:05", name: "The Super $5.50: $2,000 Gtd", type: "REG", buyin: 5.50, guaranteed: 2000, priority: "medium", lateReg: 120 },
        { id: 5, date: "2026-01-29", time: "22:05", name: "Daily Legends 7-Max PKO: $750 Gtd", type: "REG KO", buyin: 11, guaranteed: 750, priority: "low", lateReg: 120 },
        { id: 6, date: "2026-01-29", time: "23:05", name: "Daily Legends 6-Max PKO Turbo: $400 Gtd", type: "TURBO KO", buyin: 5.50, guaranteed: 400, priority: "high", lateReg: 120 },
        { id: 7, date: "2026-01-30", time: "06:05", name: "Daily Legends 8-Max: $600 Gtd", type: "REG", buyin: 5.50, guaranteed: 600, priority: "medium", lateReg: 120 },
        { id: 8, date: "2026-01-30", time: "07:30", name: "Daily Legends 7-Max Early Mystery Turbo: $1K", type: "TURBO", buyin: 11, guaranteed: 1000, priority: "very low", lateReg: 120 },
        { id: 9, date: "2026-01-30", time: "08:30", name: "Daily Legends 6-Max Deepstack Turbo: $1K Gtd", type: "TURBO", buyin: 22, guaranteed: 1000, priority: "very low", lateReg: 120 },
        { id: 10, date: "2026-01-30", time: "08:30", name: "Daily Legends 6-Max Deepstack Turbo: $400 Gtd", type: "TURBO", buyin: 5.50, guaranteed: 400, priority: "very low", lateReg: 120 },
        { id: 11, date: "2026-01-30", time: "11:05", name: "Daily Legends 7-Max PKO: $1.5K Gtd", type: "REG KO", buyin: 5.50, guaranteed: 1500, priority: "low", lateReg: 120 },
        { id: 12, date: "2026-01-30", time: "12:30", name: "Daily Legends 4-Max Deepstack: $3K Gtd", type: "REG", buyin: 11, guaranteed: 3000, priority: "medium", lateReg: 120 },
        { id: 13, date: "2026-01-30", time: "13:05", name: "Daily Legends 6-Max Mystery Bounty: $5K Gtd", type: "MYSTERY", buyin: 22, guaranteed: 5000, priority: "medium", lateReg: 120 },
        { id: 14, date: "2026-01-30", time: "14:05", name: "Daily Legends Terminator: $6K Gtd", type: "REG", buyin: 11, guaranteed: 6000, priority: "medium", lateReg: 120 },
        { id: 15, date: "2026-01-30", time: "14:30", name: "Daily Legends 7-Max: $3K Gtd", type: "REG", buyin: 11, guaranteed: 3000, priority: "medium", lateReg: 120 },
        { id: 16, date: "2026-01-30", time: "15:05", name: "Daily Legends Predator: $10K Gtd", type: "REG", buyin: 22, guaranteed: 10000, priority: "medium", lateReg: 120 },
        { id: 17, date: "2026-01-30", time: "15:05", name: "Daily Legends Headhunter: $3K Gtd", type: "REG KO", buyin: 5.50, guaranteed: 3000, priority: "low", lateReg: 120 },
        { id: 18, date: "2026-01-30", time: "15:30", name: "Daily Legends Clasico: $4K Gtd", type: "REG", buyin: 22, guaranteed: 4000, priority: "medium", lateReg: 120 },
        { id: 19, date: "2026-01-30", time: "15:30", name: "Daily Legends 8-Max: $1K Gtd", type: "REG", buyin: 5.50, guaranteed: 1000, priority: "medium", lateReg: 120 },
        { id: 20, date: "2026-01-30", time: "16:05", name: "The Super $11: $100 Gtd", type: "REG", buyin: 11, guaranteed: 10000, priority: "medium", lateReg: 120 },
        { id: 21, date: "2026-01-30", time: "17:30", name: "Daily Legends 6-Max Turbo: $1.5K Gtd", type: "TURBO", buyin: 11, guaranteed: 1500, priority: "very low", lateReg: 120 },
        { id: 22, date: "2026-01-30", time: "18:05", name: "Daily Legends 7-Max Early Mystery Turbo: $7.5", type: "TURBO", buyin: 22, guaranteed: 7500, priority: "very low", lateReg: 120 },
        { id: 23, date: "2026-01-30", time: "18:05", name: "Daily Legends 7-Max Early Mystery Turbo: $3K", type: "TURBO", buyin: 5.50, guaranteed: 3000, priority: "very low", lateReg: 120 },
        { id: 24, date: "2026-01-30", time: "20:30", name: "Daily Legends 6-Max Turbo: $750 Gtd", type: "TURBO", buyin: 11, guaranteed: 750, priority: "very low", lateReg: 120 },
        { id: 25, date: "2026-01-30", time: "21:05", name: "The Super $22: $3,000 Gtd", type: "REG", buyin: 22, guaranteed: 3000, priority: "medium", lateReg: 120 },
        { id: 26, date: "2026-01-30", time: "21:05", name: "The Super $5.50: $2,000 Gtd", type: "REG", buyin: 5.50, guaranteed: 2000, priority: "medium", lateReg: 120 },
        { id: 27, date: "2026-01-28", time: "15:30", name: "Daily Legends 8-Max: $1K Gtd", type: "REG", buyin: 5.50, guaranteed: 1000, priority: "medium", lateReg: 120 },
        { id: 28, date: "2026-01-28", time: "15:45", name: "Bounty Battle 6-Max Hyper: $250 Gtd", type: "TURBO KO", buyin: 3.30, guaranteed: 250, priority: "high", lateReg: 120 },
        { id: 29, date: "2026-01-28", time: "15:45", name: "6-Max Hyper: $200 Gtd", type: "HYPER", buyin: 5.50, guaranteed: 200, priority: "very low", lateReg: 120 },
        { id: 31, date: "2026-01-28", time: "16:05", name: "The Super $11: $10000 Gtd", type: "REG", buyin: 11, guaranteed: 10000, priority: "medium", lateReg: 120 },
        { id: 32, date: "2026-01-28", time: "16:15", name: "Bounty Hunter 6-Max Turbo: $1K Gtd", type: "TURBO KO", buyin: 5.50, guaranteed: 1000, priority: "high", lateReg: 120 },
        { id: 33, date: "2026-01-28", time: "16:15", name: "6-Max Turbo: $750 Gtd", type: "TURBO", buyin: 22, guaranteed: 750, priority: "very low", lateReg: 120 },
        { id: 34, date: "2026-01-28", time: "16:15", name: "Battle 6-Max Hyper: $200 Gtd", type: "TURBO KO", buyin: 5.50, guaranteed: 200, priority: "high", lateReg: 120 },
        { id: 35, date: "2026-01-28", time: "16:30", name: "6-Max: $1K Gtd", type: "REG", buyin: 11, guaranteed: 1000, priority: "medium", lateReg: 120 },
        { id: 36, date: "2026-01-28", time: "16:45", name: "Bounty Hunter 8-Max Hyper: $1K Gtd", type: "TURBO KO", buyin: 5.50, guaranteed: 1000, priority: "high", lateReg: 120 },
        { id: 37, date: "2026-01-28", time: "17:00", name: "AFC Wimbledon Poker Club", type: "REG", buyin: 11, guaranteed: 44.50, priority: "medium", lateReg: 120 },
        { id: 38, date: "2026-01-28", time: "17:15", name: "8-Max Turbo: $300 Gtd", type: "TURBO", buyin: 3.30, guaranteed: 300, priority: "very low", lateReg: 120 },
        { id: 39, date: "2026-01-28", time: "17:30", name: "Daily Legends 6-Max Turbo: $1.5K Gtd", type: "TURBO", buyin: 11, guaranteed: 1500, priority: "very low", lateReg: 120 },
        { id: 40, date: "2026-01-28", time: "17:30", name: "8-Max Deepstack: $1K Gtd", type: "REG", buyin: 22, guaranteed: 1000, priority: "medium", lateReg: 120 },
        { id: 41, date: "2026-01-28", time: "17:45", name: "Bounty Battle 8-Max Hyper: $750 Gtd", type: "TURBO KO", buyin: 5.50, guaranteed: 750, priority: "high", lateReg: 120 },
        { id: 42, date: "2026-01-28", time: "18:00", name: "Bounty Hunter 6-Max: $1K Gtd", type: "REG KO", buyin: 11, guaranteed: 1000, priority: "low", lateReg: 120 },
        { id: 44, date: "2026-01-28", time: "18:05", name: "Daily Legends 7-Max Early Mystery Turbo: $7.5", type: "TURBO", buyin: 22, guaranteed: 7500, priority: "very low", lateReg: 120 },
        { id: 45, date: "2026-01-28", time: "18:15", name: "7-Max Deepstack: $500 Gtd", type: "REG", buyin: 5.50, guaranteed: 500, priority: "medium", lateReg: 120 },
        { id: 46, date: "2026-01-28", time: "18:15", name: "Daily Legends 7-Max Early Mystery Turbo: $7.5", type: "TURBO", buyin: 5.50, guaranteed: 7500, priority: "very low", lateReg: 120 },
        { id: 47, date: "2026-01-28", time: "18:15", name: "Battle 8-Max Hyper: $400 Gtd", type: "TURBO KO", buyin: 5.50, guaranteed: 400, priority: "high", lateReg: 120 },
        { id: 48, date: "2026-01-28", time: "18:30", name: "Bounty Battle 6-Max Turbo: $400 Gtd", type: "TURBO KO", buyin: 5.50, guaranteed: 400, priority: "high", lateReg: 120 },
        { id: 49, date: "2026-01-28", time: "18:45", name: "6-Max Hyper: $500 Gtd", type: "HYPER", buyin: 11, guaranteed: 500, priority: "very low", lateReg: 120 },
        { id: 50, date: "2026-01-28", time: "19:00", name: "Bounty Hunter 7-Max: $1.5K Gtd", type: "REG KO", buyin: 22, guaranteed: 1500, priority: "low", lateReg: 120 },
        { id: 51, date: "2026-01-28", time: "19:00", name: "Bounty Hunter 6-Max: $500 Gtd", type: "REG KO", buyin: 3.30, guaranteed: 500, priority: "low", lateReg: 120 },
        { id: 52, date: "2026-01-28", time: "19:00", name: "The Big Sunday: $25K Gtd [Phase 3]", type: "REG", buyin: 22, guaranteed: 25000, priority: "medium", lateReg: 120 },
        { id: 54, date: "2026-01-28", time: "19:05", name: "Daily Legends 6-Max PKO Turbo: $2K Gtd", type: "TURBO KO", buyin: 11, guaranteed: 2000, priority: "high", lateReg: 120 },
        { id: 55, date: "2026-01-28", time: "19:30", name: "8-Max: $1K Gtd", type: "REG", buyin: 11, guaranteed: 1000, priority: "medium", lateReg: 120 },
        { id: 56, date: "2026-01-28", time: "19:30", name: "Daily Legends 6-Max Turbo: $400 Gtd", type: "TURBO", buyin: 3.30, guaranteed: 400, priority: "very low", lateReg: 120 },
        { id: 57, date: "2026-01-28", time: "19:45", name: "Bounty Battle 6-Max Hyper: $300 Gtd", type: "TURBO KO", buyin: 5.50, guaranteed: 300, priority: "high", lateReg: 120 },
        { id: 58, date: "2026-01-28", time: "20:00", name: "Bounty Hunter 8-Max: $1K Gtd", type: "REG KO", buyin: 11, guaranteed: 1000, priority: "low", lateReg: 120 },
        { id: 59, date: "2026-01-28", time: "20:15", name: "Bounty Hunter 6-Max Turbo: $300 Gtd", type: "TURBO KO", buyin: 3.30, guaranteed: 300, priority: "high", lateReg: 120 },
        { id: 60, date: "2026-01-28", time: "09:30", name: "8-Max: $750 Gtd", type: "REG", buyin: 11, guaranteed: 750, priority: "medium", lateReg: 120 },
        { id: 61, date: "2026-01-28", time: "09:45", name: "Bounty Battle 6-Max Hyper: $300 Gtd", type: "TURBO KO", buyin: 5.50, guaranteed: 300, priority: "high", lateReg: 120 },
        { id: 62, date: "2026-01-28", time: "09:45", name: "7-Max Hyper: $400 Gtd", type: "HYPER", buyin: 16.50, guaranteed: 400, priority: "very low", lateReg: 120 },
        { id: 63, date: "2026-01-28", time: "10:00", name: "Bounty Hunter 8-Max: $1.5K Gtd", type: "REG KO", buyin: 11, guaranteed: 1500, priority: "low", lateReg: 120 },
        { id: 65, date: "2026-01-28", time: "10:15", name: "Bounty Hunter 6-Max Turbo: $500 Gtd", type: "TURBO KO", buyin: 5.50, guaranteed: 500, priority: "high", lateReg: 120 },
        { id: 66, date: "2026-01-28", time: "10:30", name: "6-Max Deepstack: $500 Gtd", type: "REG", buyin: 5.50, guaranteed: 500, priority: "medium", lateReg: 120 },
        { id: 67, date: "2026-01-28", time: "11:05", name: "Daily Legends 7-Max PKO: $1.5K Gtd", type: "REG KO", buyin: 5.50, guaranteed: 1500, priority: "low", lateReg: 120 },
        { id: 68, date: "2026-01-28", time: "11:15", name: "7-Max Hyper: $500 Gtd", type: "HYPER", buyin: 22, guaranteed: 500, priority: "very low", lateReg: 120 },
        { id: 69, date: "2026-01-28", time: "11:45", name: "Bounty Hunter 6-Max Hyper: $750 Gtd", type: "TURBO KO", buyin: 11, guaranteed: 750, priority: "high", lateReg: 120 },
        { id: 70, date: "2026-01-28", time: "11:45", name: "6-Max Turbo: $300 Gtd", type: "TURBO", buyin: 5.50, guaranteed: 300, priority: "very low", lateReg: 120 },
        { id: 71, date: "2026-01-28", time: "12:00", name: "Bounty Hunter 8-Max: $2K Gtd", type: "REG KO", buyin: 11, guaranteed: 2000, priority: "low", lateReg: 120 },

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

    const dates = generateDatesForFebruary();
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
        { time: "09:15", name: "Early Special $6,000 GTD", type: "REG", buyin: 44.00, guaranteed: 6000, lateReg: 240 },
        { time: "09:15", name: "Early Special $6,000 GTD", type: "REG", buyin: 16.50, guaranteed: 4000, lateReg: 240 },
        { time: "10:45", name: "Mega Stack $1,500 GTD", type: "REG", buyin: 16.50, guaranteed: 1500, lateReg: 90 },
        { time: "12:15", name: "$10,000 GTD", type: "REG", buyin: 16.50, guaranteed: 10000, lateReg: 192 },
        { time: "12:15", name: "$2,500 GTD", type: "REG", buyin: 6.60, guaranteed: 2500, lateReg: 192 },
        { time: "18:30", name: "$5,000 GTD", type: "REG", buyin: 8.80, guaranteed: 5000, lateReg: 192 },
        { time: "20:15", name: "The Boski Daily Double A - $7500 GTD", type: "REG", buyin: 8.80, guaranteed: 5000, lateReg: 192 },
        { time: "20:45", name: "The Boski Daily Double B - $7500 GTD", type: "REG", buyin: 8.80, guaranteed: 5000, lateReg: 192 },
      ],
    };

    const dates = generateDatesForFebruary();
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

    const dates = generateDatesForFebruary();
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

    // ✅ CONFIG: Templates de champion com lateReg explícito
    const championConfig = {
      mainSeries: [
        { id: 1, date: "2026-01-28", time: "09:00", name: "€5 MYSTERY [6-Max]", type: "MYSTERY", buyin: 5, guaranteed: 1000, priority: "medium", lateReg: 120 },
        { id: 2, date: "2026-01-28", time: "09:00", name: "€10 BOUNTY HUNTER PRIME", type: "REG KO", buyin: 10, guaranteed: 1500, priority: "medium", lateReg: 120 },
        
      ],
    };
    // ✅ Adicionar Main Event Series (fixos, com datas)
    championConfig.mainSeries.forEach(tournament => {
      tournaments.push({
        id: tournament.id,
        date: tournament.date,
        time: tournament.time,
        site: "Champion",
        name: tournament.name,
        type: tournament.type,
        buyin: tournament.buyin,
        guaranteed: tournament.guaranteed,
        priority: tournament.priority,
        status: "Aberto",
        lateReg: tournament.lateReg || LATE_REG_DEFAULTS[tournament.type] || 30,
      });
    });
  }        
  function addKKPOKERTournaments(tournaments, startId) {
    let id = startId;

    // ✅ CONFIG: Templates de kkpoker com lateReg explícito
    const KKPOKERConfig = {
      mainSeries: [
        { id: 1000, date: "2026-02-08", time: "10:00", name: "40K MYSTERY GLORY", type: "MYSTERY", buyin: 100, guaranteed: 40000, priority: "medium", lateReg: 180 },
        { id: 1001, date: "2026-02-08", time: "14:00", name: "20K GLORY PKO", type: "REG KO", buyin: 100, guaranteed: 20000, priority: "medium", lateReg: 180 },
        { id: 1002, date: "2026-02-09", time: "20:00", name: "5K HEAD HUNTER", type: "REG KO", buyin: 50, guaranteed: 5000, priority: "high", lateReg: 150 },
        { id: 1003, date: "2026-02-10", time: "10:00", name: "20K KNOCKOUT KING", type: "REG KO", buyin: 50, guaranteed: 20000, priority: "high", lateReg: 180 },
        { id: 1004, date: "2026-02-10", time: "16:00", name: "20K GLORY PKO", type: "REG KO", buyin: 30, guaranteed: 10000, priority: "very-high", lateReg: 150 },      
      ],
      //✅ Big diários
      bigDailies: [
        { time: "12:00", name: "$3K Classic1", buyin: 30, guaranteed: 3000, lateReg: 150 },
        { time: "22:00", name: "$2K CLASSIC", buyin: 20, guaranteed: 2000, lateReg: 150 },
      ],
      
      //✅ Bounty diários
      bountyDailies: [        
        { time: "08:00", name: "$5K Warrior", buyin: 30, guaranteed: 2000, lateReg: 150 },
        { time: "16:00", name: "$5K Warrior", buyin: 30, guaranteed: 5000, lateReg: 150 },
        { time: "18:00", name: "$3K Big Bounty", buyin: 15, guaranteed: 3000, lateReg: 150 },
        { time: "22:00", name: "$3K Warrior", buyin: 20, guaranteed: 3000, lateReg: 150 },
        { time: "23:00", name: "$1K MAdness", buyin: 8, guaranteed: 1000, lateReg: 150 },
      ]
    };
    dates.forEach(date => {
      const dateStr = formatDateString(date);
        // Big Dailies
      KKPOKERConfig.bigDailies.forEach(template => {
        tournaments.push({
          id: id++,
          date: dateStr,
          time: template.time,
          site: "KKPOKER",
          name: template.name,
          type: "REG",
          buyin: template.buyin,
          guaranteed: template.guaranteed,
          priority: "very-high",
          status: "Aberto",
          lateReg: template.lateReg,
        });
      });
              
      // Bountys Dailies
      KKPOKERConfig.bountyDailies.forEach(template => {
        tournaments.push({
          id: id++,
          date: dateStr,
          time: template.time,
          site: "KKPOKER",
          name: template.name,
          type: "REG KO",
          buyin: template.buyin,
          guaranteed: template.guaranteed,
          priority: "high",
          status: "Aberto",
          lateReg: template.lateReg,
        });
      });
      // ✅ Adicionar Main Event Series (fixos, com datas)
      KKPOKERConfig.mainSeries.forEach(tournament => {
        tournaments.push({
          id: tournament.id,
          date: tournament.date,
          time: tournament.time,
          site: "KKPOKER",
          name: tournament.name,
          type: tournament.type,
          buyin: tournament.buyin,
          guaranteed: tournament.guaranteed,
          priority: tournament.priority,
          status: "Aberto",
          lateReg: tournament.lateReg || LATE_REG_DEFAULTS[tournament.type] || 30,
        });
      });
    })  
    return id;
  }  
  function addCoinPokerTournaments(tournaments, startId) {
    let id = startId;

    // ✅ CONFIG: Templates de kkpoker com lateReg explícito
    const CoinPokerConfig = {
      mainSeries: [
        { id: 10000, date: "2026-02-08", time: "09:08", name: "T22 Mini Sunday Special Asia", type: "REG", buyin: 22, guaranteed: 6000, priority: "very-high", lateReg: 150 },
        { id: 10001, date: "2026-02-08", time: "12:05", name: "T25 Mini Sunday Warm-up", type: "REG", buyin: 25, guaranteed: 10000, priority: "very-high", lateReg: 150 },
        { id: 10002, date: "2026-02-08", time: "13:05", name: "T50 Mini Sunday Coin Hunter", type: "REG KO", buyin: 50, guaranteed: 15000, priority: "very-high", lateReg: 150 },
        { id: 10003, date: "2026-02-08", time: "14:05", name: "T25 Sunday Special", type: "REG", buyin: 25, guaranteed: 10000, priority: "very-high", lateReg: 150 },
        { id: 10004, date: "2026-02-08", time: "15:05", name: "T50 Sunday Main Event", type: "REG", buyin: 50, guaranteed: 20000, priority: "very-high", lateReg: 150 },
        { id: 10005, date: "2026-02-08", time: "15:30", name: "T15 SUNDAY CUP", type: "REG", buyin: 15, guaranteed: 7500, priority: "very-high", lateReg: 150 },
      ],
      //✅ Big diários
      bigDailies: [
        { time: "11:05", name: "T10 CoinPoker Mini Kickoff", buyin: 10, guaranteed: 3000, lateReg: 150 },
        
      ],
      
      //✅ Bounty diários
      bountyDailies: [
        { time: "14:00", name: "DOJO", buyin: 10, guaranteed: 3000, lateReg: 150 },
       
      ]
    };
    dates.forEach(date => {
      const dateStr = formatDateString(date);
        // Big Dailies
      CoinPokerConfig.bigDailies.forEach(template => {
        tournaments.push({
          id: id++,
          date: dateStr,
          time: template.time,
          site: "CoinPoker",
          name: template.name,
          type: "REG",
          buyin: template.buyin,
          guaranteed: template.guaranteed,
          priority: "very-high",
          status: "Aberto",
          lateReg: template.lateReg,
        });
      });
              
      // Bountys Dailies
      CoinPokerConfig.bountyDailies.forEach(template => {
        tournaments.push({
          id: id++,
          date: dateStr,
          time: template.time,
          site: "CoinPoker",
          name: template.name,
          type: "REG KO",
          buyin: template.buyin,
          guaranteed: template.guaranteed,
          priority: "medium",
          status: "Aberto",
          lateReg: template.lateReg,
        });
      });
      // ✅ Adicionar Main Event Series (fixos, com datas)
      CoinPokerConfig.mainSeries.forEach(tournament => {
        tournaments.push({
          id: tournament.id,
          date: tournament.date,
          time: tournament.time,
          site: "CoinPoker",
          name: tournament.name,
          type: tournament.type,
          buyin: tournament.buyin,
          guaranteed: tournament.guaranteed,
          priority: tournament.priority,
          status: "Aberto",
          lateReg: tournament.lateReg || LATE_REG_DEFAULTS[tournament.type] || 30,
        });
      });
    })  
    return id;
  } 
  //}
  //function addqqpkTournaments(tournaments, startId) {
    //let id = startId;
  //} 
  //function addjackpokerTournaments(tournaments, startId) {
    //let id = startId;
  //}       
  //function addclubggTournaments(tournaments, startId) {
    //let id = startId;
  //} 
  //function addsupremaTournaments(tournaments, startId) {
    //let id = startId;
  //} 
      
  // ============================================
  // ✅ MAIN: EXECUTAR TODAS AS FUNÇÕES
  // ============================================

  id = addGGPokerTournaments(tournaments, id);
  id = addPokerStarsTournaments(tournaments, id);
  id = addYaPokerTournaments(tournaments, id);
  id = add888PokerTournaments(tournaments, id);
  id = addChampionTournaments(tournaments, id);
  id = addpartypokerTournaments(tournaments, id);
  id = addKKPOKERTournaments(tournaments, id);
  id = addCoinPokerTournaments(tournaments, id);
   
  return tournaments;
}