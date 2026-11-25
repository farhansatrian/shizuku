import type { Metadata } from "next";
import {
  Barlow_Condensed,
  Cormorant_Garamond,
  JetBrains_Mono,
  Noto_Sans_JP,
  Plus_Jakarta_Sans,
} from "next/font/google";
import { LocaleProvider } from "@/components/providers/LocaleProvider";
import { EcosystemAuthProvider } from "@/components/providers/EcosystemAuthProvider";
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

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-condensed",
  display: "swap",
});

export const metadata: Metadata = {
  title: "shizuku (雫)",
  description:
    "shizuku (雫) — Personal web hub, portfolio, and shared SHIZUKU ID ecosystem.",
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
      className={`${jakarta.variable} ${cormorant.variable} ${jetbrains.variable} ${notoJp.variable} ${barlowCondensed.variable}`}
    >
      <body className="min-h-screen antialiased selection:bg-[#7650f3]/20 selection:text-[#1e172b]">
        <LocaleProvider>
          <EcosystemAuthProvider>{children}</EcosystemAuthProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
