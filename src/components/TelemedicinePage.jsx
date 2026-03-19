import React, { useState, useEffect, useRef } from "react";
import { Phone, ChevronDown } from "lucide-react";

// Modal component
const Modal = ({ day, doctor, onClose }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-teal-600 text-white w-6 h-6 rounded-full flex items-center justify-center"
        >
          ×
        </button>

        <h3 className="text-xl font-bold text-teal-600 mb-4">
          {day} – Doctor Info
        </h3>

        {doctor ? (
          <>
            <p>
              <span className="font-semibold">Doctor:</span>{" "}
              {doctor?.name || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Phone:</span>{" "}
              {doctor?.phone || "N/A"}
            </p>
          </>
        ) : (
          <p className="italic text-gray-500">No doctor assigned.</p>
        )}
      </div>
    </div>
  );
};

const daysOfWeek = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

const TelemedicinePage = () => {
  const [expandedDay, setExpandedDay] = useState(null);
  const [showModalOnLoad, setShowModalOnLoad] = useState(false);
  const [roster, setRoster] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Saturday based today
  const getToday = () => {
    const map = [1, 2, 3, 4, 5, 6, 0];
    return daysOfWeek[map[new Date().getDay()]];
  };

  useEffect(() => {
    const fetchRoster = async () => {
      try {
        setLoading(true);

        const res = await fetch("http://localhost:5000/api/telemedicine/telemedicine-duty-api");
        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();
        console.log(data);
        const duties = data || [];

        const mapped = {};
        duties.forEach((item) => {
          if (item.day && item.doctor) {
            mapped[item.day] = item.doctor;
          }
        });

        setRoster(mapped);
        setShowModalOnLoad(true);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Failed to load telemedicine roster.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoster();
  }, []);

  const today = getToday();

  const handleToggle = (day) => {
    if (showModalOnLoad) setShowModalOnLoad(false);
    setExpandedDay(expandedDay === day ? null : day);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-teal-600">
        Loading telemedicine schedule...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-teal-50 py-10 px-4">
      <h2 className="text-3xl font-poetsen text-center text-teal-500 mb-8">
        Telemedicine Duty Schedule
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {daysOfWeek.map((day) => {
          const doctor = roster[day];
          const isExpanded = expandedDay === day;

          return (
            <div
              key={day}
              onClick={() => handleToggle(day)}
              className={`bg-white border rounded-xl shadow cursor-pointer transition-all duration-300 ${
                isExpanded ? "p-6" : "p-4 h-28"
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-teal-600" />
                  <h3 className="text-xl font-semibold text-teal-700">
                    {day}
                  </h3>
                </div>
                <ChevronDown
                  className={`w-5 h-5 transition ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </div>

              {isExpanded && (
                <div className="mt-4 text-sm text-gray-700">
                  {doctor ? (
                    <>
                      <p>
                        <span className="font-medium">Doctor:</span>{" "}
                        {doctor?.name}
                      </p>
                      <p>
                        <span className="font-medium">Phone:</span>{" "}
                        {doctor?.phone}
                      </p>
                    </>
                  ) : (
                    <p className="italic text-gray-500">
                      No doctor assigned for this day.
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showModalOnLoad && roster[today] && (
        <Modal
          day={today}
          doctor={roster[today]}
          onClose={() => setShowModalOnLoad(false)}
        />
      )}
    </div>
  );
};

export default TelemedicinePage;
