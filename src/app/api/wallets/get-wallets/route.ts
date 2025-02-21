import { NextResponse } from "next/server";

// replace with mongodb call
// import { tradersData } from "../../../../../traders";
import { mockStatsData, mockTradesData, mockTokenHoldingsData } from "../../../../../mockData";
import { getWallets } from "@/lib/db/fetchWalletsDb";
// Add cache configuration
export const revalidate = 300; // Cache for 5 minutes


// Function to fetch twitter followers
const getTwitterFollowers = async (username: string) => {
    try {
        const response = await fetch('https://soltrendio.com/api/premium/twitter-followers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username })
        })
        if (!response.ok) return 0;
        const data = await response.json()
        return data || 0 // Add fallback to 0 if no followers returned
    } catch (error) {
        console.error('Error fetching followers:', error);
        return 0;
    }
}

// Function to fetch cielo pnl
const getPnl = async (wallet: string) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pnl?walletAddress=${wallet}`)
        const data = await response.json()
        return data.usdPnl || 0 // Add fallback to 0 if no pnl returned
    } catch (error) {
        console.error('Error fetching pnl:', error);
        return 0;
    }
}

export async function GET(request: Request) {
    try {
        // Get the search query from URL parameters
        const { searchParams } = new URL(request.url);
        const searchQuery = searchParams.get('wallet')?.toLowerCase();
        const wallets = await getWallets();
        // Filter traders if search query exists
        const tradersToProcess = searchQuery
            ? wallets.filter(wallet => wallet.wallet.toLowerCase() === searchQuery)
            : wallets;

        // If searching and no trader found, return 404
        if (searchQuery && tradersToProcess.length === 0) {
            return NextResponse.json(
                { message: 'Wallet not found' },
                { status: 404 }
            );
        }

        // Fetch followers and PNL for filtered traders
        const usersWithData = await Promise.all(
            tradersToProcess.map(async (trader) => {
                const username = trader.xHandle.replace('@', '')
                const [followers, pnl] = await Promise.all([
                    getTwitterFollowers(username),
                    getPnl(trader.wallet)
                ])
                console.log(username, followers, pnl)
                return {
                    ...trader,
                    followers,
                    pnl,
                    ...mockStatsData,
                    trades: mockTradesData,
                    tokenHoldings: mockTokenHoldingsData
                }
            })
        )

        // Add cache-control header to the response
        const response = NextResponse.json({
            wallets: usersWithData
        }, {
            status: 200,
            headers: {
                'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=599'
            }
        });

        return response;
    } catch (error: unknown) {
        console.error('Error fetching wallets:', error);
        const errorResponse = NextResponse.json({
            wallets: []
        }, {
            status: 500,
            headers: {
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=119'
            }
        });

        return errorResponse;
    }
}
