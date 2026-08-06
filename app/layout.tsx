import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const description =
  "Photographer working across interiors, fashion, and editorial. New York.";

export const metadata: Metadata = {
  metadataBase: new URL("https://ethanogrady.com"),
  title: "Ethan O'Grady",
  description,
  openGraph: {
    type: "website",
    siteName: "Ethan O'Grady",
    title: "Ethan O'Grady",
    description,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  width: "device-width",
  themeColor: "#fff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={archivo.variable}>
      <body>
        <div className="root">{children}</div>
      </body>
    </html>
  );
}
