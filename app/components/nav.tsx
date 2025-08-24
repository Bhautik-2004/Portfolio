"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeSwitch } from "./theme-switch";
import { metaData } from "../lib/config";

const navItems = {
  "/": { name: "Home" },
  "/blog": { name: "Blog" },
  "/projects": { name: "Projects" },
  "/photos": { name: "Photos" },
};

export function Navbar() {
  const pathname = usePathname(); // current route

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
          {Object.entries(navItems).map(([path, { name }]) => {
            const isActive = pathname === path;
            return (
              <Link
                key={path}
                href={path}
                className={`transition-all flex align-middle relative
                  ${isActive ? "after:block after:h-[2px] after:bg-blue-500 after:absolute after:bottom-0 after:left-0 after:right-0" 
                    : "hover:text-neutral-800 dark:hover:text-neutral-200"
                  }
                `}
              >
                {name}
              </Link>
            );
          })}
          <ThemeSwitch />
        </div>
      </div>
    </nav>
  );
}
