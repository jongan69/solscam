import Wallet from "../schemas/Wallet";
import { connectToDatabase } from "./connectDb";

interface WalletDoc {
    wallet: string;
    userName: string;
    xHandle: string;
    _id: unknown;
    __v: number;
}

export const getWallets = async (): Promise<WalletDoc[]> => {
    await connectToDatabase();
    try {
        const wallets = await Wallet.find({}).lean();
        return wallets as WalletDoc[];
    } catch (error) {
        console.error('Error fetching wallets:', error);
        return [];
    }
}