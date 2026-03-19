import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export const TelemedicineInfo = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized. Please login.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          "http://localhost:5000/api/telemedicine/today-telemedicine-doctors",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to load doctors.");

        const data = await res.json();
        setDoctors(data.doctors || []);
      } catch (err) {
        console.error("Error fetching doctors:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div>
      <p className="mt-2">
        Patients can discuss their symptoms, receive medical advice, and get
        prescriptions without needing to visit the clinic in person.
      </p>

      <h4 className="mt-4 font-semibold text-lg">Doctors Available Today:</h4>

      {loading ? (
        <p>Loading doctors...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : doctors.length > 0 ? (
        <ul className="list-disc list-inside text-gray-700 mb-4">
          {doctors.map((doc, idx) => (
            <li key={idx}>
              {doc.name} - {doc.phone}
            </li>
          ))}
        </ul>
      ) : (
        <p>No doctors available today.</p>
      )}

      <div className="flex">
        <button
          onClick={() => navigate("/telemedicine")}
          className="bg-teal-500 hover:bg-teal-600 justify-center items-center text-white font-semibold py-2 w-[200px] my-2 rounded-full text-sm transition duration-300"
        >
          See Telemedicine Roster
        </button>
      </div>
    </div>
  );
};