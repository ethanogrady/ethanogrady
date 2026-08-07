import type { Metadata, Viewport } from "next";
import { Newsreader } from "next/font/google";
import { getSettings } from "@/lib/content";
import "./globals.css";

const display = Newsreader({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const { wordmark } = settings;
  const description = settings.description ?? undefined;

  return {
    metadataBase: new URL("https://ethanogrady.com"),
    title: wordmark,
    description,
    openGraph: {
      type: "website",
      siteName: wordmark,
      title: wordmark,
      description,
    },
    twitter: { card: "summary_large_image" },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  themeColor: "#fff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={display.variable}>
      <body>
        <div className="root">{children}</div>
      </body>
    </html>
  );
}
