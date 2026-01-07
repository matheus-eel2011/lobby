export default function handler(req, res) {
  res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=300");

  res.status(200).json([
    {
      id: 1,
      time: "14:00",
      site: "GGPoker",
      name: "Main Event",
      type: "REGULAR",
      buyin: 100,
      guaranteed: 50000,
      field: 1200,
      roi: 12,
      priority: "high",
      lateReg: 45,
      status: "Aberto",
      day: 0
    }
  ]);
}