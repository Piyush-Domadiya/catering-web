import Navbar from "@/components/shared/Navbar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Events | Tasteful Affaire",
  description: "Manage your upcoming events with Tasteful Affaire",
};

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg-secondary dark:bg-background transition-colors duration-500">
      <Navbar />
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  );
}
