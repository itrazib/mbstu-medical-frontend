import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  FaUserMd,
  FaClock,
  FaPhoneAlt,
  FaMoneyBill,
  FaDoorOpen,
} from "react-icons/fa";
import { AuthContext } from "../../Context/AuthContext";

const DoctorDetails = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const modalRef = useRef(null);
  const token = localStorage.getItem("token");

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  const [appointmentData, setAppointmentData] = useState({
    patientName: "",
    patientPhone: "",
    problem: "",
    date: "",
    time: "",
  });

  const handleAppointment = () => {

    {
      user ? modalRef.current.showModal() : navigate("/login");
    }
  };

  useEffect(() => {
    fetch(`http://localhost:5000/api/doctor/details/${id}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setDoctor(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id, token]);

  const handleChange = (e) => {
    setAppointmentData({ ...appointmentData, [e.target.name]: e.target.value });
  };
  // console.log(doctor.userId)
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(appointmentData)

    fetch(`http://localhost:5000/api/appointment/book`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...appointmentData, doctorId: doctor.userId }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        alert("Appointment booked successfully!");
        setAppointmentData({
          patientName: "",
          patientPhone: "",
          problem: "",
          date: "",
          time: "",
        });
        modalRef.current.close();
      })
      .catch((err) => {
        console.error(err);
        alert("Error booking appointment");
      });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!doctor) {
    return <p className="text-center mt-10 text-red-500">Doctor not found</p>;
  }

  return (
    <div className="relative">
      {/* Doctor Details Content */}
      <div className="max-w-6xl mx-auto p-6 mt-10 bg-white shadow-xl rounded-2xl">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row items-center gap-8">
          <img
            src={doctor.image || "https://i.ibb.co/TP7w3F3/doctor.png"}
            alt="doctor"
            className="w-64 h-64 object-cover rounded-2xl border-4 border-blue-500"
          />
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-blue-700">{doctor.name}</h1>
            <p className="text-lg font-semibold">{doctor.department}</p>
            <p className="text-gray-600">{doctor.specialization}</p>
            <div className="mt-4 flex flex-wrap gap-4">
              <span className="bg-blue-100 px-4 py-2 rounded-full flex items-center gap-2">
                <FaUserMd /> {doctor.experience}
              </span>
              <span className="bg-green-100 px-4 py-2 rounded-full flex items-center gap-2">
                <FaClock /> {doctor.availableTime}
              </span>
              <span className="bg-purple-100 px-4 py-2 rounded-full">
                {doctor.days}
              </span>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="grid md:grid-cols-2 gap-6 mt-10">
          <div className="p-5 bg-gray-100 rounded-xl space-y-2">
            <h2 className="font-semibold text-lg">🎓 Education</h2>
            <p>{doctor.education}</p>
          </div>
          <div className="p-5 bg-gray-100 rounded-xl space-y-2 flex gap-2 items-center">
            <FaDoorOpen className="text-blue-600 text-xl" />
            <p>
              <strong>Room:</strong> {doctor.room}
            </p>
          </div>
          <div className="p-5 bg-gray-100 rounded-xl space-y-2 flex gap-2 items-center">
            <FaPhoneAlt className="text-green-600 text-xl" />
            <p>
              <strong>Phone:</strong> {doctor.phone}
            </p>
          </div>
          <div className="p-5 bg-gray-100 rounded-xl space-y-2 flex gap-2 items-center">
            <FaMoneyBill className="text-purple-600 text-xl" />
            <p>
              <strong>Fee:</strong> {doctor.fee}
            </p>
          </div>
        </div>

        {/* Bio Section */}
        <div className="mt-8 p-6 bg-blue-50 rounded-xl">
          <h2 className="text-xl font-bold mb-2">About Doctor</h2>
          <p className="text-gray-700">{doctor.bio}</p>
        </div>

        {/* Booking Button */}
        <div className="mt-8 text-center">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-xl text-lg font-semibold duration-300"
            onClick={() => handleAppointment()}
          >
            Book Appointment
          </button>

          <dialog
            ref={modalRef}
            id="my_modal_5"
            className="modal modal-bottom sm:modal-middle"
          >
            <div className="modal-box">
              <h2 className="text-2xl font-bold mb-4">Book Appointment</h2>

              <div className="modal-action">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    name="patientName"
                    placeholder="Your Name"
                    value={appointmentData.patientName}
                    onChange={handleChange}
                    required
                    className="w-full border px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <input
                    type="text"
                    name="patientPhone"
                    placeholder="Phone Number"
                    value={appointmentData.patientPhone}
                    onChange={handleChange}
                    required
                    className="w-full border px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <input
                    type="date"
                    name="date"
                    value={appointmentData.date}
                    onChange={handleChange}
                    required
                    className="w-full border px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <textarea  name="problem" value={appointmentData.problem} onChange={handleChange}  className="textarea w-full border px-4 py-2" placeholder="Symtoms"></textarea>
                  <input
                    type="time"
                    name="time"
                    value={appointmentData.time}
                    onChange={handleChange}
                    required
                    className="w-full border px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
                  >
                    Confirm Appointment
                  </button>
                </form>
              </div>
            </div>
          </dialog>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetails;
