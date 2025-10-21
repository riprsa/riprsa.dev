import path from "path";
import fs from "fs";

import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";

import { loggerMiddleware } from "./middleware/logger";
import { logger } from "@/logger";

import { env } from "@/env";
import { ws } from "./modules/websocket";

// Create the app instance for type export
export const app = new Elysia({
  serve: {
    idleTimeout: 255, // 3 minutes in milliseconds
  },
})
  .use(cors())

  .get("/health", () => {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      service: "keeper",
      uptime: process.uptime(),
    };
  })

  .get("/", () => {
    const filePath = path.join(__dirname, env.STATIC_PATH, "index.html");
    logger.debug({ filePath }, "Serving index.html");
    if (fs.existsSync(filePath)) {
      return new Response(fs.readFileSync(filePath), {
        headers: { "Content-Type": "text/html" },
      });
    }
    logger.warn({ filePath }, "index.html not found");
    return new Response("Not Found", { status: 404 });
  })
  .get("/*", ({ request }) => {
    const url = new URL(request.url);
    const filePath = path.join(__dirname, env.STATIC_PATH, url.pathname);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      // Basic content type detection
      let contentType = "application/octet-stream";
      if (filePath.endsWith(".html")) contentType = "text/html";
      else if (filePath.endsWith(".js")) contentType = "application/javascript";
      else if (filePath.endsWith(".css")) contentType = "text/css";
      else if (filePath.endsWith(".json")) contentType = "application/json";
      else if (filePath.endsWith(".png")) contentType = "image/png";
      else if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg"))
        contentType = "image/jpeg";
      else if (filePath.endsWith(".svg")) contentType = "image/svg+xml";
      return new Response(fs.readFileSync(filePath), {
        headers: { "Content-Type": contentType },
      });
    }
    return new Response("Not Found", { status: 404 });
  })

  .use(
    swagger({
      documentation: {
        info: {
          title: "API",
          version: "1.0.0",
          description: "API",
        },
      },
    })
  )

  .use(loggerMiddleware)

  .use(ws)

  .listen(env.PORT);

logger.info(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
