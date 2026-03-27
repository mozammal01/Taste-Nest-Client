export default function CartLoading() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20">
      {/* Hero Section Skeleton */}
      <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-secondary/10 py-12">
        <div className="container mx-auto px-4">
          <div className="h-10 w-48 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-5 w-72 bg-gray-200 rounded-lg animate-pulse mt-2" />
        </div>
      </div>

      {/* Cart Content Skeleton */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="h-8 w-40 bg-gray-200 rounded-lg animate-pulse" />
                <div className="h-4 w-24 bg-gray-200 rounded-lg animate-pulse mt-2" />
              </div>
              <div className="h-10 w-28 bg-gray-200 rounded-lg animate-pulse" />
            </div>

            {/* Item Skeletons */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-2xl border border-gray-100">
                <div className="w-full sm:w-32 h-32 bg-gray-200 rounded-xl animate-pulse" />
                <div className="flex-1 space-y-3">
                  <div className="h-6 w-48 bg-gray-200 rounded-lg animate-pulse" />
                  <div className="h-4 w-full bg-gray-200 rounded-lg animate-pulse" />
                  <div className="flex items-center justify-between mt-4">
                    <div className="h-8 w-24 bg-gray-200 rounded-lg animate-pulse" />
                    <div className="h-10 w-32 bg-gray-200 rounded-xl animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="h-7 w-36 bg-gray-200 rounded-lg animate-pulse mb-6" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-5 w-24 bg-gray-200 rounded-lg animate-pulse" />
                    <div className="h-5 w-16 bg-gray-200 rounded-lg animate-pulse" />
                  </div>
                ))}
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between">
                    <div className="h-6 w-16 bg-gray-200 rounded-lg animate-pulse" />
                    <div className="h-8 w-24 bg-gray-200 rounded-lg animate-pulse" />
                  </div>
                </div>
              </div>
              <div className="h-14 w-full bg-gray-200 rounded-xl animate-pulse mt-6" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
