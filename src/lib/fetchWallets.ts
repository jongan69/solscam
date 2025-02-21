export async function fetchWallets() {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
        const response = await fetch(`${baseUrl}/api/wallets/get-wallets`);
        const data = await response.json();
        return data.wallets;
    } catch (error) {
        console.error("Error fetching wallets:", error);
        return [];
    }
}