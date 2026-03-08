'use client';

import { useStore } from '@/lib/store';
import Login from '@/components/Login';
import Dashboard from '@/components/Dashboard';
import { useEffect, useState } from 'react';

export default function Home() {
  const currentUser = useStore((state) => state.currentUser);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <main className="min-h-screen bg-[#0a0f1c]"></main>;
  }

  return (
    <main>
      {currentUser ? <Dashboard /> : <Login />}
    </main>
  );
}
