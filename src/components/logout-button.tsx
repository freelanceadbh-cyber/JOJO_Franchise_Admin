'use client';

import React, { useState } from 'react';
import { signOut } from 'next-auth/react';
import { LogOut, Loader2 } from 'lucide-react';

export default function LogoutButton({ className }: { className?: string }) {
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await signOut({ redirect: false });
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      window.location.href = '/auth/signin';
    }
  };

  return (
    <button 
      type="button"
      disabled={loggingOut}
      onClick={handleLogout}
      className={className || "w-full py-3 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 font-bold rounded-2xl text-sm flex items-center justify-center gap-2 transition-all cursor-pointer border-0 bg-transparent disabled:opacity-50"}
    >
      {loggingOut ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          Signing out...
        </>
      ) : (
        <>
          <LogOut size={16} />
          Log Out
        </>
      )}
    </button>
  );
}
