import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";

export default function DoctorPatients() {
  const { user } = useContext(AuthContext);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [history, setHistory] = useState([]);
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem("token");
  const doctorId = user?.id;

  useEffect(() => {
    if (doctorId) fetchPatients();
  }, [doctorId]);

  const fetchPatients = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/doctor/patients/${doctorId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();

      if (data.success) {
        const map = {};

        data.patients.forEach((p) => {
          const key = p.studentId.toString();
          if (!map[key] || new Date(p.date) > new Date(map[key].date)) {
            map[key] = p;
          }
        });

        setPatients(
          Object.values(map).sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const selectPatient = async (studentId) => {
    if (!studentId) return;

    try {
      const resHistory = await fetch(
        `http://localhost:5000/api/doctor/patient-history/${studentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const dataHistory = await resHistory.json();

      if (dataHistory.success) {
        setSelectedPatient(dataHistory.patient || null);
        setHistory(dataHistory.records || []);
      }

      const resReports = await fetch(
        `http://localhost:5000/api/student/reports/${studentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const dataReports = await resReports.json();

      if (dataReports.success) {
        setReports(dataReports.reports || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredPatients = patients.filter(
    (p) =>
      p.studentDetails?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      p.studentDetails?.universityId
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex gap-6 p-6">
      
      {/* Patient List */}
      <div className="w-1/3 bg-white p-4 rounded-xl shadow max-h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-3">Patients</h2>

        <input
          className="w-full border p-2 rounded mb-4"
          placeholder="Search patient..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <ul className="space-y-2">
          {filteredPatients.map((p) => (
            <li
              key={p._id}
              onClick={() => selectPatient(p.studentId)}
              className="p-3 border rounded cursor-pointer hover:bg-blue-50"
            >
              <p className="font-semibold">
                {p.studentDetails?.name}
              </p>
              <p className="text-sm text-gray-500">
                {p.studentDetails?.universityId}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Patient Details */}
      <div className="flex-1 space-y-6">
        {!selectedPatient && (
          <p className="text-gray-500">
            Select a patient to see details
          </p>
        )}

        {selectedPatient && (
          <>
            {/* Profile */}
            <div className="bg-white p-6 rounded-xl shadow flex gap-6 items-center">
              <img
                src={
                  selectedPatient.image ||
                  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                }
                className="w-24 h-24 rounded-full"
              />

              <div>
                <h2 className="text-2xl font-bold">
                  {selectedPatient.name}
                </h2>
                <p>ID: {selectedPatient.universityId}</p>
                <p>Department: {selectedPatient.department}</p>
                <p>Session: {selectedPatient.session}</p>
              </div>
            </div>

            {/* Visit History */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-lg font-semibold mb-4">
                Visit Timeline
              </h3>

              {history.length === 0 && <p>No visits yet.</p>}

              {history.map((h) => (
                <div
                  key={h._id}
                  className="border-l-4 border-blue-500 pl-4 mb-4"
                >
                  <p className="text-sm text-gray-500">
                    {new Date(h.createdAt).toLocaleString()}
                  </p>

                  <p className="font-semibold">
                    {h.diagnosis || "Diagnosis not provided"}
                  </p>

                  <p className="text-sm">
                    Medicines:{" "}
                    {(h.medicines || [])
                      .map((m) => `${m.name} (${m.quantity})`)
                      .join(", ") || "None"}
                  </p>
                </div>
              ))}
            </div>

            {/* Reports */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-lg font-semibold mb-4">
                Uploaded Test Reports
              </h3>

              {reports.length === 0 && (
                <p>No reports uploaded yet.</p>
              )}

              <ul className="list-disc pl-5">
                {reports.map((r) => (
                  <li key={r._id}>
                    <a
                      href={`http://localhost:5000/${r.fileUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600"
                    >
                      {r.fileUrl.split("/").pop()}
                    </a>{" "}
                    - {new Date(r.createdAt).toLocaleString()}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}