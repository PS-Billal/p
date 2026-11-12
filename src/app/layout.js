import "./globals.css";
import { DM_Sans, Manrope } from "next/font/google";
import PageMotion from "../components/ui/PageMotion";

const bodyFont = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm",
  display: "swap",
});
const headingFont = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});
export const metadata = {
  metadataBase: new URL("https://billalyasir.com"),
  title: {
    default: "Md Billal Yasir | Software Developer",
    template: "%s | Md Billal Yasir",
  },
  description:
    "Software Developer based in Cyprus, specializing in production SaaS, React, Next.js, Node.js, AI integrations, RAG, and real-time applications.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "https://billalyasir.com",
    title: "Md Billal Yasir | Software Developer",
    description:
      "Thoughtful code. Real-world products. Production SaaS, AI, and real-time systems.",
    images: [{ url: "/social-preview.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", images: ["/social-preview.png"] },
  icons: { icon: "/icon.svg" },
};
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${bodyFont.variable} ${headingFont.variable}`}>
      <body>
        {children}
        <PageMotion />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Md Billal Yasir",
              jobTitle: "Software Developer",
              url: "https://billalyasir.com",
              email: "billalyasir5@gmail.com",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Nicosia",
                addressCountry: "CY",
              },
              knowsAbout: [
                "React",
                "Next.js",
                "Node.js",
                "RAG",
                "SaaS",
                "Real-time applications",
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
