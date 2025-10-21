// export function toSol(n: number | undefined): string {
//   if (typeof n !== "number") return "";
//   return `${n.toFixed(3)} SOL`;
// }

// export function toNum(n: number | undefined): string {
//   if (typeof n !== "number") return "";
//   if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
//   if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
//   if (n >= 1_000) return `${(n / 1_000).toFixed(2)}K`;
//   return `${n}`;
// }

export function formatTokens(n: number | undefined): string {
  if (typeof n !== "number") return "";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(2)}K`;
  return n.toFixed(2);
}

export function formatMcap(n: number | undefined): string {
  if (typeof n !== "number") return "";
  const abs = Math.abs(n);
  let unit = "";
  let v = n;
  if (abs >= 1_000_000_000_000) {
    v = n / 1_000_000_000_000;
    unit = "T";
  } else if (abs >= 1_000_000_000) {
    v = n / 1_000_000_000;
    unit = "B";
  } else if (abs >= 1_000_000) {
    v = n / 1_000_000;
    unit = "M";
  } else if (abs >= 1_000) {
    v = n / 1_000;
    unit = "K";
  }

  return `${v.toFixed(2)}${unit}`;
}

export function shortenAddress(
  addr: string | undefined,
  head = 2,
  tail = 2
): string {
  if (!addr) return "";
  if (addr.length <= head + tail) return addr;
  return `${addr.slice(0, head)}..${addr.slice(-tail)}`;
}

export function firstChars(text: string | undefined, n = 6): string {
  if (!text) return "";
  return text.slice(0, n);
}

export function solscanTx(signature: string): string {
  return `https://solscan.io/tx/${signature}`;
}

export function solscanAccount(address: string): string {
  return `https://solscan.io/account/${address}`;
}

export function formatToken(mint: string): string {
  return `https://jup.ag/tokens/${mint}`;
}

export function solscanSlot(slot: number): string {
  return `https://solscan.io/block/${slot}`;
}
