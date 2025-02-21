import { connectToDatabase } from './db/connectDb';
import Wallet from './schemas/Wallet';

interface TwitterCredentials {
  accessToken: string;
  accessTokenSecret: string;
  userId: string;
  screenName: string;
}

export async function saveTwitterCredentials(walletAddress: string, credentials: TwitterCredentials) {
  try {
    await connectToDatabase();
    // const database = client.db('potionUsers'); 
    // const wallets = database.collection('twitterAuth');

    // Update the wallet document with Twitter credentials
    await Wallet.updateOne(
      { address: walletAddress },
      {
        $set: {
          twitter: {
            accessToken: credentials.accessToken,
            accessTokenSecret: credentials.accessTokenSecret,
            userId: credentials.userId,
            screenName: credentials.screenName,
            linkedAt: new Date()
          }
        }
      },
      { upsert: true }
    );

  } catch (error) {
    console.error('Error saving Twitter credentials:', error);
    throw error;
  }
}

export async function getTwitterCredentials(walletAddress: string) {
  try {
    await connectToDatabase();
    // const database = client.db('walletAnalyzer');
    // const wallets = database.collection('wallets');

    const wallet = await Wallet.findOne({ address: walletAddress });
    return wallet?.twitter || null;

  } catch (error) {
    console.error('Error getting Twitter credentials:', error);
    throw error;
  }
}