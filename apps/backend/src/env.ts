import { z } from "zod";
import { logger } from "@/logger";

const envSchema = z.object({
  REDIS_URL: z.string(),
  STATIC_PATH: z.string().default("../../../frontend/dist"),
  PORT: z.string().default("3001"),
});

export const env = envSchema.parse(process.env);

logger.info("envs loaded");
