import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/app/components/navbar";

export const metadata: Metadata = {
  title: "Bharatraj Belavara",
  description: "Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        {children}
      </body>
    </html>
  );
}