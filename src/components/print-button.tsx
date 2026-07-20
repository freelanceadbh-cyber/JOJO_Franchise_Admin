'use client';

import React from 'react';
import { Printer } from 'lucide-react';

interface PrintButtonProps {
  className?: string;
}

export default function PrintButton({ className }: PrintButtonProps) {
  const defaultClass = "px-5 py-2.5 bg-secondary text-secondary-foreground font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all hover:bg-muted cursor-pointer border border-border";
  return (
    <button 
      type="button"
      onClick={() => {
        if (typeof window !== 'undefined') window.print();
      }}
      className={className || defaultClass}
    >
      <Printer size={14} />
      Download PDF / Print
    </button>
  );
}
