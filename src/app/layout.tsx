import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import Layout from "./_components/_layout/_layout";

export const metadata: Metadata = {
  title: "Colorfuse - Color Generator",
  description:
    "Pick colors, blend gradients, and find the perfect palette for any project in seconds.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <TRPCReactProvider>
          <Layout>{children}</Layout>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
