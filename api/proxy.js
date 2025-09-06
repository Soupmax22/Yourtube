export default async function handler(req, res) {
  const target = req.query.url; // e.g. /api/proxy?url=https://inv.nadeko.net/api/v1/search?q=lofi
  if (!target) {
    res.status(400).json({ error: "Missing ?url parameter" });
    return;
  }

  try {
    const r = await fetch(target);
    const text = await r.text();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", r.headers.get("content-type") || "application/json");
    res.status(r.status).send(text);
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
}
