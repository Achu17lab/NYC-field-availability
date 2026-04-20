export default async function handler(req, res) {
  const upstream = "https://www.nycgovparks.org/permits/field-and-court/issued/M022/csv";
  try {
    const r = await fetch(upstream, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36",
        "Accept": "text/csv,text/plain,*/*",
      },
    });
    if (!r.ok) {
      res.status(502).send(`Upstream ${r.status}`);
      return;
    }
    const text = await r.text();
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=21600");
    res.status(200).send(text);
  } catch (e) {
    res.status(500).send("Fetch failed");
  }
}
