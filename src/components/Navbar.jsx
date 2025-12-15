import { useContext, useState } from "react";
import { Link, NavLink } from "react-router";
import { AuthContext } from "../Context/AuthContext";
import logo from "../assets/MBSTU_logo.png"

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [peopleOpen, setPeopleOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "font-semibold text-green-600" : ""
          }
        >
          Home
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? "font-semibold text-green-600" : ""
          }
        >
          About Us
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/services"
          className={({ isActive }) =>
            isActive ? "font-semibold text-green-600" : ""
          }
        >
          Service
        </NavLink>
      </li>
       {/* People Dropdown (Desktop + Mobile inside full menu) */}
          <li className="relative">
            <button
              onClick={() => setPeopleOpen(!peopleOpen)}
              className="hover:text-green-600 font-medium"
            >
              People ▼
            </button>

            {peopleOpen && (
              <ul className="absolute top-full left-0 mt-1 bg-white text-black rounded shadow-lg w-36 z-50">
                <li>
                  <NavLink
                    to="/doctor"
                    className="block px-4 py-2 hover:bg-gray-200"
                  >
                    Doctor
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/people/staff"
                    className="block px-4 py-2 hover:bg-gray-200"
                  >
                    Staff
                  </NavLink>
                </li>
              </ul>
            )}
          </li>

      {user && (
        <>
         

          <li>
            <NavLink
              to="/student/my-appoinments"
              className={({ isActive }) =>
                isActive ? "font-semibold text-green-600" : ""
              }
            >
              My Appointments
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/student/certificate"
              className={({ isActive }) =>
                isActive ? "font-semibold text-green-600" : ""
              }
            >
              Certificates
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/student/dashboard"
              className={({ isActive }) =>
                isActive ? "font-semibold text-green-600" : ""
              }
            >
              Dashboard
            </NavLink>
          </li>
        </>
      )}
    </>
  );

  return (
    <div className="navbar bg-base-100 shadow-md px-1 relative">

      {/* -------- MOBILE LEFT HAMBURGER -------- */}
      <div className="navbar-start lg:hidden">
        <div className="dropdown">
          <button
            className="btn btn-ghost"
            onClick={() => setPeopleOpen(!peopleOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {peopleOpen && (
            <ul className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52 z-50">
              {links}
            </ul>
          )}
        </div>
      </div>

      {/* -------- MOBILE CENTER LOGO -------- */}
      <div className="navbar-center lg:hidden">
        <Link to="/" className="btn btn-ghost text-sm font-bold"><img className="w-8 h-8" src={logo} alt="" /><span>MBSTU MEDICAL CENTER</span></Link>
      </div>

      {/* -------- DESKTOP LEFT LOGO -------- */}
      <div className="navbar-start hidden lg:flex">
         <Link to="/" className="btn btn-ghost text-sm font-bold"><img className="w-8 h-8" src={logo} alt="" /><span>MBSTU MEDICAL CENTER</span></Link>
      </div>

      {/* -------- DESKTOP CENTER NAVIGATION -------- */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{links}</ul>
      </div>

      {/* -------- DESKTOP RIGHT LOGIN/LOGOUT -------- */}
      <div className="navbar-end hidden lg:flex">
        {user ? (
          <button
            onClick={logout}
            className="btn bg-red-600 hover:bg-red-700 text-white"
          >
            Logout
          </button>
        ) : (
          <>
            <Link to="/login">
              <button className="btn">Login</button>
            </Link>
            <Link to="/register">
              <button className="btn ml-2">Register</button>
            </Link>
          </>
        )}
      </div>

      {/* -------- MOBILE RIGHT ⋮ MENU -------- */}
      <div className="navbar-end lg:hidden">
        <button
          className="btn btn-ghost"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          ⋮
        </button>

        {mobileMenuOpen && (
          <ul className="absolute right-4 top-16 bg-white shadow-lg rounded p-2 w-36 z-50">
            {user ? (
              <li>
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                >
                  Logout
                </button>
              </li>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    className="block px-4 py-2 hover:bg-gray-200"
                  >
                    Login
                  </Link>
                </li>

                <li>
                  <Link
                    to="/register"
                    className="block px-4 py-2 hover:bg-gray-200"
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Navbar;
