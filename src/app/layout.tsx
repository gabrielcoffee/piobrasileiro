import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

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
