export default function handler(req, res) {
  res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=300");

  const tournaments = [
    // SEGUNDA (day: 0)
    { id: 1, time: "14:00", site: "GGPoker", name: "Main Event", type: "REGULAR", buyin: 100, guaranteed: 50000, field: 1200, roi: 12, priority: "high", lateReg: 45, status: "Aberto", day: 0 },
    { id: 2, time: "14:30", site: "GGPoker", name: "Turbo Championship", type: "TURBO", buyin: 50, guaranteed: 25000, field: 800, roi: 15, priority: "medium", lateReg: 30, status: "Aberto", day: 0 },
    { id: 3, time: "15:00", site: "GGPoker", name: "PKO Special", type: "PKO", buyin: 25, guaranteed: 15000, field: 500, roi: 18, priority: "high", lateReg: 20, status: "Aberto", day: 0 },
    { id: 4, time: "15:30", site: "YaPoker", name: "Hyper Turbo", type: "HYPER", buyin: 10, guaranteed: 5000, field: 300, roi: 20, priority: "low", lateReg: 15, status: "Aberto", day: 0 },
    { id: 5, time: "16:00", site: "888Poker", name: "Championship Series", type: "REGULAR", buyin: 55, guaranteed: 30000, field: 650, roi: 14, priority: "very-high", lateReg: 45, status: "Aberto", day: 0 },
    { id: 7, time: "17:00", site: "Champion", name: "Grand Slam", type: "REGULAR", buyin: 75, guaranteed: 20000, field: 450, roi: 16, priority: "medium", lateReg: 40, status: "Aberto", day: 0 },
    { id: 8, time: "18:00", site: "GGPoker", name: "Night Grind", type: "TURBO", buyin: 30, guaranteed: 10000, field: 350, roi: 17, priority: "medium", lateReg: 30, status: "Aberto", day: 0 },
    { id: 9, time: "19:00", site: "YaPoker", name: "Midnight Madness", type: "PKO", buyin: 20, guaranteed: 8000, field: 280, roi: 19, priority: "high", lateReg: 25, status: "Aberto", day: 0 },
    { id: 12, time: "22:00", site: "GGPoker", name: "Late Night Special", type: "HYPER", buyin: 15, guaranteed: 6000, field: 250, roi: 21, priority: "low", lateReg: 12, status: "Aberto", day: 0 },

    // TERÇA (day: 1)
    { id: 10, time: "20:00", site: "PokerStars", name: "Deep Stack", type: "REGULAR", buyin: 110, guaranteed: 60000, field: 900, roi: 11, priority: "very-high", lateReg: 50, status: "Tardio", day: 1 },
    { id: 13, time: "14:00", site: "GGPoker", name: "Morning Grind", type: "REGULAR", buyin: 80, guaranteed: 35000, field: 700, roi: 13, priority: "medium", lateReg: 35, status: "Aberto", day: 1 },
    { id: 14, time: "15:30", site: "PokerStars", name: "Turbo King", type: "TURBO", buyin: 60, guaranteed: 20000, field: 450, roi: 16, priority: "high", lateReg: 25, status: "Aberto", day: 1 },
    { id: 15, time: "17:00", site: "888Poker", name: "SuperSat", type: "HYPER", buyin: 12, guaranteed: 3000, field: 200, roi: 22, priority: "low", lateReg: 10, status: "Aberto", day: 1 },
    { id: 16, time: "18:30", site: "YaPoker", name: "PKO Jackpot", type: "PKO", buyin: 35, guaranteed: 18000, field: 520, roi: 17, priority: "very-high", lateReg: 30, status: "Aberto", day: 1 },

    // QUARTA (day: 2)
    { id: 17, time: "13:00", site: "Champion", name: "Early Bird", type: "REGULAR", buyin: 45, guaranteed: 15000, field: 400, roi: 15, priority: "medium", lateReg: 40, status: "Aberto", day: 2 },
    { id: 18, time: "15:00", site: "GGPoker", name: "Afternoon Special", type: "TURBO", buyin: 55, guaranteed: 22000, field: 600, roi: 14, priority: "high", lateReg: 30, status: "Aberto", day: 2 },
    { id: 19, time: "16:30", site: "PokerStars", name: "Fast & Furious", type: "HYPER", buyin: 25, guaranteed: 8000, field: 350, roi: 19, priority: "medium", lateReg: 15, status: "Aberto", day: 2 },
    { id: 20, time: "18:00", site: "888Poker", name: "Evening Grind", type: "REGULAR", buyin: 90, guaranteed: 45000, field: 750, roi: 12, priority: "very-high", lateReg: 45, status: "Aberto", day: 2 },
    { id: 21, time: "20:00", site: "YaPoker", name: "Night Special", type: "PKO", buyin: 40, guaranteed: 20000, field: 500, roi: 16, priority: "high", lateReg: 25, status: "Aberto", day: 2 },

    // QUINTA (day: 3)
    { id: 11, time: "21:00", site: "888Poker", name: "Turbo Jackpot", type: "TURBO", buyin: 45, guaranteed: 22000, field: 600, roi: 16, priority: "medium", lateReg: 25, status: "Aberto", day: 3 },
    { id: 22, time: "14:00", site: "GGPoker", name: "Midday Madness", type: "REGULAR", buyin: 70, guaranteed: 35000, field: 550, roi: 14, priority: "high", lateReg: 40, status: "Aberto", day: 3 },
    { id: 23, time: "16:00", site: "PokerStars", name: "Turbo Series", type: "TURBO", buyin: 65, guaranteed: 25000, field: 500, roi: 15, priority: "medium", lateReg: 30, status: "Aberto", day: 3 },
    { id: 24, time: "17:30", site: "Champion", name: "Hyper Rush", type: "HYPER", buyin: 18, guaranteed: 5000, field: 280, roi: 20, priority: "low", lateReg: 12, status: "Aberto", day: 3 },
    { id: 25, time: "19:00", site: "888Poker", name: "KO Bounty", type: "PKO", buyin: 50, guaranteed: 25000, field: 600, roi: 17, priority: "very-high", lateReg: 30, status: "Aberto", day: 3 },

    // SEXTA (day: 4)
    { id: 26, time: "13:00", site: "YaPoker", name: "Friday Grind", type: "REGULAR", buyin: 85, guaranteed: 40000, field: 650, roi: 13, priority: "medium", lateReg: 45, status: "Aberto", day: 4 },
    { id: 27, time: "15:00", site: "GGPoker", name: "Afternoon Rush", type: "TURBO", buyin: 75, guaranteed: 30000, field: 700, roi: 14, priority: "high", lateReg: 35, status: "Aberto", day: 4 },
    { id: 28, time: "16:30", site: "PokerStars", name: "Speed Tournament", type: "HYPER", buyin: 22, guaranteed: 7000, field: 300, roi: 21, priority: "medium", lateReg: 15, status: "Aberto", day: 4 },
    { id: 29, time: "18:00", site: "888Poker", name: "Evening Party", type: "REGULAR", buyin: 95, guaranteed: 50000, field: 900, roi: 11, priority: "very-high", lateReg: 50, status: "Aberto", day: 4 },
    { id: 30, time: "20:00", site: "Champion", name: "Friday Special", type: "PKO", buyin: 45, guaranteed: 22000, field: 550, roi: 16, priority: "high", lateReg: 30, status: "Aberto", day: 4 },
    { id: 31, time: "21:30", site: "YaPoker", name: "Late Night Grind", type: "TURBO", buyin: 35, guaranteed: 15000, field: 400, roi: 17, priority: "medium", lateReg: 25, status: "Aberto", day: 4 },

    // SÁBADO (day: 5)
    { id: 32, time: "11:00", site: "GGPoker", name: "Saturday Morning", type: "REGULAR", buyin: 65, guaranteed: 30000, field: 500, roi: 15, priority: "high", lateReg: 45, status: "Aberto", day: 5 },
    { id: 33, time: "13:00", site: "PokerStars", name: "Weekend Grind", type: "TURBO", buyin: 80, guaranteed: 35000, field: 700, roi: 14, priority: "medium", lateReg: 35, status: "Aberto", day: 5 },
    { id: 34, time: "14:30", site: "888Poker", name: "Afternoon Championship", type: "REGULAR", buyin: 120, guaranteed: 60000, field: 1000, roi: 12, priority: "very-high", lateReg: 50, status: "Aberto", day: 5 },
    { id: 35, time: "16:00", site: "YaPoker", name: "Hyper Blitz", type: "HYPER", buyin: 20, guaranteed: 6000, field: 250, roi: 22, priority: "low", lateReg: 10, status: "Aberto", day: 5 },
    { id: 36, time: "17:30", site: "Champion", name: "Saturday KO", type: "PKO", buyin: 55, guaranteed: 28000, field: 650, roi: 16, priority: "high", lateReg: 30, status: "Aberto", day: 5 },
    { id: 37, time: "19:00", site: "GGPoker", name: "Evening Championship", type: "REGULAR", buyin: 150, guaranteed: 80000, field: 1400, roi: 10, priority: "very-high", lateReg: 55, status: "Aberto", day: 5 },
    { id: 38, time: "21:00", site: "PokerStars", name: "Late Night Marathon", type: "TURBO", buyin: 90, guaranteed: 40000, field: 800, roi: 13, priority: "medium", lateReg: 40, status: "Aberto", day: 5 },

    // DOMINGO (day: 6)
    { id: 6, time: "16:30", site: "PokerStars", name: "Sunday Million", type: "REGULAR", buyin: 200, guaranteed: 100000, field: 2500, roi: 10, priority: "very-high", lateReg: 60, status: "Tardio", day: 6 },
    { id: 39, time: "12:00", site: "GGPoker", name: "Sunday Special", type: "REGULAR", buyin: 100, guaranteed: 50000, field: 1000, roi: 12, priority: "high", lateReg: 50, status: "Aberto", day: 6 },
    { id: 40, time: "14:00", site: "888Poker", name: "Sunday Turbo", type: "TURBO", buyin: 70, guaranteed: 30000, field: 600, roi: 15, priority: "medium", lateReg: 35, status: "Aberto", day: 6 },
    { id: 41, time: "15:30", site: "YaPoker", name: "Sunday PKO", type: "PKO", buyin: 50, guaranteed: 25000, field: 550, roi: 17, priority: "high", lateReg: 30, status: "Aberto", day: 6 },
    { id: 42, time: "17:00", site: "Champion", name: "Late Register Open", type: "REGULAR", buyin: 85, guaranteed: 40000, field: 700, roi: 13, priority: "medium", lateReg: 60, status: "Aberto", day: 6 },
    { id: 43, time: "18:30", site: "GGPoker", name: "Sunday Night Grind", type: "HYPER", buyin: 25, guaranteed: 8000, field: 300, roi: 20, priority: "low", lateReg: 15, status: "Aberto", day: 6 },
    { id: 44, time: "20:00", site: "PokerStars", name: "Sunday Storm", type: "TURBO", buyin: 55, guaranteed: 22000, field: 500, roi: 16, priority: "high", lateReg: 30, status: "Aberto", day: 6 },
  ];

  res.status(200).json(tournaments);
}