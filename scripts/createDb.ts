import { connectToDatabase } from '../src/lib/db/connectDb';
import { tradersData } from '../traders'; // Adjust the path as necessary
import Wallet from '../src/lib/schemas/Wallet';

const main = async () => {
    await connectToDatabase();

    // Insert traders data
    await Wallet.insertMany(tradersData);
    console.log('Traders data has been successfully copied to MongoDB.');

};

main().catch(console.error);
