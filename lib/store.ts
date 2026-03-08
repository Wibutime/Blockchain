import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Transaction {
    sender: string;
    recipient: string;
    amount: number;
    timestamp: number;
}

export interface Block {
    index: number;
    timestamp: number;
    transactions: Transaction[];
    previousHash: string;
    hash: string;
    nonce: number;
}

interface AppState {
    chain: Block[];
    currentUser: string | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    login: (username: string) => void;
    logout: () => void;
    fetchChain: () => Promise<void>;
    addTransaction: (tx: { sender: string; recipient: string; amount: number }) => Promise<void>;
    mineTransactions: (rewardAddress: string, rewardAmount?: number) => Promise<void>;
    getBalanceOfAddress: (address: string) => number;
}

export const useStore = create<AppState>()(
    persist(
        (set, get) => ({
            chain: [],
            currentUser: null,
            isLoading: false,
            error: null,

            login: (username) => set({ currentUser: username }),
            logout: () => set({ currentUser: null }),

            fetchChain: async () => {
                set({ isLoading: true, error: null });
                try {
                    const res = await fetch('/api/blockchain/chain');
                    if (!res.ok) throw new Error('Failed to fetch chain');
                    const data = await res.json();
                    set({ chain: data.chain, isLoading: false });
                } catch (err) {
                    const e = err as Error;
                    set({ error: e.message, isLoading: false });
                }
            },

            addTransaction: async (tx) => {
                set({ isLoading: true, error: null });
                try {
                    const res = await fetch('/api/blockchain/transaction', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(tx),
                    });
                    if (!res.ok) {
                        const data = await res.json();
                        throw new Error(data.message || 'Failed to add transaction');
                    }
                    set({ isLoading: false });
                } catch (err) {
                    const e = err as Error;
                    set({ error: e.message, isLoading: false });
                    throw e; // Re-throw to handle in UI components
                }
            },

            mineTransactions: async (rewardAddress, rewardAmount) => {
                set({ isLoading: true, error: null });
                try {
                    const res = await fetch('/api/blockchain/mine', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ rewardAddress, rewardAmount }),
                    });
                    const data = await res.json();
                    if (!res.ok) throw new Error(data.message || 'Failed to mine');

                    // After mining, fetch the updated chain
                    await get().fetchChain();
                    set({ isLoading: false });
                } catch (err) {
                    const e = err as Error;
                    set({ error: e.message, isLoading: false });
                    throw e;
                }
            },

            getBalanceOfAddress: (address: string) => {
                let balance = 0;
                const { chain } = get();

                for (const block of chain) {
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
        }),
        {
            name: 'ebanking-session',
            storage: createJSONStorage(() => {
                if (typeof window !== 'undefined') {
                    return localStorage;
                }
                return {
                    getItem: () => null,
                    setItem: () => { },
                    removeItem: () => { },
                };
            }),
            partialize: (state) => ({ currentUser: state.currentUser }), // Only persist currentUser
        }
    )
);
