"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeSwitch } from "./theme-switch";
import { metaData } from "../lib/config";

const navItems = {
  "/": { name: "Home" },
  "/projects": { name: "Projects" },
};

export function Navbar() {
  const pathname = usePathname(); // current route
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
          
          {/* Mind Garden Link */}
          <Link
            href="/content/all"
            className="transition-all flex items-center gap-1 align-middle hover:text-neutral-800 dark:hover:text-neutral-200"
          >
            🌱 <span className={`relative ${isContentActive ? "after:block after:h-[2px] after:bg-blue-500 after:absolute after:bottom-0 after:left-0 after:right-0" : ""}`}>Mind Garden</span>
          </Link>

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
