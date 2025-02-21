export type User = {
    name?: string
    profileImage?: string
    xHandle?: string
    lastTradeTime?: string
    tokenCount: number
    winRate: number
    trades: number
    averageBuy: number
    averageEntry: number
    averageHoldTime: string
    totalInvested: number
    roi: number
    realizedPnl: number
    followers: number
    pnl: number
}

export async function fetchUser(walletAddress: string) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wallets/get-wallets?wallet=${walletAddress}`);
        if (!response.ok) {
            console.error('Failed to fetch user');
            return null;
        }
        const data = await response.json();
        // Should add logic to return the highest scam score wallet
        return data.wallets[0];
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
}