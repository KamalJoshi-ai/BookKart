import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import "./globals.css";
import Header from  "./components/Header";
import Footer from "./components/Footer";
import LayoutWrapper from "./LayoutWrapper";

const robotoMono = Roboto_Mono({
 display:'swap',
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Book Kart ",
  description: "This is a platform where you can buy and sell used books ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={robotoMono.className}>
        <LayoutWrapper>
          <Header></Header>
          {children}
          <Footer></Footer>
        </LayoutWrapper>
      </body>
    </html>
  );
}
