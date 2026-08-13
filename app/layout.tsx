import type { Metadata, Viewport } from "next";
import { Newsreader } from "next/font/google";
import { getSettings } from "@/lib/content";
import { SITE_URL } from "@/lib/site";
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
    metadataBase: new URL(SITE_URL),
    title: {
      default: wordmark,
      template: `%s - ${wordmark}`,
    },
    description,
    applicationName: wordmark,
    authors: [{ name: wordmark, url: SITE_URL }],
    creator: wordmark,
    publisher: wordmark,
    keywords: [
      wordmark,
      "photographer",
      "photography",
      "interiors photography",
      "fashion photography",
      "editorial photography",
      ...settings.basedIn,
    ].filter(Boolean),
    openGraph: {
      type: "website",
      siteName: wordmark,
      title: wordmark,
      description,
      url: SITE_URL,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: wordmark,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    formatDetection: { telephone: false, address: false, email: false },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
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
