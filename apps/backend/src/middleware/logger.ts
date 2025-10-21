import { logger } from "@/logger";
import { Elysia } from "elysia";

export const loggerMiddleware = new Elysia()
  .derive(({ request }) => {
    const startTime = Date.now();
    return { startTime };
  })
  .onRequest(({ request }) => {
    if (
      request.url.includes("sol_price") ||
      request.url.includes("wallets/traders") ||
      request.url.includes("wallets/positions")
    )
      return;
    logger.info(`${request.method} ${request.url} - Started`);
  })
  .onAfterHandle(({ request, set, startTime }) => {
    const duration = Date.now() - (startTime as number);
    const status = set.status || 200;

    logger.info(`${request.url} - ${status} (${duration}ms)`);
  });
