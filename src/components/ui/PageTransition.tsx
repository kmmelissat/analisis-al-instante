"use client";

import { ReactNode, useEffect, useState } from "react";
import { PageType } from "@/types";

interface PageTransitionProps {
  children: ReactNode;
  currentPage: PageType;
  className?: string;
}

export function PageTransition({
  children,
  currentPage,
  className = "",
}: PageTransitionProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    // Start fade out
    setIsVisible(false);

    // After fade out completes, update children and fade in
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      setIsVisible(true);
    }, 150); // Half of the transition duration

    return () => clearTimeout(timer);
  }, [currentPage, children]);

  return (
    <div
      className={`
        transition-all duration-300 ease-in-out
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
        ${className}
      `}
    >
      {displayChildren}
    </div>
  );
}
