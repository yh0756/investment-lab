"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { calculators } from "@/lib/calculator-catalog";
import { cn } from "@/lib/utils";

export function CalculatorQuickNav() {
  const pathname = usePathname();

  return (
    <div className="sticky top-16 z-40 border-b border-slate-200 bg-white/95 backdrop-blur" aria-label="계산기 빠른 이동">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2 sm:px-6 lg:px-8">
        <span className="hidden shrink-0 text-xs font-black text-slate-500 lg:block">계산기 이동</span>
        <nav className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {calculators.map((calculator) => {
            const active = pathname === calculator.href || pathname === calculator.guideHref;
            return (
              <Link
                key={calculator.href}
                href={calculator.href}
                className={cn(
                  "inline-flex min-h-9 shrink-0 items-center rounded-full border px-3 text-xs font-bold transition sm:px-4",
                  active
                    ? "border-navy bg-navy text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-brand",
                )}
                aria-current={active ? "page" : undefined}
              >
                {calculator.shortName}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
