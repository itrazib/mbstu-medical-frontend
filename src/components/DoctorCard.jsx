
import React, { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../Context/AuthContext";

const DoctorCard = ({ doctor }) => {
  const modalRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  const {
    name,
    designation,
    photoUrl,
    email,
    phone,
    venue = "Mawlana Bhashani Science and Technology University",
    location = "Medical Center",
  } = doctor;

  const [appointmentData, setAppointmentData] = useState({
    patientName: "",
    patientPhone: "",
    problem: "",
    date: "",
    time: "",
  });

  const handleAppointment = () => {
    user ? modalRef.current.showModal() : navigate("/login");
  };

  const handleChange = (e) => {
    setAppointmentData({ ...appointmentData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`http://localhost:5000/api/appointment/book`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...appointmentData, doctorId: doctor.userId }),
    })
      .then((res) => res.json())
      .then(() => {
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
      .catch(() => {
        alert("Error booking appointment");
      });
  };

  const fallbackImage =
    "https://i.ibb.co/2kRkZqT/doctor-avatar.png";

  return (
    <div className="bg-white rounded-3xl shadow-md hover:shadow-xl transition duration-300 flex flex-col overflow-hidden">

      {/* Doctor Image */}
      <div className="relative h-56 w-full overflow-hidden">
        <img
          src={photoUrl || fallbackImage}
          alt={name}
          className="w-full h-full object-cover object-top"
        />

        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4">
          <h2 className="text-xl font-bold text-white">{name}</h2>
          <p className="text-sm text-gray-200">{designation}</p>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1 space-y-3 text-sm text-gray-700">

        {location && (
          <p>
            <span className="font-semibold">Location:</span> {location}
          </p>
        )}

        {venue && (
          <p>
            <span className="font-semibold">Venue:</span> {venue}
          </p>
        )}

        {email && (
          <p>
            <span className="font-semibold">Email:</span> {email}
          </p>
        )}

        {phone && (
          <p>
            <span className="font-semibold">Phone:</span> {phone}
          </p>
        )}

        {/* Button */}
        <button
          onClick={handleAppointment}
          className="mt-auto w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-full font-semibold transition"
        >
          Book Appointment
        </button>
      </div>

      {/* Modal */}
      <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box p-6 rounded-2xl max-w-md">

          <h2 className="text-2xl font-bold text-teal-700 mb-5 text-center">
            Book Appointment
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="text"
              name="patientName"
              placeholder="Your Full Name"
              value={appointmentData.patientName}
              onChange={handleChange}
              required
              className="w-full border px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
            />

            <input
              type="tel"
              name="patientPhone"
              placeholder="Phone Number"
              value={appointmentData.patientPhone}
              onChange={handleChange}
              required
              className="w-full border px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
            />

            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                name="date"
                value={appointmentData.date}
                onChange={handleChange}
                required
                className="w-full border px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
              />

              <input
                type="time"
                name="time"
                value={appointmentData.time}
                onChange={handleChange}
                required
                className="w-full border px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>

            <textarea
              name="problem"
              value={appointmentData.problem}
              onChange={handleChange}
              placeholder="Describe your symptoms"
              className="w-full border px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 h-28 resize-none"
            />

            <div className="flex gap-3 mt-4">
              <button
                type="submit"
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl font-semibold"
              >
                Confirm
              </button>

              <button
                type="button"
                onClick={() => modalRef.current.close()}
                className="flex-1 bg-gray-200 hover:bg-gray-300 py-3 rounded-xl font-semibold"
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      </dialog>
    </div>
  );
};

export default DoctorCard;

