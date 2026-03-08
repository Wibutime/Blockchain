'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';

export function WalletConnectButton() {
    return (
        <div className="flex justify-end">
            <ConnectButton showBalance={false} />
        </div>
    );
}
