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

  try {
    const response = await fetch(targetUrl, {
      headers: {
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0",
      },
    });
    const data = await response.json();
    res.setHeader("Cache-Control", "s-maxage=300");
    return res.status(200).json(data);
  } catch (err) {
    return res.status(502).json({ error: err.message, target: targetUrl });
  }
}
```

Commit the change. Vercel will auto-redeploy in about 30 seconds. Then test this URL in your browser to confirm item fetch works:
```
https://mlb-proxy-lovat.vercel.app/api/proxy?path=/apis/item.json?uuid=b4d18dfeb0c12adad6c47445f70984fb
