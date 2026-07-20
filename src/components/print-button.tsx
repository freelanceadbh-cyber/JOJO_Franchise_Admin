'use client';

import React from 'react';

export default function PrintButton({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={className}
    >
      {children}
    </button>
  );
}
