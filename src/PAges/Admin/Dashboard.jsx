import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Dashboard = () => {
  const token = localStorage.getItem("token");

  const [stats, setStats] = useState({});
  const [monthly, setMonthly] = useState([]);

  useEffect(() => {
    // ----------- Fetch Stats -------------
    fetch("http://localhost:5000/api/admin/dashboard/stats", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setStats(data);
      });

    // ----------- Fetch Monthly Appointments -------------
    fetch("http://localhost:5000/api/admin/dashboard/monthly-appointments", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        console.log("Monthly API Response:", data);

        // Ensure we set an array
        if (Array.isArray(data)) {
          setMonthly(data);
        } 
        else if (Array.isArray(data.monthly)) {
          setMonthly(data.monthly);
        }
        else if (data && typeof data === "object") {
          // Convert object -> array
          const converted = Object.keys(data).map(key => ({
            _id: key,
            count: data[key]
          }));
          setMonthly(converted);
        } 
        else {
          setMonthly([]);
        }
      });
  }, []);

  const chartData = {
    labels: Array.isArray(monthly) ? monthly.map(item => item._id) : [],
    datasets: [
      {
        label: "Appointments",
        data: Array.isArray(monthly) ? monthly.map(item => item.count) : [],
        backgroundColor: "rgba(54, 162, 235, 0.7)"
      }
    ]
  };

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-6">Admin Dashboard</h1>

      {/* ======== Stats Cards ======== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-blue-600 text-white p-6 rounded shadow">
          <h2 className="text-xl">Total Students</h2>
          <p className="text-4xl font-bold">{stats.totalStudents}</p>
        </div>

        <div className="bg-green-600 text-white p-6 rounded shadow">
          <h2 className="text-xl">Total Doctors</h2>
          <p className="text-4xl font-bold">{stats.totalDoctors}</p>
        </div>

        <div className="bg-purple-600 text-white p-6 rounded shadow">
          <h2 className="text-xl">Appointments</h2>
          <p className="text-4xl font-bold">{stats.totalAppointments}</p>
        </div>

        <div className="bg-red-600 text-white p-6 rounded shadow">
          <h2 className="text-xl">Today's Appointments</h2>
          <p className="text-4xl font-bold">{stats.todaysAppointments}</p>
        </div>
      </div>

      {/* ======== Status Info ======== */}
      <div className="mt-10 p-6 bg-white shadow rounded">
        <h2 className="text-2xl font-bold mb-4">Appointment Status</h2>

        {stats.statusCounts &&
          stats.statusCounts.map(s => (
            <p key={s._id} className="text-lg">
              {s._id.toUpperCase()}: {s.count}
            </p>
          ))}
      </div>

      {/* ======== Monthly Chart ======== */}
      <div className="mt-10 p-6 bg-white shadow rounded">
        <h2 className="text-2xl font-bold mb-4">Monthly Appointments</h2>

        {Array.isArray(monthly) && monthly.length > 0 ? (
          <Bar data={chartData} />
        ) : (
          <p className="text-gray-500">No data available</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
