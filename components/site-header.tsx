"use client";

import Link from "next/link";
import { useState } from "react";
import { FlaskConical, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const links = [
  ["전체 계산기", "/calculators"],
  ["투자 기초", "/guides"],
  ["이용 안내", "/about"],
  ["면책 안내", "/terms"]
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="투자실험실 홈">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy text-white"><FlaskConical className="h-5 w-5" /></span>
          <span><strong className="block text-base text-slate-950">투자실험실</strong><small className="hidden text-xs text-slate-500 sm:block">숫자로 미리 보는 투자 시나리오</small></span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">{links.map(([label, href]) => <Link key={href} href={href} className="text-sm font-semibold text-slate-600 hover:text-navy">{label}</Link>)}</nav>
        <Button className="md:hidden" variant="ghost" size="sm" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-label="메뉴 열기">{open ? <X /> : <Menu />}</Button>
      </div>
      {open && <nav className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">{links.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)} className="block rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">{label}</Link>)}</nav>}
    </header>
  );
}
