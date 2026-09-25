/**
 * Chain mock data (TASKS.md 0.9).
 * Network/Chain Icon is out of scope (AGENTS.md §1): chains render as
 * text labels/badges, never icons.
 */
export interface Chain {
  id: number;
  name: string;
}

export const mockChains: Chain[] = [
  { id: 1, name: "Ethereum" },
  { id: 42161, name: "Arbitrum" },
  { id: 10, name: "Optimism" },
  { id: 8453, name: "Base" },
];

export function getMockChains(): Chain[] {
  return [...mockChains];
}
