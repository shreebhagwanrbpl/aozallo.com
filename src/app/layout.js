import CatalogRealtimeSync from "@/components/CatalogRealtimeSync";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import { generateOrganizationSchema, generateWebSiteSchema } from "@/lib/seo";
export const metadata = {
  metadataBase: new URL("https://aozallo.com"),

  title: {
    default: "Biomedical & Diagnostic Equipment Supplier in India | Raj Biosis",
    template: "%s | Raj Biosis",
  },

  description:
    "Raj Biosis is a leading manufacturer, supplier & exporter of biomedical equipment, hematology analyzers, biochemistry analyzers, ICU monitors, and laboratory diagnostics across India.",

  keywords: [
    "Biomedical Equipment Supplier",
    "Laboratory Equipment Supplier",
    "CBC Machine Supplier",
    "Hematology Analyzer Supplier",
    "Biochemistry Analyzer Supplier",
    "Diagnostic Equipment Supplier",
    "Medical Equipment Supplier India",
    "Biomedical Equipment Exporter",
    "Pathology Lab Equipment",
  ],

  openGraph: {
    title: "Biomedical & Diagnostic Equipment Supplier in India | Raj Biosis",
    description: "Leading supplier & exporter of biomedical and laboratory equipment across India.",
    url: "https://aozallo.com",
    siteName: "Raj Biosis",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Raj Biosis Biomedical Equipment",
      },
    ],
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Biomedical & Diagnostic Equipment Supplier in India | Raj Biosis",
    description: "Supplier of biomedical and laboratory equipment across India.",
    images: ["/logo.png"],
  },

  alternates: {
    canonical: "https://aozallo.com",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {
  const orgSchema = generateOrganizationSchema();
  const websiteSchema = generateWebSiteSchema();

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(orgSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>
      <body className="antialiased">
        <Navbar />

        <main>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
            }}
          />

          {children}
        </main>

        <Footer />
      <CatalogRealtimeSync />
      </body>
    </html>
  );
}