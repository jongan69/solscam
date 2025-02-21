import mongoose from 'mongoose';

const WalletSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  address: { type: String, required: true, unique: true },
  profilePic: { type: String, required: true },
  xHandle: { type: String, required: true },
  userName: { type: String, required: true },
  status: { type: String, required: true, enum: ['active', 'inactive'] },
  submittedBy: { type: String, required: true }, // Solana wallet of submitter
  reason: { type: String },
  votes: {
    scammer: { type: Number, default: 0 },
    notScammer: { type: Number, default: 0 }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Wallet || mongoose.model('Wallet', WalletSchema);
