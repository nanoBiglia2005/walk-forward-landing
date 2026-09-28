import type { Metadata, Viewport } from "next";
import { League_Spartan, Questrial } from "next/font/google";
import { hero } from "@/content/site";
import "./globals.css";

const leagueSpartan = League_Spartan({
  variable: "--font-league-spartan",
  subsets: ["latin"],
});

const questrial = Questrial({
  variable: "--font-questrial",
  subsets: ["latin"],
  weight: "400",
});

const title = "Walk Forward | Hardware, software y servicios expertos de IT";

export const metadata: Metadata = {
  title,
  description: hero.description,
  openGraph: {
    title,
    description: hero.description,
    locale: "es_AR",
    type: "website",
    siteName: "Walk Forward",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-AR" className={`${leagueSpartan.variable} ${questrial.variable}`} suppressHydrationWarning>
      <head>
        {/* Entrance states only apply when scripts run, so the page stays complete without JS. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
