// app/fonts.ts
import { Cinzel, Raleway } from "next/font/google";

export const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "700"], // Regular and Bold weights
  variable: "--font-cinzel", // CSS variable name
  display: "swap",
});

export const raleway = Raleway({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"], // Light, Regular, Semi-Bold, Bold
  variable: "--font-raleway", // CSS variable name
  display: "swap",
});
