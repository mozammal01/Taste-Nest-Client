import { Loading } from "@/components/ui/loading";

export default function DashboardLoading() {
  return (
    <div className="flex-1 min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loading variant="food" size="xl" />
        <h2 className="mt-6 text-xl font-bold text-gray-900">Loading Dashboard</h2>
        <p className="mt-2 text-gray-500">Please wait...</p>
      </div>
    </div>
  );
}
