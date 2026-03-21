import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { useNavigate } from "react-router";

const StaffNavbar = () => {

    const {user} = useContext(AuthContext)

    const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <div className="bg-white shadow px-6 py-3 flex justify-between items-center">
      <h2 className="text-xl font-semibold">MBSTU Medical Center</h2>

      <div className="flex items-center gap-4">
        <span className="text-gray-600">{user?.name}</span>
        <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded">
          Logout
        </button>
      </div>
    </div>
  );
};

export default StaffNavbar;