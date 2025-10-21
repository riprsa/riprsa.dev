// export interface TokenCache {
//   name: string;
//   symbol: string;
//   creatorAddress?: string;
//   // amount of token owned at the moment
//   amountBought: number;
//   // mcap of token in SOL at the moment of buying
//   boughtMcap: number;

//   previousMcap: number;
//   // allowed to sell
//   allowedToSell: boolean;
//   // first buy
//   hadFirstBuy: boolean;
//   // mev
//   meved: boolean;
//   // timestamp for cache expiry
//   timestamp: number;
// }

// const cache = new Map<string, TokenCache>();

// // Maximum cache size (entries)
// const MAX_CACHE_SIZE = 500;
// // Maximum cache age in milliseconds (5 minutes)
// const MAX_CACHE_AGE = 5 * 60 * 1000;

// // Cleanup old cache entries
// function cleanupCache(): void {
//   const now = Date.now();
//   const entriesToDelete: string[] = [];

//   // Remove expired entries
//   for (const [key, value] of cache.entries()) {
//     if (now - value.timestamp > MAX_CACHE_AGE) {
//       entriesToDelete.push(key);
//     }
//   }

//   entriesToDelete.forEach((key) => cache.delete(key));

//   // If still over limit, remove oldest entries
//   if (cache.size > MAX_CACHE_SIZE) {
//     const entries = Array.from(cache.entries()).sort(
//       (a, b) => a[1].timestamp - b[1].timestamp
//     );

//     const toRemove = entries.slice(0, cache.size - MAX_CACHE_SIZE);
//     toRemove.forEach(([key]) => cache.delete(key));
//   }
// }

// // Run cleanup every minute
// setInterval(cleanupCache, 60 * 1000);

// export const setCache = (ca: string, v: TokenCache) => {
//   cache.set(ca, v);

//   // Trigger cleanup if cache is getting large
//   if (cache.size > MAX_CACHE_SIZE * 1.2) {
//     cleanupCache();
//   }

//   return v;
// };

// export const getCache = (ca: string) => {
//   return cache.get(ca);
// };

// export const deleteCache = (ca: string) => {
//   cache.delete(ca);
// };

// export const updateCache = (ca: string, v: Partial<TokenCache>) => {
//   const cached = getCache(ca);
//   if (!cached) {
//     throw new Error("[updateCache] cache not found");
//   }
//   return setCache(ca, { ...cached, ...v });
// };

// export const updateCacheSafe = (ca: string, v: Partial<TokenCache>) => {
//   const cached = getCache(ca);
//   if (!cached) {
//     return;
//   }
//   return setCache(ca, { ...cached, ...v });
// };

// export const MintToCreatorMap = new Map<string, string>();

// export let sessionPublicKey: string | null = null;
// export function setSessionPublicKey(pk: string | null): void {
//   sessionPublicKey = pk;
// }

// export let currentSessionId: string | null = null;
// export function setCurrentSessionId(id: string | null): void {
//   console.log("Setting current session ID:", id);
//   currentSessionId = id;
// }

// // Filter state for DEX types
// export const dexFilters = {
//   pumpfun: true,
//   pumpswap: false,
// };

// export function setDexFilter(
//   dex: "pumpfun" | "pumpswap",
//   enabled: boolean
// ): void {
//   dexFilters[dex] = enabled;
// }

// export function isDexEnabled(dex: string): boolean {
//   if (dex === "pumpfun") return dexFilters.pumpfun;
//   if (dex === "pumpswap" || dex === "raydium") return dexFilters.pumpswap;
//   return false;
// }

// // Auto-buy on creation flag
// export let buyOnCreation = false;
// export function setBuyOnCreation(enabled: boolean): void {
//   buyOnCreation = enabled;
// }

// export let masterWalletBalance = 0;
// export function setMasterWalletBalance(balance: number): void {
//   masterWalletBalance = balance;
// }
