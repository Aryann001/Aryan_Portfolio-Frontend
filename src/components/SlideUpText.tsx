"use client";

import { useState, useEffect } from "react";

const SlideUpText = ({ children }: { children: React.ReactNode }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // We use a short timeout to ensure the initial (hidden) state is rendered
    // before we trigger the transition to the visible state.
    const timeout = setTimeout(() => {
      setIsMounted(true);
    }, 100); // A small delay like 100ms is usually enough

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      className={`
        transition-all duration-1000 ease-out
        ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
      `}
    >
      {children}
    </div>
  );
};

export default SlideUpText;
