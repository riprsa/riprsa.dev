import { treaty } from "@elysiajs/eden";
import type { App } from "@riprsa.dev/backend";
import { env } from "@/env";

export const api = treaty<App>(env.BACKEND_URL);


