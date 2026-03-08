'use client';

import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ArrowDown, Loader2 } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export function SwapInterface() {
    const { isConnected } = useAccount();
    const [amountIn, setAmountIn] = useState('');
    const [amountOut, setAmountOut] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success'>('idle');

    const handleAmountInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setAmountIn(val);
        // Mock exchange rate: 1 ETH = 3000 USDC
        if (val && !isNaN(Number(val))) {
            setAmountOut((Number(val) * 3000).toFixed(2));
        } else {
            setAmountOut('');
        }
    };

    const handleSwap = async () => {
        if (!amountIn) return;
        setIsLoading(true);

        // Simulate network request
        setTimeout(() => {
            setIsLoading(false);
            setStatus('success');
            // Reset after 3 seconds
            setTimeout(() => {
                setStatus('idle');
                setAmountIn('');
                setAmountOut('');
            }, 3000);
        }, 2000);
    };

    return (
        <Card className="w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Swap</h2>
                <div className="text-sm text-slate-500">Settings</div>
            </div>

            {/* From Input */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-500">You Pay</label>
                <div className="relative">
                    <Input
                        type="number"
                        placeholder="0.0"
                        value={amountIn}
                        onChange={handleAmountInChange}
                        className="pr-20 text-lg py-6"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-100 rounded-full px-2 py-1 text-sm font-semibold">
                        ETH
                    </div>
                </div>
            </div>

            {/* Arrow Divider */}
            <div className="flex justify-center -my-2 z-10 relative">
                <div className="bg-slate-100 p-2 rounded-full border border-white dark:border-slate-800 dark:bg-slate-800">
                    <ArrowDown className="w-4 h-4 text-slate-500" />
                </div>
            </div>

            {/* To Input */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-500">You Receive</label>
                <div className="relative">
                    <Input
                        type="number"
                        placeholder="0.0"
                        value={amountOut}
                        readOnly
                        className="pr-24 text-lg py-6 bg-slate-50 dark:bg-slate-900"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-100 rounded-full px-2 py-1 text-sm font-semibold">
                        USDC
                    </div>
                </div>
            </div>

            {/* Action Button */}
            <div className="pt-4">
                {!isConnected ? (
                    <div className="w-full flex justify-center">
                        <ConnectButton label="Connect Wallet to Trade" />
                    </div>
                ) : (
                    <Button
                        className="w-full py-6 text-lg"
                        onClick={handleSwap}
                        disabled={!amountIn || isLoading}
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="w-5 h-5 animate-spin" /> Swapping...
                            </span>
                        ) : status === 'success' ? (
                            <span className="text-green-500 font-bold">Swap Successful!</span>
                        ) : (
                            'Swap'
                        )}
                    </Button>
                )}
            </div>

            {status === 'success' && (
                <div className="mt-2 p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm rounded-lg text-center">
                    Transaction confirmed! You received {amountOut} USDC.
                </div>
            )}
        </Card>
    );
}
