import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaCalendarAlt,
  FaSyringe,
  FaNotesMedical,
} from "react-icons/fa";
import MyAppointments from "./MyAppoinments";
import VaccineForm from "./VaccineForm";
import { useNavigate } from "react-router";

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [certificate, setCertificate] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch student info
  useEffect(() => {
    fetch("http://localhost:5000/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setStudent(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  // Fetch medical history
  useEffect(() => {
    fetch("http://localhost:5000/api/medical/my-history", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setMedicalHistory(data));
  }, [token]);

  // Fetch certificate availability
  useEffect(() => {
    fetch("http://localhost:5000/api/vaccine/my", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.message) setCertificate(data);
      })
      .catch((err) => console.error(err));
  }, [token]);

  // Certificate Download Handler
  const downloadCertificate = async (certId) => {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `http://localhost:5000/api/vaccine/download/${certId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "certificate.pdf";
    a.click();
    window.URL.revokeObjectURL(url);
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!student) {
    return <p className="text-center mt-10 text-red-500">Student not found</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Welcome, {student.name}</h1>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white shadow rounded-xl p-6 flex items-center gap-4">
          <FaUser className="text-3xl text-blue-600" />
          <div>
            <h2 className="font-bold text-lg">Profile</h2>
            <p>Email: {student.email}</p>
          </div>
        </div>

        <div className="bg-white shadow rounded-xl p-6 flex items-center gap-4">
          <FaCalendarAlt className="text-3xl text-green-600" />
          <div>
            <h2 className="font-bold text-lg">Appointments</h2>
            <p>View your booked appointments</p>
          </div>
        </div>

        <div className="bg-white shadow rounded-xl p-6 flex items-center gap-4">
          <FaSyringe className="text-3xl text-purple-600" />
          <div>
            <h2 className="font-bold text-lg">Vaccine</h2>
            <p>Check your vaccination status</p>
          </div>
        </div>

        <div
          onClick={() => navigate("/student/prescription")}
          className="bg-white shadow rounded-xl p-6 flex items-center gap-4 cursor-pointer"
        >
          <FaNotesMedical className="text-3xl text-red-500" />
          <div>
            <h2 className="font-bold text-lg">Medical Records</h2>
            <p>View prescriptions</p>
          </div>
        </div>
      </div>

      {/* Vaccine Form */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Covid-19 Vaccine Info</h2>
        <VaccineForm />
      </div>

      {/* Certificate Section */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Vaccine Certificate</h2>

        {certificate ? (
          <button
            onClick={() => downloadCertificate(certificate._id)}
            className="btn btn-success text-white"
          >
            Download Certificate
          </button>
        ) : (
          <p className="text-gray-600">
            Complete Dose 1 & Dose 2 to generate certificate.
          </p>
        )}
      </div>

      {/* Medical History */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Medical Records</h2>

        {medicalHistory.length === 0 ? (
          <p className="text-gray-600">No medical records found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {medicalHistory.map((item) => (
              <div
                key={item._id}
                className="bg-white shadow rounded-xl p-5 border-l-4 border-blue-500"
              >
                <h3 className="font-bold text-lg">
                  {item.title || "Prescription"}
                </h3>
                <p className="mt-2 text-gray-700">{item.description}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Date: {new Date(item.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  Doctor: {item.doctorName}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* My Appointments */}
      <MyAppointments />
    </div>
  );
};

export default StudentDashboard;
