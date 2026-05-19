import type { Metadata } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/providers/SessionProvider";
import ToastProvider from "@/components/providers/ToastProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import AIChatbot from "@/components/shared/AIChatbot";
import ScrollToTop from "@/components/ui/ScrollToTop";

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

const restaurantSchema = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "name": "Taste Nest",
  "image": "https://tastenest.vercel.app/logo/logo.png",
  "@id": "https://tastenest.vercel.app",
  "url": "https://tastenest.vercel.app",
  "telephone": "+1-234-567-890",
  "priceRange": "$$",
  "menu": "https://tastenest.vercel.app/menu",
  "servesCuisine": ["Italian", "American", "European", "French"],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Food Street",
    "addressLocality": "New York City",
    "addressRegion": "NY",
    "postalCode": "10001",
    "addressCountry": "US"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "09:00",
      "closes": "23:00"
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantSchema) }}
        />
      </head>
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
            <AIChatbot />
            <ScrollToTop />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
