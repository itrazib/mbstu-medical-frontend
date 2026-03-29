import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router";

export default function PatientHistory() {
  const { uniqueId } = useParams();
  const [patient, setPatient] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:5000/api/doctor/patient-history/${uniqueId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        console.log("Fetched patient history:", data);
        if (!res.ok) throw new Error(data.message || "Failed to fetch history");

        setPatient(data.patient);
        setRecords(data.records);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [uniqueId]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;
  if (!patient) return <p className="text-center mt-10">Patient not found</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        {patient.name} - History
      </h2>
      <Link
        to={`/doctor/patient-profile/${patient.universityId}`}
        className="text-blue-600 underline mb-6 inline-block"
      >
        ← Back to Profile
      </Link>

      {records.length === 0 ? (
        <p className="text-gray-500 mt-4">No medical records found.</p>
      ) : (
        <div className="space-y-4">
          {records.map((rec) => (
            <div
              key={rec._id}
              className="p-4 border rounded-lg shadow-sm bg-white"
            >
              <p className="font-semibold">
                Diagnosis: {rec.diagnosis || "N/A"}
              </p>
              <p>Problem: {rec.problem || "N/A"}</p>
              <p>Note: {rec.note || "—"}</p>
              <p>
                Medicines:{" "}
                {rec.medicines?.map((m) => `${m.medicineName} × ${m.quantity}`).join(", ") ||
                  "None"}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Date: {new Date(rec.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}