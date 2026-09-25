import type { Metadata } from "next";
import { Inter, Spline_Sans_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

/*
 * Fonts (TASKS.md 0.3, DESIGN.md §3.1).
 * - Spline Sans Mono ships on Google Fonts → loaded via next/font.
 * - Google Sans is proprietary and not on Google Fonts / not self-hostable
 *   here, so Inter is loaded as the practical fallback. The --font-body
 *   stack in globals.css keeps "Google Sans", "Product Sans" first so a
 *   licensed copy still wins where installed, falling back to the Inter
 *   webfont and then system-ui with identical metrics/rules.
 */
const splineSansMono = Spline_Sans_Mono({
  subsets: ["latin"],
  variable: "--font-heading-loaded",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Eque UI Kit",
  description:
    "Eque decentralized yield optimizer — production-quality component library (mock data, Storybook documented).",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn(
        "dark h-full antialiased",
        splineSansMono.variable,
        inter.variable,
        "font-body"
      )}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
