export default async function handler(req, res) {
  const target = req.query.url;
  if (!target) {
    res.status(400).json({ error: "Missing ?url parameter" });
    return;
  }

  try {
    const r = await fetch(target, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; VercelProxy/1.0)",
        "Accept": "application/json,text/plain,*/*"
      }
    });

    const contentType = r.headers.get("content-type") || "application/octet-stream";

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "s-maxage=60"); // cache 1 min on Vercel CDN

    if (contentType.startsWith("image/")) {
      const buffer = Buffer.from(await r.arrayBuffer());
      res.status(r.status).send(buffer);
    } else {
      const text = await r.text();
      res.status(r.status).send(text);
    }
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
}
