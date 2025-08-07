import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Footer from "@/components/layout/Footer";
import AnnouncementBar1 from "@/components/layout/AnnouncementBar1";
import AnnouncementBar2 from "@/components/layout/AnnouncmentBar2";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/components/providers/AuthProvider";
import Navbar from "@/components/layout/Navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Foodeez - Food Discovery, Visit & Review Portal",
  description:
    "Discover, visit, and review your favorite restaurants and food with Foodeez - the ultimate food discovery platform.",
  keywords: "food, restaurants, discovery, reviews, dining, cuisine",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} scroll-smooth `}
    >
      <head>
        <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
      </head>
      <body className="flex flex-col font-sans bg-background max-w-[1440px] mx-auto min-h-screen">
        <AuthProvider>
       
          <AnnouncementBar1 />
          <AnnouncementBar2 />
          <Navbar />
          {/* Content padding to avoid overlap */}
          <main className="">{children}</main>
          <Footer />
          <Toaster position="bottom-right" />
          
        </AuthProvider>
      </body>
    </html>
  );
}
