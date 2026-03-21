import { useEffect, useState } from "react";

const StaffDashboardHome = () => {
  const [stats, setStats] = useState({
    patients: 0,
    medicines: 0,
    tests: 0,
    ambulances: 0,
  });

  useEffect(() => {
    // 🔌 Replace with real API later
    const fetchStats = async () => {
      try {
        // Example:
        // const res = await fetch("/api/staff/dashboard");
        // const data = await res.json();

        // Dummy data for now
        setStats({
          patients: 120,
          medicines: 58,
          tests: 34,
          ambulances: 2,
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Staff Dashboard</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Patients */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-gray-500">Total Patients</h2>
          <p className="text-3xl font-bold mt-2">{stats.patients}</p>
        </div>

        {/* Medicines */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-gray-500">Medicine Stock</h2>
          <p className="text-3xl font-bold mt-2">{stats.medicines}</p>
        </div>

        {/* Tests */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-gray-500">Pending Tests</h2>
          <p className="text-3xl font-bold mt-2">{stats.tests}</p>
        </div>

        {/* Ambulance */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-gray-500">Available Ambulance</h2>
          <p className="text-3xl font-bold mt-2">{stats.ambulances}</p>
        </div>

      </div>

      {/* Recent Activity (optional) */}
      <div className="mt-10 bg-white p-5 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>

        <ul className="space-y-2 text-gray-600">
          <li>✔ New patient registered</li>
          <li>✔ Medicine dispensed</li>
          <li>✔ Test report uploaded</li>
        </ul>
      </div>
    </div>
  );
};

export default StaffDashboardHome;