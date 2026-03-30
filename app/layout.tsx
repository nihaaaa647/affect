import type { Metadata, Viewport } from "next";
import { Playfair_Display, DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";
import { DeviceProvider } from "@/components/DeviceProvider";

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const dmMono = DM_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Affect | Personal Economic Radar",
  description: "Cinematic editorial luxury meets data journalism. Understand your wallet impact.",
};

export const viewport: Viewport = {
  themeColor: "#0D0A07",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${dmSans.variable} ${dmMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans flex flex-col w-full">
        <DeviceProvider>
          {children}
        </DeviceProvider>
      </body>
    </html>
  );
}
