'use client';

import { useStore } from '@/lib/store';
import Login from '@/components/Login';
import Dashboard from '@/components/Dashboard';

export default function Home() {
  const currentUser = useStore((state) => state.currentUser);

  return (
    <main>
      {currentUser ? <Dashboard /> : <Login />}
    </main>
  );
}
