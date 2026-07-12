'use client';

import React from 'react';
import { useToastTheme } from '@/components/providers/toast-theme-provider';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useToastTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer flex items-center justify-center shadow-sm"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      {theme === 'light' ? (
        <Moon size={16} className="stroke-[2.5]" />
      ) : (
        <Sun size={16} className="stroke-[2.5] text-amber-400 animate-spin-slow" />
      )}
    </button>
  );
}
