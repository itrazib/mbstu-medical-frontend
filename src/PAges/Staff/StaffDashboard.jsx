import { NavLink, Outlet } from "react-router";
import StaffNavbar from "./StaffNavbar";

const StaffDashboard = () => {
  const linkClass = ({ isActive }) =>
    `block p-2 rounded transition ${
      isActive ? "bg-blue-700" : "hover:bg-blue-700"
    }`;

  return (
    <div className="min-h-screen flex flex-col">
      
      {/* Top Navbar */}
      <StaffNavbar />

      <div className="flex flex-1">
        
        {/* Sidebar */}
        <div className="w-64 bg-blue-900 text-white p-5 space-y-3">
          <h1 className="text-2xl font-bold mb-6">Staff Panel</h1>

          <NavLink to="/staff-dashboard/home" className={linkClass}>
            Dashboard
          </NavLink>

          <NavLink to="/staff-dashboard/add-medicine" className={linkClass}>
            Add Medicine
          </NavLink>

          <NavLink to="/staff-dashboard/medicines" className={linkClass}>
            Manage Medicines
          </NavLink>

          <NavLink to="/staff-dashboard/medicine-out-of-stock" className={linkClass}>
            Medicine Stock
          </NavLink>

          <NavLink to="/staff-dashboard/medicines/available" className={linkClass}>
            Available Medicines
          </NavLink>
          <NavLink to="/staff-dashboard/medicines/dispense" className={linkClass}>
            Dispense Medicine
          </NavLink>
          

          <NavLink to="/staff-dashboard/monthly-dispense-report" className={linkClass}>
            Dispense Report
          </NavLink>

          <NavLink to="/staff/ambulance" className={linkClass}>
            Ambulance Service
          </NavLink>

          <NavLink to="/staff/reports" className={linkClass}>
            Reports
          </NavLink>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;