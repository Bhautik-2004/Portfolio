"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";

interface CategoryTabsProps {
  currentCategory: string;
  categories: string[];
  categoryInfo: Record<string, { title: string; description: string }>;
}

export function CategoryTabs({ currentCategory, categories, categoryInfo }: CategoryTabsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setShowLeftArrow(container.scrollLeft > 10);
    setShowRightArrow(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 200;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative mb-8 border-b border-neutral-200 dark:border-neutral-800 -mx-4 px-4 md:mx-0 md:px-0">
      {/* Left Arrow */}
      {showLeftArrow && (
        <button
          onClick={() => scroll("left")}
          className="md:hidden absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-neutral-900 p-1.5 rounded-full shadow-md border border-neutral-200 dark:border-neutral-700"
          aria-label="Scroll left"
        >
          <svg
            className="w-4 h-4 text-neutral-600 dark:text-neutral-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Right Arrow */}
      {showRightArrow && (
        <button
          onClick={() => scroll("right")}
          className="md:hidden absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-neutral-900 p-1.5 rounded-full shadow-md border border-neutral-200 dark:border-neutral-700"
          aria-label="Scroll right"
        >
          <svg
            className="w-4 h-4 text-neutral-600 dark:text-neutral-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Tabs Container */}
      <div
        ref={scrollContainerRef}
        onScroll={checkScroll}
        className="flex gap-1 overflow-x-auto scrollbar-hide scroll-smooth"
      >
        {categories.map((cat) => {
          const catInfo = categoryInfo[cat as keyof typeof categoryInfo];
          return (
            <Link
              key={cat}
              href={`/content/${cat}`}
              className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-150 border-b-2 -mb-[1px] flex-shrink-0
                ${currentCategory === cat
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:border-neutral-300 dark:hover:border-neutral-700"
                }
              `}
            >
              {catInfo.title}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
