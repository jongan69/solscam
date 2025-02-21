import Wallet from "../schemas/Wallet";
import { connectToDatabase } from "./connectDb";

export const getWallets = async () => {
    await connectToDatabase();
    try {
        const wallets = await Wallet.find({}).lean();
        return wallets;
    } catch (error) {
        console.error('Error fetching wallets:', error);
        return [];
    }
}