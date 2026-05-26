import type { Metadata } from "next";
import { Noto_Serif_TC, Noto_Sans_TC, Geist_Mono } from "next/font/google";
import "./globals.css";

const display = Noto_Serif_TC({
  variable: "--font-display",
  weight: ["700", "900"],
  subsets: ["latin"],
  display: "swap",
});

const sans = Noto_Sans_TC({
  variable: "--font-sans",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const mono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "週末去哪裡 · 台灣微旅行指南",
  description:
    "給我一個方向，AI 幫你排一份真的走得完的台灣半日 / 一日小旅行。輸入出發地、時長、預算，3 秒拿到行程。",
  openGraph: {
    title: "週末去哪裡 · 台灣微旅行指南",
    description:
      "給我一個方向，AI 幫你排一份真的走得完的台灣半日 / 一日小旅行。",
    locale: "zh_TW",
    type: "website",
    url: SITE_URL,
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "週末去哪裡 · 台灣微旅行指南",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "週末去哪裡 · 台灣微旅行指南",
    description:
      "給我一個方向，AI 幫你排一份真的走得完的台灣半日 / 一日小旅行。",
    images: ["/api/og"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-Hant-TW"
      className={`dark ${display.variable} ${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
