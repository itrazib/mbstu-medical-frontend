import { useContext } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../../Context/AuthContext";

const DoctorNavbar = () => {
    const {user} = useContext(AuthContext)
    console.log(user)
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="bg-white shadow px-6 py-3 flex justify-between items-center">
      {/* Left */}
      <h2 className="text-xl font-bold text-blue-700">
        MBSTU Medical - Doctor Panel
      </h2>

      {/* Right */}
      <div className="flex items-center gap-4">
        <p className="text-gray-700 font-medium">
          Welcome, <span className="font-bold">{user.name}</span>
        </p>

        <button
          onClick={handleLogout}
          className="btn btn-sm btn-error text-white"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default DoctorNavbar;
