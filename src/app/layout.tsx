import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PT Marviro Ekspor Indonesia - Sistem Administrasi Data",
  description: "Sistem Manajemen Data Administrasi PT Marviro Ekspor Indonesia. Kelola NIK Internal, NIK Eksternal, Vendor, Buyer, Kontrak, dan Permohonan Vendor.",
  keywords: ["PT Marviro Ekspor Indonesia", "Administrasi Data", "Manajemen Vendor", "Manajemen Buyer"],
  authors: [{ name: "PT Marviro Ekspor Indonesia" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
