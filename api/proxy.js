export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  const path = req.query.path || "";
  if (!path.startsWith("/apis/")) {
    return res.status(403).json({ error: "path must start with /apis/" });
  }

  const targetUrl = "https://mlb26.theshow.com" + path;

  try {
    const response = await fetch(targetUrl, {
      headers: {
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });
    const data = await response.json();
    res.setHeader("Cache-Control", "s-maxage=300");
    return res.status(200).json(data);
  } catch (err) {
    return res.status(502).json({ error: err.message, target: targetUrl });
  }
}
