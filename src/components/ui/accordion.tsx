"use client";

import { useState, ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionItem {
  title: string;
  content: ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

export function Accordion({ items, className }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className={cn("space-y-3", className)}>
      {items.map((item, i) => (
        <div
          key={i}
          className="border border-gray-200 rounded-xl overflow-hidden"
        >
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
          >
            <span className="font-semibold text-gray-900">{item.title}</span>
            <ChevronDown
              className={cn(
                "w-5 h-5 text-gray-400 transition-transform duration-200",
                openIndex === i && "rotate-180"
              )}
            />
          </button>
          <div
            className={cn(
              "grid transition-all duration-200",
              openIndex === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            )}
          >
            <div className="overflow-hidden">
              <div className="px-6 pb-4 text-gray-600 leading-relaxed">
                {item.content}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
