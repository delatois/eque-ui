/**
 * Mock wallet provider data (TASKS.md 3.1).
 * Plain labeled rows — no provider brand icons, per the exclusion rule
 * (AGENTS.md §1); the UI renders a generic glyph instead.
 */

export interface WalletProvider {
  /** Stable id. */
  id: string;
  /** Display name, e.g. "MetaMask". */
  name: string;
  /** One-line description shown under the name. */
  description: string;
}

export const mockWalletProviders: WalletProvider[] = [
  {
    id: "metamask",
    name: "MetaMask",
    description: "Browser extension & mobile app",
  },
  {
    id: "walletconnect",
    name: "WalletConnect",
    description: "Scan with any mobile wallet",
  },
  {
    id: "coinbase",
    name: "Coinbase Wallet",
    description: "Browser extension & smart wallet",
  },
];
