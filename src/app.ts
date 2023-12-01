import { Hono } from "hono/mod.ts";
import { serveStatic } from "hono/middleware.ts";
import { join } from "path/join.ts";
import { TextRain } from "./api/TextRain.ts";
import { fromFileUrl, dirname, relative } from "path/mod.ts";

export function textRainApp() {
  const app = new Hono();
  const textRain = new TextRain();

  app.use("/api/stream", textRain.stream);

  app.get(
    "*",
    serveStatic({
      root: relative(
        ".",
        join(dirname(fromFileUrl(import.meta.url)), "./view/")
      ),
    })
  );

  return app;
}
