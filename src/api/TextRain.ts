import { MiddlewareHandler } from "hono/mod.ts";

export class TextRain {
  private connections = new Set<WebSocket>();
  constructor() {}

  broadCast<T>(data: T) {
    for (const conn of this.connections) {
      conn.send(JSON.stringify(data));
    }
  }

  readonly stream: MiddlewareHandler = async (ctx) => {
    const { response, socket } = Deno.upgradeWebSocket(ctx.req.raw);

    socket.addEventListener("close", () => {
      console.log(socket);
      this.connections.delete(socket);
    });

    socket.addEventListener("open", () => {
      this.connections.add(socket);
    });

    socket.addEventListener("message", (data) => {
      if (typeof data.data !== "string") {
        socket.close(undefined, "invalid request.");
        this.connections.delete(socket);
        return;
      }

      const msg: unknown = JSON.parse(data.data);

      if (typeof msg !== "object" || msg == null) {
        socket.close(undefined, "invalid request. data is expect object.");
        return;
      }

      if (!("text" in msg) || typeof msg.text !== "string") {
        socket.close(undefined, "invalid request. .text is expect string.");
        return;
      }

      if (!("x" in msg) || typeof msg.x !== "number") {
        socket.close(undefined, "invalid request. .x is expect string.");
        return;
      }

      if (!("y" in msg) || typeof msg.y !== "number") {
        socket.close(undefined, "invalid request. .y is expect string.");
        return;
      }

      if (!("size" in msg) || typeof msg.size !== "number") {
        socket.close(undefined, "invalid request. .size is expect string.");
        return;
      }

      this.broadCast({
        text: msg.text,
        x: msg.x,
        y: msg.y,
        size: msg.size,
      });
    });

    return response;
  };
}
