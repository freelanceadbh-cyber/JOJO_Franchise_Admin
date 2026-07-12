'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, Moon, Sun } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  toasts: Toast[];
  showToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

const ToastThemeContext = createContext<ToastThemeContextType | undefined>(undefined);

export function useToastTheme() {
  const context = useContext(ToastThemeContext);
  if (!context) {
    throw new Error('useToastTheme must be used within a ToastThemeProvider');
  }
  return context;
}

export function ToastThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Load and apply theme from local storage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('jojo-theme') as 'light' | 'dark' | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('jojo-theme', nextTheme);
    
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const showToast = (message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-expire after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastThemeContext.Provider value={{ theme, toggleTheme, toasts, showToast, removeToast }}>
      {children}
      
      {/* Dynamic Toast Portal */}
      <div 
        aria-live="polite"
        aria-atomic="true"
        className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-lg border text-xs font-semibold transform transition-all duration-300 animate-slide-in ${
              toast.type === 'success' 
                ? 'bg-green-50 dark:bg-green-950/90 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800/50' 
                : toast.type === 'error'
                ? 'bg-red-50 dark:bg-red-950/90 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800/50'
                : 'bg-brand-pink/50 dark:bg-zinc-900/90 text-brand-crimson dark:text-pink-300 border-brand-pink dark:border-zinc-800'
            }`}
          >
            {toast.type === 'success' && <CheckCircle size={16} className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />}
            {toast.type === 'error' && <AlertCircle size={16} className="text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />}
            {toast.type === 'info' && <Info size={16} className="text-brand-crimson dark:text-pink-400 mt-0.5 flex-shrink-0" />}

            <div className="flex-1 leading-relaxed">{toast.message}</div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-muted-foreground hover:text-foreground hover:scale-105 transition-transform p-0.5 rounded-lg border-0 bg-transparent cursor-pointer flex-shrink-0"
              aria-label="Close notification"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastThemeContext.Provider>
  );
}
