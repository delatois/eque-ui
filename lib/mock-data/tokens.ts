/**
 * Token mock data (TASKS.md 0.9).
 * Token Icon is out of scope (AGENTS.md §1): tokens render as text-badge
 * placeholders showing the ticker, so one deliberately long symbol is
 * included to exercise badge overflow.
 */
export interface Token {
  symbol: string;
  name: string;
  decimals: number;
}

export const mockTokens: Token[] = [
  { symbol: "USDC", name: "USD Coin", decimals: 6 },
  { symbol: "USDT", name: "Tether USD", decimals: 6 },
  { symbol: "DAI", name: "Dai Stablecoin", decimals: 18 },
  { symbol: "WETH", name: "Wrapped Ether", decimals: 18 },
  { symbol: "WBTC", name: "Wrapped Bitcoin", decimals: 8 },
  { symbol: "wstETH", name: "Wrapped Staked Ether", decimals: 18 },
  { symbol: "ARB", name: "Arbitrum", decimals: 18 },
  { symbol: "CRV", name: "Curve DAO Token", decimals: 18 },
  { symbol: "CVX", name: "Convex Token", decimals: 18 },
  { symbol: "SUPERLONG", name: "Super Long Symbol Token", decimals: 18 },
];

export function getMockTokens(): Token[] {
  return [...mockTokens];
}
