"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeSwitch } from "./theme-switch";
import { metaData } from "../lib/config";
import { useState, useRef, useEffect } from "react";

const navItems = {
  "/": { name: "Home" },
  "/projects": { name: "Projects" },
};

const contentCategories = [
  { path: "/content/all", name: "All Content" },
  { path: "/content/blog", name: "Blog" },
  { path: "/content/books", name: "Books" },
  { path: "/content/papers", name: "Papers" },
  { path: "/content/notes", name: "Notes" },
  { path: "/content/experiments", name: "Experiments" },
];

export function Navbar() {
  const pathname = usePathname(); // current route
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isContentActive = pathname.startsWith("/content");

  return (
    <nav className="lg:mb-16 mb-12 py-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        {/* Logo / Title */}
        <div className="flex items-center">
          <Link href="/" className="text-3xl font-semibold">
            {metaData.title}
          </Link>
        </div>

        {/* Navigation links */}
        <div className="flex flex-row gap-4 mt-6 md:mt-0 md:ml-auto items-center relative">
          {/* Home Link */}
          <Link
            href="/"
            className={`transition-all flex align-middle relative
              ${pathname === "/" ? "after:block after:h-[2px] after:bg-blue-500 after:absolute after:bottom-0 after:left-0 after:right-0" 
                : "hover:text-neutral-800 dark:hover:text-neutral-200"
              }
            `}
          >
            Home
          </Link>
          
          {/* Content Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`transition-all flex items-center gap-1 relative px-1
                ${isContentActive ? "" : "hover:text-neutral-800 dark:hover:text-neutral-200"}
              `}
            >
              🌱 <span className={`${isContentActive ? "after:block after:h-[2px] after:bg-blue-500 after:absolute after:bottom-0 after:left-0 after:right-0 relative" : ""}`}>Mind Garden</span>
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute top-full mt-3 right-0 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-md overflow-hidden min-w-[180px] z-50">
                {contentCategories.map(({ path, name }) => (
                  <Link
                    key={path}
                    href={path}
                    onClick={() => setIsDropdownOpen(false)}
                    className={`block px-4 py-2.5 text-sm transition-all duration-150
                      ${pathname === path 
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium" 
                        : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                      }
                    `}
                  >
                    {name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Projects Link */}
          <Link
            href="/projects"
            className={`transition-all flex align-middle relative
              ${pathname === "/projects" ? "after:block after:h-[2px] after:bg-blue-500 after:absolute after:bottom-0 after:left-0 after:right-0" 
                : "hover:text-neutral-800 dark:hover:text-neutral-200"
              }
            `}
          >
            Projects
          </Link>

          {/* Photos Link */}
          <Link
            href="/photos"
            className={`transition-all flex align-middle relative
              ${pathname === "/photos" ? "after:block after:h-[2px] after:bg-blue-500 after:absolute after:bottom-0 after:left-0 after:right-0" 
                : "hover:text-neutral-800 dark:hover:text-neutral-200"
              }
            `}
          >
            Photos
          </Link>

          <ThemeSwitch />
        </div>
      </div>
    </nav>
  );
}
