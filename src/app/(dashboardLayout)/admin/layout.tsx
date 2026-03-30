import { requireAdmin } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // This will redirect to /unauthorized if the user is not an admin
  await requireAdmin();

  return <>{children}</>;
}
