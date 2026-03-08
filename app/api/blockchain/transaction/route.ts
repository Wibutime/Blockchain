import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { TransactionModel } from '@/models/Block';

export async function POST(req: Request) {
    try {
        const txData = await req.json();

        if (!txData.sender || !txData.recipient || typeof txData.amount !== 'number') {
            return NextResponse.json({ message: 'Invalid transaction data' }, { status: 400 });
        }

        if (txData.amount <= 0) {
            return NextResponse.json({ message: 'Amount must be greater than 0' }, { status: 400 });
        }

        await dbConnect();

        // In a real blockchain, transactions are kept in a Mempool (Pending pool)
        // Here we can save it to a PendingTransaction collection or handle it simply.
        // For our simplification, we will add it directly using a new model: PendingTransaction
        const tx = await TransactionModel.create(txData);

        return NextResponse.json({
            message: 'Transaction added to pending pool',
            transaction: tx
        }, { status: 201 });

    } catch (e) {
        const error = e as Error;
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// GET all pending transactions
export async function GET() {
    try {
        await dbConnect();
        const pendingTxs = await TransactionModel.find({});
        return NextResponse.json({ transactions: pendingTxs }, { status: 200 });
    } catch (e) {
        const error = e as Error;
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
