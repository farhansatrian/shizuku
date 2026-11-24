import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  JetBrains_Mono,
  Noto_Sans_JP,
  Plus_Jakarta_Sans,
} from "next/font/google";
import { LocaleProvider } from "@/components/providers/LocaleProvider";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains",
  display: "swap",
});

const notoJp = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jp",
  display: "swap",
});

export const metadata: Metadata = {
  title: "shizuku (雫)",
  description:
    "Personal digital hub & portfolio of Farhan Satria Nugraha — Software Engineer, ODP IT Banking Systems, and Applied AI Enthusiast.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${jakarta.variable} ${cormorant.variable} ${jetbrains.variable} ${notoJp.variable}`}
    >
      <body className="min-h-screen antialiased selection:bg-[#7650f3]/20 selection:text-[#1e172b]">
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
