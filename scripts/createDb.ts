import { connectToDatabase } from '../src/lib/connectDb';
import { tradersData } from '../traders'; // Adjust the path as necessary

const main = async () => {
    const client = await connectToDatabase();
    const db = client.db('solscam'); // Replace with your database name
    const collection = db.collection('wallets'); // Replace with your collection name

    // Insert traders data
    await collection.insertMany(tradersData);

    console.log('Traders data has been successfully copied to MongoDB.');

    await client.close();
};

main().catch(console.error);
