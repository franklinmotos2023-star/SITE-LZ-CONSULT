import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ALLOWED_USERNAMES = new Set([
  "paulinhodosleiloes",
  "futcearense",
  "novojovem.ce",
  "marcaodaema",
  "vozaocast_",
  "franklin.motos",
]);

interface CachedAvatar {
  buffer: Buffer;
  contentType: string;
  expiresAt: number;
}

const AVATAR_CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours
const avatarCache = new Map<string, CachedAvatar>();

async function fetchLiveInstagramAvatar(
  username: string
): Promise<{ buffer: Buffer; contentType: string } | null> {
  try {
    const embedRes = await fetch(`https://www.instagram.com/${username}/embed/`, {
      headers: {
        "User-Agent": "facebookexternalhit/1.1",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(6000),
    });

    if (!embedRes.ok) return null;
    const html = await embedRes.text();

    const match = html.match(/profile_pic_url\\":\\"(https?:[^"]+)\\"/);
    if (!match?.[1]) return null;

    const imageUrl = match[1]
      .replace(/\\\\\\\//g, "/")
      .replace(/\\\//g, "/")
      .replace(/\\u0026/g, "&");

    const imgRes = await fetch(imageUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
      signal: AbortSignal.timeout(6000),
    });

    if (!imgRes.ok) return null;

    const contentType = imgRes.headers.get("content-type") || "image/jpeg";
    if (!contentType.startsWith("image/")) return null;

    const buffer = Buffer.from(await imgRes.arrayBuffer());
    if (buffer.length === 0) return null;

    return { buffer, contentType };
  } catch {
    return null;
  }
}

function readLocalFallbackAvatar(username: string): Buffer | null {
  const candidates = [
    path.join(__dirname, "public", "avatars", `${username}.jpg`),
    path.join(__dirname, "dist", "avatars", `${username}.jpg`),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return fs.readFileSync(candidate);
    }
  }
  return null;
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT || 3000);

  app.get("/api/instagram-avatar/:username", async (req, res) => {
    const username = req.params.username?.trim().toLowerCase();
    if (!username || !ALLOWED_USERNAMES.has(username)) {
      res.status(404).end();
      return;
    }

    const now = Date.now();
    const cached = avatarCache.get(username);
    if (cached && cached.expiresAt > now) {
      res.setHeader("Content-Type", cached.contentType);
      res.setHeader("Cache-Control", "public, max-age=21600");
      res.send(cached.buffer);
      return;
    }

    const live = await fetchLiveInstagramAvatar(username);
    if (live) {
      avatarCache.set(username, {
        buffer: live.buffer,
        contentType: live.contentType,
        expiresAt: now + AVATAR_CACHE_TTL_MS,
      });
      res.setHeader("Content-Type", live.contentType);
      res.setHeader("Cache-Control", "public, max-age=21600");
      res.send(live.buffer);
      return;
    }

    const fallback = readLocalFallbackAvatar(username);
    if (fallback) {
      res.setHeader("Content-Type", "image/jpeg");
      res.setHeader("Cache-Control", "public, max-age=3600");
      res.send(fallback);
      return;
    }

    res.status(404).end();
  });

  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.join(__dirname, "dist");
    app.use(express.static(distDir));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distDir, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
