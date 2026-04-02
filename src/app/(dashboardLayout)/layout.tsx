import DashboardShell from "@/components/sidebar/DashboardShell";
import ProtectedLayout from "../(commonLayout)/(protected)/layout";
import { getCurrentUser } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <ProtectedLayout>
      <DashboardShell user={user}>
        {children}
      </DashboardShell>
    </ProtectedLayout>
  );
}
