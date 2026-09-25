import type { Token } from "./tokens";
import { mockTokens } from "./tokens";

/**
 * Transaction mock data (TASKS.md 0.9).
 * Includes a pending and a failed transaction plus very large / very
 * small amounts to exercise number formatting.
 */

export type TransactionType = "deposit" | "withdraw" | "compound" | "approve";
export type TransactionStatus = "pending" | "success" | "failed";

export interface Transaction {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  token: Token;
  /** Epoch milliseconds. */
  timestamp: number;
  txHash: string;
}

const HOUR = 3_600_000;
const NOW = Date.now();

function token(symbol: string): Token {
  const found = mockTokens.find((t) => t.symbol === symbol);
  if (!found) throw new Error(`Unknown mock token: ${symbol}`);
  return found;
}

export const mockTransactions: Transaction[] = [
  {
    id: "tx-approve-usdc",
    type: "approve",
    status: "success",
    amount: 0,
    token: token("USDC"),
    timestamp: NOW - 26 * HOUR,
    txHash: "0x8f3a1c9d2e4b5a6f708192a3b4c5d6e7f8091a2b3c4d5e6f708192a3b4c5d6e",
  },
  {
    id: "tx-deposit-usdc",
    type: "deposit",
    status: "success",
    amount: 25000,
    token: token("USDC"),
    timestamp: NOW - 25 * HOUR,
    txHash: "0x1a2b3c4d5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f708192a3b4c5d6e7f80",
  },
  {
    id: "tx-compound-weth",
    type: "compound",
    status: "success",
    amount: 0.000042,
    token: token("WETH"),
    timestamp: NOW - 9 * HOUR,
    txHash: "0xdead10cc5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f708192a3b4c5d6e7f81",
  },
  {
    id: "tx-withdraw-dai",
    type: "withdraw",
    status: "failed",
    amount: 1250000.75,
    token: token("DAI"),
    timestamp: NOW - 3 * HOUR,
    txHash: "0xbadf00d15e6f708192a3b4c5d6e7f8091a2b3c4d5e6f708192a3b4c5d6e7f82",
  },
  {
    id: "tx-deposit-wbtc",
    type: "deposit",
    status: "pending",
    amount: 4.25,
    token: token("WBTC"),
    timestamp: NOW - 12 * 60_000,
    txHash: "0xfeedface5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f708192a3b4c5d6e7f83",
  },
];

export function getMockTransactions(): Transaction[] {
  return [...mockTransactions];
}
