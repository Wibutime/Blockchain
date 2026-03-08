import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { BlockModel, TransactionModel } from '@/models/Block';
import crypto from 'crypto';

function calculateHash(index: number, previousHash: string, timestamp: number, transactions: any[], nonce: number): string {
    return crypto.createHash('sha256')
        .update(index + previousHash + timestamp + JSON.stringify(transactions) + nonce)
        .digest('hex');
}

export async function POST(req: Request) {
    try {
        const { rewardAddress, rewardAmount } = await req.json();

        if (!rewardAddress) {
            return NextResponse.json({ message: 'Miner reward address is required' }, { status: 400 });
        }

        await dbConnect();

        // 1. Get all pending transactions
        const pendingTxs = await TransactionModel.find({});

        // Convert mongoose documents to plain objects
        const txsToMine = pendingTxs.map(tx => ({
            sender: tx.sender,
            recipient: tx.recipient,
            amount: tx.amount,
            timestamp: tx.timestamp
        }));

        // 2. Add Mining Reward Transaction
        const finalRewardAmount = rewardAmount !== undefined ? rewardAmount : 10;
        txsToMine.push({
            sender: 'SYSTEM',
            recipient: rewardAddress,
            amount: finalRewardAmount,
            timestamp: Date.now()
        });

        // 3. Get latest block to find previousHash and index
        const latestBlock = await BlockModel.findOne().sort({ index: -1 });

        if (!latestBlock) {
            return NextResponse.json({ message: 'Blockchain not initialized (No Genesis block found)' }, { status: 400 });
        }

        const newIndex = latestBlock.index + 1;
        const previousHash = latestBlock.hash;
        const timestamp = Date.now();
        let nonce = 0;
        let diff = 3; // Fixed difficulty for demo
        let hash = calculateHash(newIndex, previousHash, timestamp, txsToMine, nonce);

        // Simple Proof of Work
        while (hash.substring(0, diff) !== Array(diff + 1).join("0")) {
            nonce++;
            hash = calculateHash(newIndex, previousHash, timestamp, txsToMine, nonce);
        }

        // 4. Create New Block
        const newBlock = await BlockModel.create({
            index: newIndex,
            timestamp,
            transactions: txsToMine,
            previousHash,
            hash,
            nonce
        });

        // 5. Clear Pending Transactions
        await TransactionModel.deleteMany({});

        return NextResponse.json({
            message: 'Block mined successfully',
            block: newBlock
        }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
