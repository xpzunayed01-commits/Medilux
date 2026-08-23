export function AdminDashboard() {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-green-900 text-white p-6">
        <h2 className="text-xl font-bold mb-8">MEDILUX</h2>
        <nav>
          <ul className="space-y-4">
            <li>Dashboard</li>
            <li>Orders</li>
            <li>Products</li>
            {/* Add more links */}
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-8 bg-gray-50">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p>Good morning, Admin.</p>
        {/* Add KPI cards and analytics here */}
      </main>
    </div>
  );
}
