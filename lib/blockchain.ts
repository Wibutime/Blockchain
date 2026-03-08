import crypto from 'crypto';

export interface Transaction {
    sender: string;
    recipient: string;
    amount: number;
    timestamp: number;
}

export class Block {
    public index: number;
    public timestamp: number;
    public transactions: Transaction[];
    public previousHash: string;
    public hash: string;
    public nonce: number;

    constructor(
        index: number,
        timestamp: number,
        transactions: Transaction[],
        previousHash: string = ''
    ) {
        this.index = index;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }

    calculateHash(): string {
        return crypto
            .createHash('sha256')
            .update(
                this.index +
                this.previousHash +
                this.timestamp +
                JSON.stringify(this.transactions) +
                this.nonce
            )
            .digest('hex');
    }

    mineBlock(difficulty: number) {
        while (
            this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')
        ) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log('Block mined: ' + this.hash);
    }
}

export class Blockchain {
    public chain: Block[];
    public difficulty: number;
    public pendingTransactions: Transaction[];
    public miningReward: number;

    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2; // Keep it low for demo speed
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock(): Block {
        return new Block(0, Date.now(), [], '0');
    }

    getLatestBlock(): Block {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions() {
        const block = new Block(
            this.chain.length,
            Date.now(),
            this.pendingTransactions,
            this.getLatestBlock().hash
        );
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined!');
        this.chain.push(block);

        this.pendingTransactions = [];
    }

    addTransaction(transaction: Transaction) {
        if (!transaction.sender || !transaction.recipient) {
            throw new Error('Transaction must include sender and recipient');
        }
        if (transaction.amount <= 0) {
            throw new Error('Transaction amount must be higher than 0');
        }

        // In a real blockchain, we would sign the transaction here.
        // For this demo, we skip signature verification.

        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address: string): number {
        let balance = 0;

        for (const block of this.chain) {
            for (const trans of block.transactions) {
                if (trans.sender === address) {
                    balance -= trans.amount;
                }

                if (trans.recipient === address) {
                    balance += trans.amount;
                }
            }
        }

        return balance;
    }

    isChainValid(): boolean {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }

    // Restore class instance from JSON object
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromJSON(data: any): Blockchain {
        const blockchain = new Blockchain();
        if (!data) return blockchain;

        blockchain.difficulty = data.difficulty;
        blockchain.miningReward = data.miningReward;
        blockchain.pendingTransactions = data.pendingTransactions;

        // Re-instantiate Blocks
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        blockchain.chain = data.chain.map((blockData: any) => {
            const blk = new Block(
                blockData.index,
                blockData.timestamp,
                blockData.transactions,
                blockData.previousHash
            );
            blk.hash = blockData.hash;
            blk.nonce = blockData.nonce;
            return blk;
        });

        return blockchain;
    }
}
