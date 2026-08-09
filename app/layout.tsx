import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://flip-pdf.vercel.app"),
  title: {
    default: "flip. // pdf converter — 100% Client-Side PDF Studio",
    template: "%s — flip.",
  },
  description:
    "Turn any file into a PDF in seconds. Merge, Split, Compress, Dark Mode & Images to PDF. 100% in-browser, files never leave your device.",
  keywords: [
    "PDF converter",
    "JPG to PDF",
    "Merge PDF",
    "Split PDF",
    "Compress PDF",
    "PDF Dark Mode",
    "Client-side PDF",
    "Private PDF converter",
  ],
  openGraph: {
    title: "flip. // pdf converter — 100% Client-Side PDF Studio",
    description:
      "Turn any file into a PDF in seconds. Merge, Split, Compress, Dark Mode & Images to PDF. Files never leave your device.",
    type: "website",
    siteName: "flip. pdf converter",
  },
  twitter: {
    card: "summary_large_image",
    title: "flip. // pdf converter — 100% Client-Side PDF Studio",
    description:
      "Turn any file into a PDF in seconds. Merge, Split, Compress, Dark Mode & Images to PDF.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#F5F2FF] text-[#0B0B14] selection:bg-[#C6FF3D] selection:text-[#0B0B14]">
        {children}
      </body>
    </html>
  );
}
