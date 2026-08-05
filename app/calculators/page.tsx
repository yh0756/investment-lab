import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { calculators } from "@/lib/calculator-catalog";

export const metadata = { title: "전체 투자 계산기", description: "투자실험실의 금융·주식·ETF 계산기 6종을 확인하세요." };
export default function CalculatorsPage() { return <main className="mx-auto max-w-6xl px-4 py-12"><h1 className="text-4xl font-black">전체 계산기</h1><div className="mt-8 grid gap-4 md:grid-cols-2">{calculators.map((c)=><Link key={c.href} href={c.href} className="rounded-2xl border bg-white p-6 hover:border-blue-300"><h2 className="font-black">{c.name}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{c.description}</p><span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-brand">열기 <ArrowRight className="h-4 w-4" /></span></Link>)}</div></main>; }
