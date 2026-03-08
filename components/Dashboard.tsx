'use client';

import { useState, useEffect, useRef } from 'react';
import { useStore } from '@/lib/store';
import { Transaction } from '@/lib/blockchain';
import Toast from '@/components/ui/Toast';
import Link from 'next/link';

export default function Dashboard() {
    const { chain, currentUser, logout, getBalanceOfAddress, addTransaction, mineTransactions, fetchChain, isLoading, error } = useStore();
    const [depositAmount, setDepositAmount] = useState('');
    const [transferAmount, setTransferAmount] = useState('');
    const [recipient, setRecipient] = useState('');
    const [notification, setNotification] = useState<string | null>(null);
    const [showDepositInput, setShowDepositInput] = useState(false);

    // Initial load
    useEffect(() => {
        fetchChain();
    }, [fetchChain]);

    // Calculate balance dynamically
    const balance = currentUser ? getBalanceOfAddress(currentUser) : 0;

    // Use ref to track previous balance for notifications
    const prevBalanceRef = useRef(balance);

    useEffect(() => {
        if (balance > prevBalanceRef.current) {
            const diff = balance - prevBalanceRef.current;
            setNotification(`Bạn vừa nhận được $${diff.toLocaleString('en-US')}`);
        }
        prevBalanceRef.current = balance;
    }, [balance]);

    // Get Transaction History
    const history: { tx: Transaction, time: number, type: 'send' | 'receive' | 'mint' }[] = [];
    chain.forEach(block => {
        block.transactions.forEach(tx => {
            if (tx.sender === currentUser) {
                history.push({ tx, time: block.timestamp, type: 'send' });
            } else if (tx.recipient === currentUser) {
                history.push({ tx, time: block.timestamp, type: tx.sender === 'SYSTEM' ? 'mint' : 'receive' });
            }
        });
    });
    // Sort by newest
    history.sort((a, b) => b.time - a.time);

    const handleDeposit = async () => {
        const val = parseInt(depositAmount, 10);
        if (!currentUser || isNaN(val) || val <= 0) return;

        try {
            await mineTransactions(currentUser, val);
            setDepositAmount('');
            setNotification('Đã xin cấp vốn thành công!');
        } catch (e: any) {
            setNotification(e.message || 'Error occurred');
        }
    };

    const handleTransfer = async () => {
        const val = parseInt(transferAmount, 10);
        if (!currentUser || isNaN(val) || val <= 0 || !recipient) return;

        if (balance < val) {
            setNotification('Số dư không đủ để thực hiện giao dịch');
            return;
        }

        try {
            await addTransaction({
                sender: currentUser,
                recipient: recipient,
                amount: val
            });
            // Mine immediately for instant feedback
            await mineTransactions(currentUser);

            setTransferAmount('');
            setRecipient('');
            setNotification('Chuyển khoản thành công!');
        } catch (e: any) {
            setNotification(e.message || 'Error occurred');
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0f1c] text-slate-200 font-sans selection:bg-blue-500/30">
            {/* Animated Background Mesh */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full mix-blend-screen filter blur-[120px] animate-blob" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-2000" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
            </div>

            {notification && <Toast message={notification} onClose={() => setNotification(null)} />}

            {/* Floating Navbar */}
            <header className="fixed top-0 inset-x-0 z-50 p-4 md:p-6 pb-0 pointer-events-none">
                <div className="pointer-events-auto mx-auto max-w-6xl backdrop-blur-xl bg-slate-900/40 border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-white/10 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                            <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Test-Banking</span>
                    </div>

                    <nav className="hidden md:flex items-center gap-1 bg-slate-950/50 p-1 rounded-xl border border-white/5">
                        <Link href="/" className="px-4 py-2 text-sm font-medium bg-white/10 text-white rounded-lg shadow-sm border border-white/5 transition-all">
                            Tổng quan
                        </Link>
                        <Link href="/ledger" className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                            Check hàng hash

                        </Link>
                    </nav>

                    <div className="flex items-center gap-4">

                        <button onClick={logout} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all" title="Secure Logout">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 pt-32 pb-16 px-4 md:px-6">
                <div className="max-w-6xl mx-auto space-y-8">
                    {/* Welcome Banner */}
                    <div className="flex flex-col justify-start gap-1 mb-8">

                        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight flex items-center gap-3">
                            Tài khoản: <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">{currentUser}</span>
                        </h1>
                    </div>

                    {/* Top Cards Row */}
                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Balance Card - Takes 2 cols */}
                        <div className="md:col-span-2 relative overflow-hidden backdrop-blur-xl bg-slate-900/40 border border-white/10 rounded-3xl p-8 shadow-2xl group">
                            <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] group-hover:bg-blue-400/30 transition-colors duration-500 pointer-events-none"></div>

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">Số dư USD hiện có</p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-5xl md:text-6xl font-bold tracking-tight text-white drop-shadow-md">
                                                ${balance.toLocaleString('en-US')}
                                            </span>
                                            <span className="text-xl text-blue-400 font-semibold">USD</span>
                                        </div>
                                    </div>
                                    <div className="w-12 h-8 rounded-md bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md">
                                        <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="px-4 py-2 bg-slate-950/50 rounded-lg border border-white/5 font-mono text-sm text-slate-300 flex items-center gap-2">
                                        <span className="text-slate-500">Người dùng:</span>
                                        {currentUser}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Action - Deposit */}
                        <div className="backdrop-blur-xl bg-slate-900/40 border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col relative overflow-hidden group">
                            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-[50px] pointer-events-none"></div>

                            <div className="relative z-10 flex-1 flex flex-col">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)] group-hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-shadow">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                    </div>
                                    <h3 className="font-semibold text-white">Test Thử Nghiệm</h3>
                                </div>
                                <p className="text-xs text-slate-400 mb-6 font-medium leading-relaxed">
                                    Giả lập một giao dịch nạp tiền USD từ kho bạc hệ thống vào ví của bạn.
                                </p>

                                <div className="space-y-4 mt-auto">
                                    {!showDepositInput ? (
                                        <button
                                            onClick={() => setShowDepositInput(true)}
                                            className="w-full py-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/50 rounded-xl font-semibold transition-all shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] flex justify-center items-center gap-2"
                                        >
                                            Nạp Tiền
                                        </button>
                                    ) : (
                                        <div className="space-y-3">
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <span className="text-slate-500 font-medium">$</span>
                                                </div>
                                                <input
                                                    type="number"
                                                    value={depositAmount}
                                                    onChange={(e) => setDepositAmount(e.target.value)}
                                                    placeholder="0"
                                                    className="w-full pl-8 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all font-mono shadow-inner"
                                                    autoFocus
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        setShowDepositInput(false);
                                                        setDepositAmount('');
                                                    }}
                                                    className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold transition-colors"
                                                >
                                                    Hủy
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        handleDeposit();
                                                        setShowDepositInput(false);
                                                    }}
                                                    className="flex-1 py-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/50 rounded-xl font-semibold transition-all shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                                                >
                                                    Xác Nhận
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Transfer Form (Left Col) */}
                        <div className="lg:col-span-1">
                            <div className="backdrop-blur-xl bg-slate-900/40 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden h-full">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[60px] pointer-events-none"></div>

                                <h2 className="text-xl font-bold mb-8 text-white flex items-center gap-3">
                                    <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg border border-indigo-500/30">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                                    </div>
                                    Nhập chuyển khoản mới
                                </h2>

                                <div className="space-y-6 relative z-10">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                            Địa chỉ Ví nhận
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                                            </div>
                                            <input
                                                type="text"
                                                value={recipient}
                                                onChange={(e) => setRecipient(e.target.value)}
                                                className="w-full pl-11 pr-4 py-3.5 bg-slate-950/50 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all font-mono text-sm shadow-inner"
                                                placeholder="Nhập Tên"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                            Số lượng USD
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <span className="text-slate-500 font-medium">$</span>
                                            </div>
                                            <input
                                                type="number"
                                                value={transferAmount}
                                                onChange={(e) => setTransferAmount(e.target.value)}
                                                className="w-full pl-8 pr-16 py-3.5 bg-slate-950/50 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-lg font-mono font-bold shadow-inner"
                                                placeholder="0"
                                            />
                                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                                <span className="text-slate-500 text-sm font-semibold">USD</span>
                                            </div>
                                        </div>
                                    </div>



                                    <button
                                        onClick={handleTransfer}
                                        className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 p-[1px] font-semibold text-white shadow-[0_0_20px_rgba(79,70,229,0.2)] hover:shadow-[0_0_25px_rgba(124,58,237,0.4)] transition-all duration-300 group mt-4"
                                    >
                                        <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                        <div className="relative flex items-center justify-center gap-2 bg-slate-900/40 backdrop-blur-sm px-6 py-4 rounded-xl group-hover:bg-transparent transition-all duration-300">
                                            Gửi
                                            <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Transaction History (Right Col) */}
                        <div className="lg:col-span-2">
                            <div className="backdrop-blur-xl bg-slate-900/40 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl h-full flex flex-col">
                                <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
                                    <div>
                                        <h2 className="text-xl font-bold text-white mb-1">Hoạt động gần đây</h2>
                                        <p className="text-xs text-slate-400 font-medium">Lịch sử giao dịch trên mạng lưới</p>
                                    </div>
                                    <Link href="/ledger" className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-wider flex items-center gap-1">
                                        Mở Trình duyệt check
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                    </Link>
                                </div>

                                <div className="overflow-x-auto flex-1">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr>
                                                <th className="pb-4 text-[10px] uppercase tracking-widest font-semibold text-slate-500 whitespace-nowrap">Loại Giao Dịch</th>
                                                <th className="pb-4 text-[10px] uppercase tracking-widest font-semibold text-slate-500 whitespace-nowrap">Phía Đối Tác</th>
                                                <th className="pb-4 text-[10px] uppercase tracking-widest font-semibold text-slate-500 text-right whitespace-nowrap">Giá trị (USD)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {history.length === 0 ? (
                                                <tr>
                                                    <td colSpan={3} className="py-12 text-center">
                                                        <div className="flex flex-col items-center justify-center text-slate-500">
                                                            <div className="w-16 h-16 rounded-full bg-slate-800/50 border border-white/5 flex items-center justify-center mb-4">
                                                                <svg className="w-8 h-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                                            </div>
                                                            <p className="font-medium text-sm">Chưa có giao dịch</p>
                                                            <p className="text-xs mt-1 opacity-70">Thực hiện nạp tiền hoặc chuyển tiền để ghi nhận vào sổ cái.</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                history.map((item, i) => (
                                                    <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                                                        <td className="py-4 pr-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${item.type === 'mint' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                                    item.type === 'receive' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                                        'bg-violet-500/10 text-violet-400 border-violet-500/20'
                                                                    }`}>
                                                                    {item.type === 'send' ? (
                                                                        <svg className="w-5 h-5 -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                                                                    ) : (
                                                                        <svg className="w-5 h-5 rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <p className="font-semibold text-slate-200 text-sm">
                                                                        {item.type === 'mint' ? 'Hệ Thống' :
                                                                            item.type === 'receive' ? 'Tiền Nhận Vào' : 'Tiền Chuyển Đi'}
                                                                    </p>
                                                                    <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                                                                        {new Date(item.time).toLocaleString('vi-VN', {
                                                                            hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric'
                                                                        })}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-2">
                                                            {item.type === 'send' ? (
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-xs text-slate-500 uppercase tracking-wider">Tới</span>
                                                                    <span className="font-mono text-xs text-slate-300 bg-slate-950/50 px-2 py-1 rounded border border-white/5 truncate max-w-[150px]">{item.tx.recipient}</span>
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-xs text-slate-500 uppercase tracking-wider">Từ</span>
                                                                    <span className="font-mono text-xs text-slate-300 bg-slate-950/50 px-2 py-1 rounded border border-white/5 truncate max-w-[150px]">{item.tx.sender === 'SYSTEM' ? 'System' : item.tx.sender}</span>
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="py-4 pl-4 text-right">
                                                            <span className={`font-bold font-mono text-base tracking-tight ${item.type === 'send' ? 'text-slate-200' : 'text-emerald-400'
                                                                }`}>
                                                                {item.type === 'send' ? '-' : '+'}${item.tx.amount.toLocaleString('en-US')}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
