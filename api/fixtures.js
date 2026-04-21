export default async function handler(req, res) {
  const { date, league } = req.query;
  if (!date || !league) return res.status(400).json({ error: 'Missing params' });

  const allowed = ['eng.1', 'fifa.world'];
  if (!allowed.includes(league)) return res.status(400).json({ error: 'Invalid league' });

  try {
    const url = `https://site.api.espn.com/apis/site/v2/sports/soccer/${league}/scoreboard?dates=${date}`;
    const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible)' } });
    if (!r.ok) return res.status(r.status).json({ error: 'Upstream error' });
    const data = await r.json();
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=30');
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: 'Fetch failed', message: e.message });
  }
}
