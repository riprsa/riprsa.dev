import { z } from "zod";
import { logger } from "@/logger";

const envSchema = z.object({
  BOT_TOKEN: z.string(),
});

export const env = envSchema.parse(process.env);

logger.info("envs loaded");
