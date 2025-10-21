import pino from "pino";
import { err } from "pino-std-serializers";

export const logger = pino({
  level: "info",
  serializers: {
    err,
  },
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "yyyy-mm-dd HH:MM:ss.l",
      ignore: "pid,hostname",
      singleLine: false,
    },
  },
});
