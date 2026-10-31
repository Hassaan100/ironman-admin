import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-zinc-400">
      <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
        Loading...
      </p>
    </div>
  );
}

