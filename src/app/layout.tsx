import type { Metadata } from "next";
import { Inter, Readex_Pro } from "next/font/google";
import "./globals.css";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";
import { ThemeProvider } from "@/components/theme-provider";
import { AIChatbot } from "@/components/smart-press/AIChatbot";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const readexPro = Readex_Pro({ subsets: ["arabic", "latin"], variable: "--font-readex" });

export const metadata: Metadata = {
  title: "Smart Press - AI Journalism Platform",
  description: "Advanced prototype for AI-powered journalism",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${inter.variable} ${readexPro.variable} antialiased font-readex`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Script
            id="orchids-browser-logs"
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts/orchids-browser-logs.js"
            strategy="afterInteractive"
            data-orchids-project-id="26ac57e6-90eb-4109-8ace-a345c2407e59"
          />
          <ErrorReporter />
          <Script
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
            strategy="afterInteractive"
            data-target-origin="*"
            data-message-type="ROUTE_CHANGE"
            data-include-search-params="true"
            data-only-in-iframe="true"
            data-debug="true"
            data-custom-data='{"appName": "YourApp", "version": "1.0.0", "greeting": "hi"}'
          />
            {children}
            <AIChatbot />
            <VisualEditsMessenger />
        </ThemeProvider>
      </body>
    </html>
  );
}
