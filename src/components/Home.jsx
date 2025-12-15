import { FaUserCheck, FaUserClock, FaHeartbeat } from "react-icons/fa";
import { MdEmergency, MdOutlineLocalHospital } from "react-icons/md";
import { Link } from "react-router";
import logo from "../assets/MBSTU_logo.png"

const Home = () => {
  return (
    <div className="bg-gray-50">

      {/* ✅ HERO SECTION */}
      {/* ✅ HERO SECTION */}
<section
  className="h-[65vh] bg-cover bg-center flex items-center justify-center relative"
  style={{
    backgroundImage: "url('https://i.ibb.co/BKVn2BZH/mbstu.png')",
  }}
>
  {/* Gradient Overlay */}
  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/20"></div>

  <div className="relative text-center text-white px-6">
    <h1 className="text-4xl md:text-4xl font-bold mb-4 drop-shadow-lg flex items-center justify-center gap-3">
      <img className="w-20 h-20 drop-shadow-xl" src={logo} alt="" />
      <span className="bg-gradient-to-r from-green-200 to-green-400 bg-clip-text text-transparent drop-shadow-lg">
        MBSTU Medical Center
      </span>
    </h1>

    <p className="mb-6 text-lg md:text-xl text-white drop-shadow-md">
      A secure medical support system for MBSTU students & staff
    </p>

    <p className="italic mb-8 text-white/90 drop-shadow-md">
      "Register • Wait for Admin Approval • Get Medical Support"
    </p>

    <div className="space-x-4">
      <Link
        to="/register"
        className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-full font-semibold shadow-lg"
      >
        Register Now
      </Link>

      <Link
        to="/login"
        className="bg-white text-green-600 hover:bg-gray-200 px-6 py-3 rounded-full font-semibold shadow-lg"
      >
        Login
      </Link>
    </div>
  </div>
</section>


      {/* ✅ HOW IT WORKS */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10 text-green-700">
          How It Works
        </h2>

        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <FaUserCheck className="text-5xl text-green-600 mx-auto mb-4" />
            <h3 className="font-bold text-xl mb-2">Create Account</h3>
            <p>Register using your MBSTU email</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <FaUserClock className="text-5xl text-yellow-600 mx-auto mb-4" />
            <h3 className="font-bold text-xl mb-2">Wait for Approval</h3>
            <p>Admin will approve your account</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <FaHeartbeat className="text-5xl text-red-600 mx-auto mb-4" />
            <h3 className="font-bold text-xl mb-2">Get Service</h3>
            <p>Book doctor & medical support</p>
          </div>
        </div>
      </section>

      {/* ✅ SERVICES SECTION */}
      <section className="bg-green-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl text-center font-bold mb-10 text-green-700">
            Our Services
          </h2>

          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div className="bg-white p-6 rounded-xl shadow">
              <MdOutlineLocalHospital className="text-4xl text-green-700 mx-auto mb-3" />
              <h4 className="font-semibold">Doctor Appointment</h4>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <FaHeartbeat className="text-4xl text-red-600 mx-auto mb-3" />
              <h4 className="font-semibold">Health Checkup</h4>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <MdEmergency className="text-4xl text-orange-600 mx-auto mb-3" />
              <h4 className="font-semibold">Emergency Support</h4>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <FaUserCheck className="text-4xl text-blue-600 mx-auto mb-3" />
              <h4 className="font-semibold">Medical Records</h4>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ NOTICE SECTION */}
      <section className="py-12 text-center px-4 bg-white">
        <h2 className="text-xl md:text-2xl text-red-600 font-semibold">
          ⚠️ Notice: All users must be approved by Admin before accessing services.
        </h2>
      </section>

      {/* ✅ FOOTER */}
      {/* <footer className="bg-green-700 text-white py-8 text-center px-4">
        <h3 className="font-semibold text-lg">MBSTU Medical Service</h3>
        <p> Mawlana Bhashani Science & Technology University</p>
        <p>Email: medical@mbstu.ac.bd</p>
        <p className="mt-2 text-sm opacity-80">
          © {new Date().getFullYear()} All rights reserved
        </p>
      </footer> */}
    </div>
  );
};

export default Home;
