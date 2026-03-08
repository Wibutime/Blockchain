import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
    sender: { type: String, required: true },
    recipient: { type: String, required: true },
    amount: { type: Number, required: true },
    timestamp: { type: Number, required: true, default: Date.now }
});

const BlockSchema = new mongoose.Schema({
    index: { type: Number, required: true },
    timestamp: { type: Number, required: true, default: Date.now },
    transactions: [TransactionSchema],
    previousHash: { type: String, required: true },
    hash: { type: String, required: true },
    nonce: { type: Number, required: true }
});

export const TransactionModel = mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);
export const BlockModel = mongoose.models.Block || mongoose.model('Block', BlockSchema);
