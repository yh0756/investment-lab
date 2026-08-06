import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CalculatorQuickNav } from "@/components/calculator-quick-nav";
import { siteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "투자실험실 | 숫자로 미리 보는 투자 시나리오", template: "%s | 투자실험실" },
  description: "레버리지 ETF, 배당성장, 손실 회복, 포트폴리오 리밸런싱, 목표 자산, 자사주매입 효과를 직접 계산하는 한국어 투자 시뮬레이터입니다.",
  openGraph: {
    title: "투자실험실",
    description: "숫자로 미리 보는 투자 시나리오",
    type: "website",
    locale: "ko_KR",
    url: siteUrl,
    siteName: "투자실험실",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "투자실험실 - 숫자로 미리 보는 투자 시나리오" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "투자실험실",
    description: "숫자로 미리 보는 투자 시나리오",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8743089510285604"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <SiteHeader />
        <CalculatorQuickNav />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
