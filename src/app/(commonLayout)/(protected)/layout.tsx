import { requireAuth } from "@/lib/auth";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  // This will redirect to /signin if not authenticated
  await requireAuth();

  return <>{children}</>;
}
