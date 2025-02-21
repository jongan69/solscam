import { connectToDatabase } from "@/lib/connectDb";
import Wallet from "@/lib/schemas/Wallet";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    
    const { address, vote } = await req.json();
    if (!address || !["scammer", "notScammer"].includes(vote)) {
      return NextResponse.json({ error: "Invalid vote" }, { status: 400 });
    }

    const wallet = await Wallet.findOneAndUpdate(
      { address },
      { $inc: { [`votes.${vote}`]: 1 } },
      { 
        new: true,
        maxTimeMS: 5000 // Set operation timeout to 5 seconds
      }
    );
    
    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    return NextResponse.json(wallet);
  } catch (error) {
    console.error("Vote error:", error);
    
    // Handle specific MongoDB errors
    if (error instanceof Error && error.name === 'MongooseError') {
      return NextResponse.json(
        { error: "Database connection error. Please try again." },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    // Optionally close the connection if it's causing issues
    // await mongoose.connection.close();
  }
}
