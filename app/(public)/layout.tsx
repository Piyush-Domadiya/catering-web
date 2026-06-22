import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { BottomMenuBar } from "@/components/shared/BottomMenuBar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-500">
      <Navbar />
      <main className="flex-grow pt-20 pb-32 md:pb-0">{children}</main>
      <Footer />
      <BottomMenuBar />
    </div>
  );
}
