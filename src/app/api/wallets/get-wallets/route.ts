import { NextResponse } from "next/server";
import { mockStatsData, mockTradesData, mockTokenHoldingsData } from "../../../../../mockData";
import { getWallets } from "@/lib/db/fetchWalletsDb";
import { fetchFollowers } from "@/lib/soltrendio/fetchFollowers";
import { getPnl } from "@/lib/fetchPnl";

// Add cache configuration
export const revalidate = 300; // Cache for 5 minutes

export async function GET(request: Request) {
    try {
        // Get the search query from URL parameters
        const { searchParams } = new URL(request.url);
        const searchQuery = searchParams.get('wallet')?.toLowerCase();
        const wallets = await getWallets();
        console.log(wallets)
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
                    fetchFollowers(username),
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
