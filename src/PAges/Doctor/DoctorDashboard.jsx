import { NavLink, Outlet } from "react-router";
import DoctorNavbar from "./DoctorNavbar";
// import DoctorNavbar from "./DoctorNavbar";

const DoctorDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col">

      {/* Top Navbar */}
      
        <DoctorNavbar></DoctorNavbar>
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-64 bg-blue-900 text-white p-5 space-y-4">
          <h1 className="text-2xl font-bold mb-6">Doctor Panel</h1>

          <NavLink className="block hover:bg-blue-700 p-2 rounded" to="/doctor/dashboard">
            Dashboard
          </NavLink>

          <NavLink className="block hover:bg-blue-700 p-2 rounded" to="/doctor/profile">
            Edit Profile
          </NavLink>

          <NavLink className="block hover:bg-blue-700 p-2 rounded" to="/doctor/appointments">
            Appointments
          </NavLink>
        </div>

        {/* Content */}
        <div className="flex-1 p-8 bg-gray-100">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
