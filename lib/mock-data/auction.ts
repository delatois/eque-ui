/**
 * Auction mock data (bonus). Values are illustrative only.
 */
import type {
  EpochBid,
  PastEpoch,
} from "@/components/organisms/LiveEpochPanel";

const BIDDERS = [
  "0x7a3f9c1d2e5b8a4f6c9d2e5b8a4f6c9d2e5b8a4f6c9d2e5b8a4f6c9d2e5b8a",
  "0x1b2e5f8a4c7d9e2f5a8b4c7d9e2f5a8b4c7d9e2f5a8b4c7d9e2f5a8b4c7d9e",
  "0x9c4d7f2a5e8b1c4d7f2a5e8b1c4d7f2a5e8b1c4d7f2a5e8b1c4d7f2a5e8b1c",
  "0x3e6a9c2f5b8d1e4a7c9e2f5b8d1e4a7c9e2f5b8d1e4a7c9e2f5b8d1e4a7c9e",
  "0x5f8b2e4a7c9d1f3a6b8d2e4a7c9d1f3a6b8d2e4a7c9d1f3a6b8d2e4a7c9d1f",
];

/** 5 bids, highest first (TASKS.md bonus). */
export const mockEpochBids: EpochBid[] = [
  { bidder: BIDDERS[0], amount: 0.2841 },
  { bidder: BIDDERS[1], amount: 0.2719 },
  { bidder: BIDDERS[2], amount: 0.2603 },
  { bidder: BIDDERS[3], amount: 0.2487 },
  { bidder: BIDDERS[4], amount: 0.2315 },
];

/** Past epochs premium summary, newest first (TASKS.md bonus). */
export const mockPastEpochs: PastEpoch[] = [
  { epoch: 47, premium: 412.5 },
  { epoch: 46, premium: 388.2 },
  { epoch: 45, premium: 401.75 },
  { epoch: 44, premium: 365.0 },
];
