import { Outfit } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs";

const outfit = Outfit({ subsets: ['latin'], weight: ["300", "400", "500", "600", "700"] })

export const metadata = {
  title: "Build Smart Ke — Kenya's Construction Marketplace",
  description: "Buy cement, steel, roofing, tiles, plumbing, and all construction materials from verified Kenyan suppliers. Compare prices, order online, delivered to your site.",
  keywords: "construction materials Kenya, cement suppliers, steel bars, roofing sheets, tiles, plumbing fixtures, building materials Nairobi",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${outfit.className} antialiased text-gray-700`} >
          <Toaster />
          <AppContextProvider>
            {children}
          </AppContextProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
