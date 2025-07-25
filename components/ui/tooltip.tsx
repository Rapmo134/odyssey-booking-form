"use client"

import React from "react";

const Tooltip: React.FC<{ content: string; children: React.ReactNode }> = ({ content, children }) => (
  <span className="relative group">
    {children}
    {content && (
      <span className="absolute z-10 left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded bg-black text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none">
        {content}
      </span>
    )}
  </span>
);

export default Tooltip;
