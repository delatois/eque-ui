import type { Chain } from "./chains";
import { mockChains } from "./chains";
import type { Token } from "./tokens";
import { mockTokens } from "./tokens";

/**
 * Vault mock data (TASKS.md 0.9).
 * Edge cases covered: highest/lowest APY, zero APY, deprecated status,
 * unaudited vault, very long name, very large + very small TVL, LP pair.
 */

export type VaultRisk = "low" | "medium" | "high";
export type VaultStatus = "active" | "deprecated";

export interface Vault {
  id: string;
  name: string;
  /** Primary deposit token; `pairToken` set for LP vaults (stacked badges). */
  depositToken: Token;
  pairToken?: Token;
  /** APY components in percent units (base + reward + boost = total). */
  apyBase: number;
  apyReward: number;
  apyBoost: number;
  /** Total value locked, USD. */
  tvl: number;
  risk: VaultRisk;
  chain: Chain;
  strategy: string;
  status: VaultStatus;
  audited: boolean;
}

function token(symbol: string): Token {
  const found = mockTokens.find((t) => t.symbol === symbol);
  if (!found) throw new Error(`Unknown mock token: ${symbol}`);
  return found;
}

function chain(name: string): Chain {
  const found = mockChains.find((c) => c.name === name);
  if (!found) throw new Error(`Unknown mock chain: ${name}`);
  return found;
}

export const mockVaults: Vault[] = [
  {
    id: "vault-usdc-arbitrum",
    name: "USDC Lending Prime",
    depositToken: token("USDC"),
    apyBase: 8.42,
    apyReward: 3.15,
    apyBoost: 1.2,
    tvl: 48250000,
    risk: "low",
    chain: chain("Arbitrum"),
    strategy: "Aave V3 supply looping",
    status: "active",
    audited: true,
  },
  {
    id: "vault-weth-mainnet",
    name: "WETH Liquid Staking Max",
    depositToken: token("WETH"),
    apyBase: 4.18,
    apyReward: 2.02,
    apyBoost: 0,
    tvl: 128400000,
    risk: "low",
    chain: chain("Ethereum"),
    strategy: "Lido + EigenLayer restaking",
    status: "active",
    audited: true,
  },
  {
    id: "vault-crv-cvx-lp",
    name: "CRV/CVX Concentrated LP",
    depositToken: token("CRV"),
    pairToken: token("CVX"),
    apyBase: 14.9,
    apyReward: 9.75,
    apyBoost: 4.4,
    tvl: 6210000,
    risk: "high",
    chain: chain("Ethereum"),
    strategy: "Convex boosted Curve position",
    status: "active",
    audited: true,
  },
  {
    id: "vault-dai-base",
    name: "DAI Steady Yield",
    depositToken: token("DAI"),
    apyBase: 5.05,
    apyReward: 0.8,
    apyBoost: 0,
    tvl: 31200000,
    risk: "medium",
    chain: chain("Base"),
    strategy: "Moonwell supply + rewards",
    status: "active",
    audited: true,
  },
  {
    id: "vault-usdt-optimism",
    name: "USDT Sunset Pool — This Vault Has A Very Long Name That Tests Truncation And Wrapping Behavior",
    depositToken: token("USDT"),
    apyBase: 0,
    apyReward: 0,
    apyBoost: 0,
    tvl: 184000,
    risk: "medium",
    chain: chain("Optimism"),
    strategy: "Deprecated Sonne market",
    status: "deprecated",
    audited: true,
  },
  {
    id: "vault-arb-volatile",
    name: "ARB Incentive Hunter",
    depositToken: token("ARB"),
    apyBase: 22.6,
    apyReward: 11.35,
    apyBoost: 6.05,
    tvl: 940000,
    risk: "high",
    chain: chain("Arbitrum"),
    strategy: "Experimental leverage loop — unaudited",
    status: "active",
    audited: false,
  },
  {
    id: "vault-wbtc-whale",
    name: "WBTC Institutional Vault",
    depositToken: token("WBTC"),
    apyBase: 1.12,
    apyReward: 0.34,
    apyBoost: 0,
    tvl: 412750000,
    risk: "low",
    chain: chain("Ethereum"),
    strategy: "Fireblocks custodied lending",
    status: "active",
    audited: true,
  },
  {
    id: "vault-micro-dust",
    name: "SUPERLONG Dust Collector",
    depositToken: token("SUPERLONG"),
    apyBase: 0.04,
    apyReward: 0,
    apyBoost: 0,
    tvl: 12.47,
    risk: "high",
    chain: chain("Base"),
    strategy: "Micro-cap farming experiment",
    status: "active",
    audited: false,
  },
];

export function getMockVaults(): Vault[] {
  return [...mockVaults];
}
