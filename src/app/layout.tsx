import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

/* Font principal utilizada no projeto */
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

/* Metadados do projeto */
export const metadata: Metadata = {
  title: "PONTIFÍCIO COLÉGIO PIO BRASILEIRO",
  description: "Pio Brasileiro web application",
};
 
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  // Also supported by less commonly used
  // interactiveWidget: 'resizes-visual',
}

/* Layout principal do projeto */
export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {

    return (
        <html lang="en" className="light">
        <body className={`${manrope.variable}`}>
            <AuthProvider>
            {children}
            </AuthProvider>
        </body>
        </html>
    );
}
