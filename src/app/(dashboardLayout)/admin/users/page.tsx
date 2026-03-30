import AdminUsers from "@/components/admin-dashboard/admin-users";

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  return <AdminUsers searchParams={searchParams} />;
}
