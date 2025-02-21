export type Wallet = {
  profilePic: string;
  address: string;
  xHandle: string;
  userName: string;
  followers: number;
  following: number;
  tokenCount: number;
  winRate: number;
  trades: { buys: number; sells: number };
  votes?: {
    scammer: number;
    notScammer: number;
  }
  avgBuy: number;
  avgSell: number;
  scamScore: number;
};