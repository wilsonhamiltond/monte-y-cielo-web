import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./admin.css";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap" });

export const metadata: Metadata = {
  title: "Administración — Home Alquiler",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <html lang="es" className={poppins.className}>
      <body>{children}</body>
    </html>
  );
}
