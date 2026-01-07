export default function handler(req, res) {
  res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=300");
  res.status(200).json([{ ok: true, now: new Date().toISOString() }]);
}