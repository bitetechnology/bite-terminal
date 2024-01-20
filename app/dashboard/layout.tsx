import SideBarLayout from "@/components/SideBarLayout";
import "../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import SWRProvider from "@/providers/SWRProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bite Terminal",
  description: "A Terminal to track the client orders",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SWRProvider>
          <SideBarLayout>{children}</SideBarLayout>
        </SWRProvider>
      </body>
    </html>
  );
}
