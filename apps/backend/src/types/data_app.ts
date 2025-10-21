import { Elysia, t } from "elysia";

const CreationMessage = t.Object({
  signature: t.String(),
  eventType: t.Literal("creation"),
  dex: t.Literal("pumpfun"),
  slot: t.Number(),
  name: t.String(),
  symbol: t.String(),
  uri: t.String(),
  mintAddress: t.String(),
  userAddress: t.String(),
  bondingCurveAddress: t.String(),
  creatorAddress: t.String(),
});

export type CreationMessage = typeof CreationMessage.static;

const CurveSwapMessage = t.Object({
  signature: t.String(),
  eventType: t.Union([t.Literal("sell"), t.Literal("buy")]),
  dex: t.Literal("pumpfun"),
  slot: t.Number(),
  mintAddress: t.String(),
  userAddress: t.String(),
  bondingCurveAddress: t.String(),
  creatorAddress: t.String(),
  swapTokenAmount: t.Number(),
  swapSolAmount: t.Number(),
  virtualTokenAmount: t.Number(),
  virtualSolAmount: t.Number(),
  marketCap: t.Number(),
  userTokenBalance: t.Number(),
});

export type CurveSwapMessage = typeof CurveSwapMessage.static;

const AMMSwapMessage = t.Object({
  signature: t.String(),
  eventType: t.Union([t.Literal("sell"), t.Literal("buy")]),
  dex: t.Literal("pumpswap"),
  slot: t.Number(),
  mintAddress: t.String(),
  userAddress: t.String(),
  swapTokenAmount: t.Number(),
  swapSolAmount: t.Number(),
  poolTokenAmount: t.Number(),
  poolSolAmount: t.Number(),
  fdv: t.Number(),
});

export type AMMSwapMessage = typeof AMMSwapMessage.static;

const MigrationMessage = t.Object({
  signature: t.String(),
  eventType: t.Literal("migration"),
  dex: t.Literal("pumpfun"),
  slot: t.Number(),
  mintAddress: t.String(),
});

export type MigrationMessage = typeof MigrationMessage.static;

const ResponseMessage = t.Union([
  CreationMessage,
  CurveSwapMessage,
  AMMSwapMessage,
  MigrationMessage,
]);

export type ResponseMessage = typeof ResponseMessage.static;

const fake_data = new Elysia().ws("/ws", {
  response: ResponseMessage,
});

export type Data = typeof fake_data;
