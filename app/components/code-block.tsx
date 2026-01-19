"use client";

import React, { useRef, useState } from "react";
import { FiCheck, FiCopy } from "react-icons/fi";

export function CodeBlock({ children, ...props }: React.ComponentProps<"pre">) {
  const preRef = useRef<HTMLPreElement>(null);
  const [isCopied, setIsCopied] = useState(false);

  const copy = async () => {
    if (preRef.current) {
      const code = preRef.current.textContent;
      if (code) {
        await navigator.clipboard.writeText(code);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    }
  };

  return (
    <div className="relative group my-4">
      <div className="sticky top-0 right-0 z-20 flex justify-end h-0">
        <button
          onClick={copy}
          className="flex items-center justify-center w-8 h-8 m-2 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 opacity-0 group-hover:opacity-100 transition-all duration-200"
          aria-label="Copy code"
        >
          {isCopied ? (
            <FiCheck className="w-4 h-4 text-green-500" />
          ) : (
            <FiCopy className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
          )}
        </button>
      </div>
      <pre ref={preRef} {...props} className={`!my-0 ${props.className || ""}`}>
        {children}
      </pre>
    </div>
  );
}
