import AdminUsers from "@/components/admin-dashboard/admin-users";

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<any> }) {
  return <AdminUsers searchParams={searchParams} />;
}
