'use client';

import { Card } from '@/components/ui/Card';
import { ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';

const MOCK_HISTORY = [
    { id: 1, type: 'swap', from: 'ETH', to: 'USDC', amountIn: '0.5', amountOut: '1500.00', date: '2 mins ago', status: 'Completed' },
    { id: 2, type: 'swap', from: 'USDC', to: 'ETH', amountIn: '500.00', amountOut: '0.16', date: '1 hour ago', status: 'Completed' },
    { id: 3, type: 'approve', token: 'USDC', date: '5 hours ago', status: 'Completed' },
];

export function TransactionHistory() {
    return (
        <Card className="w-full max-w-md p-6">
            <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-slate-500" />
                <h3 className="font-semibold text-lg">Recent Transactions</h3>
            </div>

            <div className="space-y-4">
                {MOCK_HISTORY.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                                {tx.type === 'swap' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                            </div>
                            <div>
                                <div className="font-medium text-sm">
                                    {tx.type === 'swap' ? `Swap ${tx.from} to ${tx.to}` : `Approve ${tx.token}`}
                                </div>
                                <div className="text-xs text-slate-500">{tx.date}</div>
                            </div>
                        </div>
                        <div className="text-right">
                            {tx.type === 'swap' && (
                                <div className="font-medium text-sm">
                                    -{tx.amountIn} {tx.from}
                                </div>
                            )}
                            <div className="text-xs text-green-600">
                                {tx.status}
                            </div>
                        </div>
                    </div>
                ))}
                {MOCK_HISTORY.length === 0 && (
                    <div className="text-center text-slate-500 py-4">No transactions yet</div>
                )}
            </div>
        </Card>
    );
}
