export default async function handler(req, res) {
  const target = req.query.url;
  if (!target) {
    res.status(400).json({ error: "Missing ?url parameter" });
    return;
  }

  try {
    const r = await fetch(target, {
      headers: {
        // Use a normal browser UA so Invidious doesn’t block
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
        "Accept": "application/json,text/plain,*/*"
      }
    });

    const contentType = r.headers.get("content-type") || "application/octet-stream";

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "s-maxage=60"); // cache at edge for 1 min

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
