import { logger } from "@/logger";
import { Elysia, t } from "elysia";
import type { ElysiaWS } from "elysia/ws";

export const RequestMessage = t.Union([t.Object({ type: t.Literal("ping") })]);

export const ResponseMessage = t.Union([
  t.Object({ type: t.Literal("pong"), at: t.Number() }),
  t.Object({ type: t.Literal("hi") }),
  t.Object({ type: t.Literal("error"), message: t.String() }),
  t.Object({
    type: t.Literal("alert"),
    data: t.Union([
      t.Object({
        type: t.Literal("creation"),
        mint: t.String(),
      }),
      t.Object({
        type: t.Literal("migration"),
        mint: t.String(),
      }),
      t.Object({
        type: t.Literal("debug"),
        data: t.String(),
      }),
    ]),
  }),
]);

export type RequestMessage = typeof RequestMessage.static;
export type ResponseMessage = typeof ResponseMessage.static;

type Connection = ElysiaWS<{}>;

const activeConnections = new Map<string, Connection>();

export const ws = new Elysia().ws("/websocket", {
  open(ws) {
    activeConnections.set(ws.id, ws);

    ws.send({
      type: "hi",
    });
  },

  body: RequestMessage,
  response: ResponseMessage,

  async message(ws, msg) {
    switch (msg.type) {
      case "ping":
        ws.send({
          type: "pong",
          at: Date.now(),
        } satisfies typeof ResponseMessage.static);

        return;
    }
  },

  close(code) {
    activeConnections.delete(code.id);
  },
});

// Export functions to send messages from anywhere in the application
export function broadcastToOne(clientId: string, message: ResponseMessage) {
  const connection = activeConnections.get(clientId);
  if (connection) {
    connection.send(message);
    logger.info(`Sent message to client ${clientId}: ${message}`);
    return;
  }
  logger.error(`Client ${clientId} not found`);
}

export function broadcastToAll(message: ResponseMessage) {
  activeConnections.forEach((connection) => {
    connection.send(message);
  });
}

export function getConnectionCount() {
  return activeConnections.size;
}

export function getActiveConnections() {
  return Array.from(activeConnections.keys());
}
