import { pkToSigner } from "@/service/solana/utils";
import { env } from "@/env";
import { logger } from "@/logger";
import * as kit from "@solana/kit";

import { RedisClient } from "bun";

export const redis = new RedisClient(env.REDIS_URL);

export interface SessionData {
  lastActivity: number;

  signer: kit.KeyPairSigner;
  privateKey: string;
  traders: {
    signer: kit.KeyPairSigner;
    privateKey: string;
  }[];
}

// function serializeSessionData(data: SessionData): Record<string, string> {
//   return {
//     lastActivity: String(data.lastActivity),
//     privateKey: data.privateKey,
//     traderPrivateKeys: JSON.stringify(
//       data.traders.map((t) => t.privateKey) ?? []
//     ),
//   };
// }

// async function deserializeSessionData(
//   h: Record<string, string>
// ): Promise<SessionData> {
//   return {
//     lastActivity: Number(h.lastActivity ?? 0),
//     signer: await pkToSigner(h.privateKey),
//     privateKey: h.privateKey,
//     traders: h.traderPrivateKeys
//       ? await Promise.all(
//           JSON.parse(h.traderPrivateKeys).map(async (t: string) => ({
//             privateKey: t,
//             signer: await pkToSigner(t),
//           }))
//         )
//       : [],
//   };
// }

export async function sessionExists(sessionId: string): Promise<boolean> {
  return await redis.exists(`session:${sessionId}`);
}

export async function getSessionData(key: string): Promise<SessionData | null> {
  try {
    const baseKey = `session:${key}`;
    const tradersKey = `session:${key}:traders`;

    // Issue in parallel (auto-pipelined in Bun)
    const pBase = redis.hgetall(baseKey);
    const pTraders = redis.hgetall(tradersKey);

    const [rawBase, rawTraders] = await Promise.all([pBase, pTraders]);

    if (!rawBase || Object.keys(rawBase).length === 0) return null;

    const traderPKs = Object.entries(rawTraders || {})
      .filter(([field]) => field.startsWith("t:"))
      .sort((a, b) => Number(a[0].slice(2)) - Number(b[0].slice(2)))
      .map(([, pk]) => pk);

    const traders =
      traderPKs.length > 0
        ? await Promise.all(
            traderPKs.map(async (pk) => ({
              privateKey: pk,
              signer: await pkToSigner(pk),
            }))
          )
        : [];

    return {
      lastActivity: Number(rawBase.lastActivity ?? 0),
      privateKey: rawBase.privateKey,
      signer: await pkToSigner(rawBase.privateKey),
      traders,
    };
  } catch (err) {
    logger.error({ err, key }, "Failed to get session data from Redis");
    throw err;
  }
}

export async function setSessionData(
  key: string,
  data: SessionData
): Promise<boolean> {
  try {
    const baseKey = `session:${key}`;
    const tradersKey = `session:${key}:traders`;

    const baseFields: Record<string, string> = {
      lastActivity: String(data.lastActivity),
      privateKey: data.privateKey,
    };

    const traderFields: Record<string, string> = {};
    for (let i = 0; i < (data.traders?.length ?? 0); i++) {
      traderFields[`t:${i}`] = data.traders[i]!.privateKey;
    }

    // Fire writes without awaiting, Bun will batch automatically
    const p1 = redis.hset(baseKey, baseFields);
    const p2 = redis.del(tradersKey);
    const p3 =
      Object.keys(traderFields).length > 0
        ? redis.hset(tradersKey, traderFields)
        : null;

    await Promise.all([p1, p2, p3].filter(Boolean) as Promise<any>[]);

    return true;
  } catch (err) {
    logger.error({ err, key }, "Failed to set session data in Redis");
    throw err;
  }
}

// Add a trader wallet without loading full session
export async function addTraderWallet(
  sessionId: string,
  pkBase58: string
): Promise<{ address: string; created: boolean; total: number }> {
  const signer: kit.KeyPairSigner = await pkToSigner(pkBase58);
  const address = signer.address;
  const now = Date.now();

  // bump lastActivity (fire & forget, bun auto-pipelines)
  const pUpdateActivity = redis.hset(`session:${sessionId}`, {
    lastActivity: String(now),
  });

  // HSETNX to ensure we don't overwrite existing trader
  const created = await redis.hsetnx(
    `session:${sessionId}:traders`,
    `addr:${address}`,
    pkBase58
  );

  // count how many traders exist now
  const total = await redis.hlen(`session:${sessionId}:traders`);

  await pUpdateActivity;

  return { address, created, total };
}

export async function getTraderWallets(
  sessionId: string
): Promise<kit.KeyPairSigner[]> {
  // HVALS returns array of values = stored private keys
  const privateKeys = await redis.hvals(`session:${sessionId}:traders`);

  return Promise.all(privateKeys.map((pk) => pkToSigner(pk)));
}

export async function getTraderWallet(
  sessionId: string,
  address: string
): Promise<kit.KeyPairSigner | null> {
  const privateKey = await redis.hget(
    `session:${sessionId}:traders`,
    `addr:${address}`
  );
  return privateKey ? await pkToSigner(privateKey) : null;
}

// Delete trader wallet by address directly
export async function removeTraderWallet(
  sessionId: string,
  address: string
): Promise<{ removed: boolean; total: number }> {
  const removed =
    (await redis.hdel(`session:${sessionId}:traders`, `addr:${address}`)) > 0;
  const total = await redis.hlen(`session:${sessionId}:traders`);
  return { removed, total };
}
