const https = require("https");

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") return res.status(204).end();

  const path = req.query.path || "";
  if (!path.startsWith("/apis/")) {
    return res.status(403).json({ error: "path must start with /apis/" });
  }

  const targetUrl = "https://mlb26.theshow.com" + path;

  return new Promise((resolve) => {
    https.get(targetUrl, {
      headers: {
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0",
      }
    }, (response) => {
      let data = "";
      response.on("data", chunk => { data += chunk; });
      response.on("end", () => {
        try {
          res.setHeader("Cache-Control", "s-maxage=300");
          res.status(200).json(JSON.parse(data));
        } catch(e) {
          res.status(502).json({ error: "parse error", raw: data.slice(0, 200) });
        }
        resolve();
      });
    }).on("error", (err) => {
      res.status(502).json({ error: err.message, target: targetUrl });
      resolve();
    });
  });
}
