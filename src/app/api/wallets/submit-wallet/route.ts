import { connectToDatabase } from "@/lib/connectDb";
import Wallet from "@/lib/schemas/Wallet";

export default async function POST(req: Request) {
  const body = await req.json();
  await connectToDatabase();
  
  const { address, submittedBy, reason } = body;
  if (!address || !submittedBy) return Response.json({ error: "Missing fields" });

  try {
    let wallet = await Wallet.findOne({ address });
    if (!wallet) {
      wallet = await Wallet.create({ address, submittedBy, reason });
    }
    return Response.json(wallet);
  } catch (error) {
    return Response.json({ error: "Database error" });
  }
}
