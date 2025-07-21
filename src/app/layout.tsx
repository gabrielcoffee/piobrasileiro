import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

/* Font principal utilizada no projeto */
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

/* Metadados do projeto */
export const metadata: Metadata = {
  title: "Pio Brasileiro",
  description: "Pio Brasileiro web application",
};

/* Layout principal do projeto */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className={`${manrope.variable}`}>
        {children}
      </body>
    </html>
  );
}
