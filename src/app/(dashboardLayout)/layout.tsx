import AdminSidebar from "@/components/sidebar/admin-sidebar";
import UserSidebar from "@/components/sidebar/user-sidebar";
import ProtectedLayout from "../(commonLayout)/(protected)/layout";
import { getCurrentUser } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <ProtectedLayout>
      <div className="flex min-h-screen bg-gray-50">
        {user?.role === "admin" ? <AdminSidebar /> : <UserSidebar userName={user?.name} />}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </ProtectedLayout>
  );
}
