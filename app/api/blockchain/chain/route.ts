import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { BlockModel } from '@/models/Block';

export async function GET() {
    try {
        await dbConnect();

        // Fetch all blocks sorted by index
        let blocks = await BlockModel.find({}).sort({ index: 1 });

        // If no blocks exist, auto-create the Genesis Block to initialize the network
        if (blocks.length === 0) {
            const genesisBlock = await BlockModel.create({
                index: 0,
                timestamp: Date.now(),
                transactions: [],
                previousHash: "0",
                hash: "0000000000000000000000000000000000000000000000000000000000000000",
                nonce: 0
            });
            blocks = [genesisBlock];
        }

        return NextResponse.json({ chain: blocks }, { status: 200 });

    } catch (e) {
        const error = e as Error;
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// POST endpoint to handle the initialization of Genesis Block if needed
export async function POST(req: Request) {
    try {
        await dbConnect();
        const blockData = await req.json();

        // Ensure genesis doesn't exist
        const genesis = await BlockModel.findOne({ index: 0 });
        if (genesis) {
            return NextResponse.json({ message: 'Genesis block already exists' }, { status: 400 });
        }

        const newBlock = await BlockModel.create(blockData);
        return NextResponse.json({ block: newBlock }, { status: 201 });
    } catch (e) {
        const error = e as Error;
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
