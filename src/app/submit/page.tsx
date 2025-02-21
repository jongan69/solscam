"use client"
import { useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";

export default function SubmitWallet() {
  const { publicKey } = useWallet();
  const [address, setAddress] = useState("");
  const [reason, setReason] = useState("");
  const [twitterHandle, setTwitterHandle] = useState("");

  const submitWallet = async () => {
    if (!publicKey) return alert("Connect wallet first");

    const res = await fetch("/api/submit-wallet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address, submittedBy: publicKey.toBase58(), reason, twitterHandle }),
    });
    
    const data = await res.json();
    alert(data.error || "Wallet submitted!");
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Submit a Scammer Wallet</h2>
      <input className="border p-2 my-2 w-full" 
        placeholder="Scammer Wallet Address" 
        value={address} 
        onChange={(e) => setAddress(e.target.value)} />
      <textarea className="border p-2 my-2 w-full" 
        placeholder="Reason (optional)" 
        value={reason} 
        onChange={(e) => setReason(e.target.value)} />
      <input className="border p-2 my-2 w-full" 
        placeholder="Twitter Handle (optional)" 
        value={twitterHandle} 
        onChange={(e) => setTwitterHandle(e.target.value)} />
      <button onClick={submitWallet} className="bg-red-500 text-white p-2 rounded">
        Submit
      </button>
    </div>
  );
}
