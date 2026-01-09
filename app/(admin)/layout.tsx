import Sidebar from "@/components/admin/Sidebar";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const user = session.user as any;
  const userName = user?.name || "User";
  const userRole = user?.role || "STAFF";
  const userInitial = userName.charAt(0).toUpperCase();
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900 print:bg-white">
      <div className="print:hidden">
        <Sidebar />
      </div>
      <div className="flex-grow ml-20 md:ml-72 transition-all duration-300 print:ml-0 print:w-full">
        <header className="h-20 bg-white dark:bg-slate-950 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-40 print:hidden">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            Catering Management System
          </h2>
          <div className="flex items-center gap-6">
            <ThemeToggle />
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-tight">
                {userName}
              </p>
              <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest">
                {userRole === "ADMIN" ? "Administrator" : "Staff Member"}
              </p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center text-white font-bold shadow-lg shadow-amber-200 dark:shadow-amber-900/20">
              {userInitial}
            </div>
          </div>
        </header>
        <main className="p-8 print:p-0">{children}</main>
      </div>
    </div>
  );
}
