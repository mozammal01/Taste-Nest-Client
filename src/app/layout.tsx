import type { Metadata } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/providers/SessionProvider";
import ToastProvider from "@/components/providers/ToastProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const roboto = Roboto({
  variable: "--font-roboto-sans",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Taste Nest | Artisan Flavors & Atmospheric Sessions",
    template: "%s | Taste Nest"
  },
  description: "Experience the pinnacle of culinary artistry at TasteNest, where every ingredient tells a story of local farms and global inspiration.",
  openGraph: {
    title: "Taste Nest | Fine Dining Experience",
    description: "Artisan Flavors & Atmospheric Sessions in the heart of the city.",
    type: "website",
    siteName: "Taste Nest",
  },
  twitter: {
    card: "summary_large_image",
    title: "Taste Nest | Fine Dining",
    description: "Experience the pinnacle of culinary artistry.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${roboto.variable} ${robotoMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            {children}
            <ToastProvider />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
