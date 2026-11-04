import type { Metadata } from "next";
import "@fontsource-variable/fraunces/full.css";
import "@fontsource-variable/fraunces/full-italic.css";
import "@fontsource-variable/inter";
import "./globals.css";
import MotionProvider from "@/components/MotionProvider";
import { getContent } from "@/lib/repository";

export function generateMetadata(): Metadata {
  const { site } = getContent();
  return {
    title: site.seoTitle,
    description: site.seoDescription,
    openGraph: {
      title: site.seoTitle,
      description: site.seoDescription,
      type: "website",
      locale: "es_ES",
      images: site.ogImage ? [site.ogImage] : undefined,
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
