"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import MobileBottomNav from "@/components/MobileBottomNav";

const LANDING_ROUTES = ["/teklif-al"];

export default function MainShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = LANDING_ROUTES.some((r) => pathname.startsWith(r));

  if (isLanding) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 pb-16 lg:pb-0">{children}</main>
      <Footer />
      <FloatingCTA />
      <MobileBottomNav />
    </>
  );
}
