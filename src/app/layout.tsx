import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/store/StoreProvider";
import { cinzel, raleway } from "./fonts";
import NavBar from "@/components/NavBar";
import MouseFollowingLight from "@/components/MouseFollowingLight";
import PeelingLoader from "@/components/PeelingLoader"

export const metadata: Metadata = {
  title: "Aryan Baghel",
  description: "Hi, I'm Aryan Baghel. A passionate Software Developer based in Bhopal, India.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StoreProvider>
      <html lang="en">
        <body className={`${cinzel.variable} ${raleway.variable}`}>
          <PeelingLoader />
          <NavBar />
          <MouseFollowingLight />
          {children}
        </body>
      </html>
    </StoreProvider>
  );
}
