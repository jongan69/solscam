// Function to fetch cielo pnl
export const getPnl = async (wallet: string) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pnl?walletAddress=${wallet}`)
        const data = await response.json()
        return data.usdPnl || 0 // Add fallback to 0 if no pnl returned
    } catch (error) {
        console.error('Error fetching pnl:', error);
        return 0;
    }
}