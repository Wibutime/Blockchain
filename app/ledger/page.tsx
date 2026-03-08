'use client';
import { useStore } from '@/lib/store';
import Link from 'next/link';
import { useEffect } from 'react';

export default function LedgerPage() {
    const { chain, currentUser, logout, fetchChain, isLoading } = useStore();

    useEffect(() => {
        fetchChain();
    }, [fetchChain]);

    if (!currentUser) return (
        <div className="flex min-h-screen items-center justify-center p-8 bg-[#0a0f1c] relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
            <Link href="/" className="relative z-10 px-6 py-3 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-xl hover:bg-blue-600/30 transition-colors backdrop-blur-md">Quay lại Đăng nhập</Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0a0f1c] text-slate-200 font-sans selection:bg-blue-500/30">
            {/* Animated Background Mesh */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-1/2 left-1/4 w-[40%] h-[40%] bg-blue-600/10 rounded-full mix-blend-screen filter blur-[120px] animate-blob" />
                <div className="absolute bottom-[-10%] right-[10%] w-[30%] h-[30%] bg-violet-600/10 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-4000" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-10" />
            </div>

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
                        <Link href="/" className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                            Tổng quan
                        </Link>
                        <Link href="/ledger" className="px-4 py-2 text-sm font-medium bg-white/10 text-white rounded-lg shadow-sm border border-white/5 transition-all">
                            Các blockchain
                        </Link>
                    </nav>

                    <div className="flex items-center gap-4">

                        <button onClick={logout} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all" title="Đăng xuất an toàn">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main */}
            <main className="relative z-10 pt-32 pb-16 px-4 md:px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-10 text-center">

                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">Blockchain</h2>
                        <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto">Các minh họa về khối blockchain và các hàm hash.</p>
                    </div>

                    <div className="space-y-12 relative">
                        {/* Vertical line connecting blocks */}
                        <div className="absolute left-[39px] md:left-[47px] top-4 bottom-4 w-px bg-gradient-to-b from-blue-500/50 via-indigo-500/50 to-transparent z-0"></div>

                        {isLoading ? (
                            <div className="text-center py-20 animate-pulse text-indigo-400 relative z-10">Đang đồng bộ Sổ cái từ Network...</div>
                        ) : chain.length === 0 ? (
                            <div className="text-center py-20 text-slate-500 relative z-10">Chưa có Block nào trên mạng lưới.</div>
                        ) : (
                            [...chain].reverse().map((block, index) => (
                                <div key={block.hash} className="relative z-10 group">
                                    {/* Connecting dot */}
                                    <div className="absolute left-6 md:left-8 top-8 w-6 h-6 rounded-full bg-[#0a0f1c] border-2 border-indigo-500/50 flex items-center justify-center -translate-x-1/2 shadow-[0_0_10px_rgba(99,102,241,0.5)]">
                                        <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                                    </div>

                                    <div className="ml-16 md:ml-24 backdrop-blur-xl bg-slate-900/40 border border-white/10 rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 hover:border-white/20 hover:bg-slate-900/60 relative">
                                        {/* Glowing accent on top */}
                                        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                        {/* Block Header */}
                                        <div className="bg-white/[0.02] p-6 md:p-8 border-b border-white/5 flex flex-col xl:flex-row xl:items-start justify-between gap-6">
                                            <div className="flex items-center gap-5">
                                                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500/20 to-violet-500/20 text-indigo-300 rounded-2xl flex items-center justify-center font-bold font-mono text-xl border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)] flex-shrink-0 relative overflow-hidden">
                                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent"></div>
                                                    {block.index === 0 ? 'G0' : `#${block.index}`}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-white uppercase tracking-wider text-sm flex items-center gap-3">
                                                        {block.index === 0 ? 'KHỐI GỐC (GENESIS BLOCK)' : 'KHỐI GIAO DỊCH'}
                                                        {index === 0 && (
                                                            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded text-[10px] font-bold tracking-widest shadow-[0_0_10px_rgba(16,185,129,0.2)]">MỚI NHẤT</span>
                                                        )}
                                                    </h3>
                                                    <p className="text-slate-400 text-xs font-mono mt-1.5 flex items-center gap-2">
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                        {new Date(block.timestamp).toLocaleString('vi-VN')}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-3 font-mono text-[11px] xl:max-w-md w-full">
                                                <div className="flex bg-slate-950/60 rounded-xl overflow-hidden border border-white/5 shadow-inner">
                                                    <span className="bg-white/5 px-3 py-2 font-bold text-slate-400 w-24 flex-shrink-0 border-r border-white/5 flex items-center shadow-sm">Mã Khối Trc</span>
                                                    <span className="px-3 py-2 truncate text-slate-500" title={block.previousHash}>{block.previousHash}</span>
                                                </div>
                                                <div className="flex bg-blue-950/30 rounded-xl overflow-hidden border border-blue-500/20 shadow-inner">
                                                    <span className="bg-blue-500/10 px-3 py-2 font-bold text-blue-400 w-24 flex-shrink-0 border-r border-blue-500/20 flex items-center shadow-sm">Mã Khối Này</span>
                                                    <span className="px-3 py-2 truncate text-blue-300 font-bold" title={block.hash}>{block.hash}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Block Transactions */}
                                        <div className="p-6 md:p-8">
                                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-5 flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                                Giao dịch ({block.transactions.length})
                                            </h4>

                                            {block.transactions.length === 0 ? (
                                                <div className="p-5 rounded-xl text-center text-sm text-slate-500 border border-white/5 bg-white/[0.02]">
                                                    Chưa có giao dịch ở khối này.
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    {block.transactions.map((tx, idx) => (
                                                        <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                                                            <div className="flex items-start gap-4 mb-4 md:mb-0">
                                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${tx.sender === 'SYSTEM'
                                                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                                    : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                                                                    }`}>
                                                                    {tx.sender === 'SYSTEM' ? (
                                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                                                    ) : (
                                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                                                                    )}
                                                                </div>

                                                                <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                                    <div>
                                                                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 font-semibold">Từ Địa Chí</p>
                                                                        <p className="font-mono text-sm text-slate-300 truncate" title={tx.sender}>
                                                                            {tx.sender === 'SYSTEM' ? 'System' : tx.sender}
                                                                        </p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 font-semibold">Tới Địa Chỉ</p>
                                                                        <p className="font-mono text-sm text-slate-300 truncate" title={tx.recipient}>
                                                                            {tx.recipient}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="text-right pl-[56px] md:pl-0 flex-shrink-0 bg-slate-950/30 md:bg-transparent p-3 md:p-0 rounded-lg">
                                                                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-1">Giá trị</p>
                                                                <p className="font-mono text-lg font-bold text-emerald-400 tracking-tight">
                                                                    ${tx.amount.toLocaleString('en-US')}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
