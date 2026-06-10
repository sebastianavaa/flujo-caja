import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Facturación Tarjeta",
  description: "Calculadora de flujo de caja para tarjeta de crédito en cuotas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
