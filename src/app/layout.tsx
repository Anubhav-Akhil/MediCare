import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "MediCare — Modern Patient Management Platform",
  description:
    "Streamline your healthcare practice with MediCare. Manage patients, appointments, and medical records in one elegant, secure platform.",
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" className={`h-full ${plusJakartaSans.variable}`}>
      <head>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/logo.svg" />
        {/* Preconnect to ImageKit CDN for instant video streaming */}
        <link rel="preconnect" href="https://ik.imagekit.io" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://ik.imagekit.io" />
      </head>
      <body className="min-h-full font-sans">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
