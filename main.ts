import { textRainApp } from "./src/app.ts";

const app = textRainApp();

const PORT = Deno.env.get("PORT");

Deno.serve(
  {
    port: PORT ? parseInt(PORT) : 4000,
    onListen({ hostname, port }) {
      console.log(`waiting for connection on http://${hostname}:${port}/`);
    },
  },
  app.fetch
);
