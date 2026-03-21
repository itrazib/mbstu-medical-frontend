import { FaUserCheck, FaUserClock, FaHeartbeat } from "react-icons/fa";
import { MdEmergency, MdOutlineLocalHospital } from "react-icons/md";
import { Link } from "react-router";
// import logo from "../assets/MBSTU_logo.png"
import doctor_standing from "../assets/doctor_standing.jpg";
import ServicePage from "../PAges/common/servicePage/ServicePage";

const Home = () => {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-80 flex items-center justify-center overflow-hidden mb-6">
        <img
          src="https://cdn-ilddgbh.nitrocdn.com/KCiiUwRzwPIrRDjogfTRMgHMpGyyzAgg/assets/images/optimized/rev-f7111be/mbstu.ac.bd/wp-content/uploads/2024/11/Overview-photo-1-1-768x628.jpeg"
          alt="MBSTU Medical Center"
          className="w-full h-full object-cover absolute inset-0 brightness-75"
        />
        <div className="text-center text-white font-poetsen px-4 py-8 relative z-10 flex items-center justify-center h-full w-full">
          <div className="text-4xl lg:text-5xl font-bold leading-snug">
            Welcome to
            <br className="sm:block md:hidden" />
            <span className="text-red-700 drop-shadow-lg"> MBSTU </span>
            <br className="sm:block md:block lg:hidden" />
            Medical Center
          </div>
        </div>
      </div>

      {/* About Us Section */}
      <section>
        <div className="bg-teal-50 py-10 px-4 md:px-12 mx-auto">
          <div className="container mx-auto px-8 md:px-16">
            <div className="flex flex-col md:flex-row justify-center md:items-stretch gap-8">
              {/* Doctor Image */}
              <div className="hidden md:block md:w-[40%] md:mr-8">
                <img
                  src={doctor_standing}
                  alt="Our Doctors"
                  className="w-full h-full object-contain rounded-xl shadow-lg"
                />
              </div>

              {/* About Text */}
              <div className="w-full md:w-[60%] md:ml-8 text-left flex flex-col justify-start">
                <h2 className="text-4xl font-poetsen text-teal-500 mt-1 max-md:text-center mb-4">
                  ABOUT US
                </h2>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2 leading-relaxed">
                  We Take Care Of Your Healthy Life
                </h3>
                <p className="text-gray-600 leading-7 mb-4">
                  The Medical Center at Mawlana Bhashani Science and Technology
                  University (MBSTU) provides basic healthcare services to the
                  university community — including students, faculty members,
                  and administrative staff. Situated within the campus, the
                  center primarily offers free consultations and limited free
                  medication for students, while faculty and staff members can
                  access medical consultations and purchase prescribed medicines
                  as needed.
                </p>

                {/* Learn More Button linking to /about */}
                <Link
                  to="/about"
                  className="bg-teal-500 hover:bg-sky-800 text-white font-bold py-2 px-6 rounded-3xl focus:outline-none focus:shadow-outline w-fit border-none inline-block"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Section */}
      <ServicePage />

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
      {/* <section className="bg-green-50 py-16">
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
      </section> */}

      {/* ✅ NOTICE SECTION */}
      <section className="py-12 text-center px-4 bg-white">
        <h2 className="text-xl md:text-2xl text-red-600 font-semibold">
          ⚠️ Notice: All users must be approved by Admin before accessing
          services.
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
