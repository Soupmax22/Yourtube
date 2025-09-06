export default async function handler(req, res) {
  const target = req.query.url;
  if (!target) {
    res.status(400).json({ error: "Missing ?url parameter" });
    return;
  }

  try {
    const r = await fetch(target);
    const contentType = r.headers.get("content-type") || "application/octet-stream";

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", contentType);

    if (contentType.startsWith("image/")) {
      // Handle thumbnails as binary
      const buffer = Buffer.from(await r.arrayBuffer());
      res.status(r.status).send(buffer);
    } else {
      // JSON/text response
      const text = await r.text();
      res.status(r.status).send(text);
    }
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
}
