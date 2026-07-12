import React from 'react';

export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen flex bg-[#FFFDF9] dark:bg-[#0E0709] font-sans animate-pulse">
      
      {/* Sidebar Mockup */}
      <div className="w-64 border-r border-border bg-card hidden lg:flex flex-col p-6 space-y-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-muted" />
          <div className="h-4 w-24 bg-muted rounded-md" />
        </div>
        <div className="space-y-4">
          <div className="h-8 bg-muted rounded-xl w-full" />
          <div className="h-8 bg-muted rounded-xl w-4/5" />
          <div className="h-8 bg-muted rounded-xl w-5/6" />
          <div className="h-8 bg-muted rounded-xl w-full" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col p-6 space-y-6">
        {/* Header Mockup */}
        <div className="flex justify-between items-center h-16 border-b border-border pb-4">
          <div className="space-y-2">
            <div className="h-6 w-48 bg-muted rounded-lg" />
            <div className="h-3 w-64 bg-muted rounded-md" />
          </div>
          <div className="h-10 w-32 bg-muted rounded-xl" />
        </div>

        {/* Stats Grid Placeholder */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-6 rounded-3xl border border-border bg-card space-y-4">
              <div className="flex justify-between">
                <div className="h-4 w-24 bg-muted rounded-md" />
                <div className="w-8 h-8 bg-muted rounded-lg" />
              </div>
              <div className="h-8 w-32 bg-muted rounded-lg" />
            </div>
          ))}
        </div>

        {/* Dynamic Table/Content Placeholder */}
        <div className="p-6 rounded-3xl border border-border bg-card space-y-4 flex-1">
          <div className="h-5 w-40 bg-muted rounded-md" />
          <div className="space-y-3 pt-4">
            <div className="h-12 bg-muted rounded-2xl w-full" />
            <div className="h-12 bg-muted rounded-2xl w-full" />
            <div className="h-12 bg-muted rounded-2xl w-full" />
            <div className="h-12 bg-muted rounded-2xl w-full" />
            <div className="h-12 bg-muted rounded-2xl w-full" />
          </div>
        </div>
      </div>

    </div>
  );
}
