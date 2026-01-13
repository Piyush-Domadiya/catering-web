import CustomerEventsClient from "@/components/customer/CustomerEventsClient";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const revalidate = 0;

export default async function MyEventsPage() {
  const session = await auth();

  if (!session) {
    redirect("/login?callbackUrl=/my-events");
  }

  const settings = await prisma.globalSettings.findUnique({
    where: { id: "settings" },
  });

  return (
    <div className="pt-32 pb-20 min-h-screen bg-bg-secondary transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
            My Events
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage your event details and plan your experience
          </p>
        </div>
        <CustomerEventsClient settings={settings || {}} />
      </div>
    </div>
  );
}
