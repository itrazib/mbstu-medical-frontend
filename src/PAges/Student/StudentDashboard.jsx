import React, { useEffect, useState } from "react";
import { FaUser, FaCalendarAlt, FaSyringe, FaNotesMedical, FaFileMedical } from "react-icons/fa";

const StudentDashboard = () => {
  const token = localStorage.getItem("token");

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  const [appointments, setAppointments] = useState([]);
  const [vaccine, setVaccine] = useState(null);
  const [certificate, setCertificate] = useState(null);

  const [medicalRecords, setMedicalRecords] = useState([]);
  const [reports, setReports] = useState([]);

  const [uploadingTests, setUploadingTests] = useState({});

  /* ================= PROFILE ================= */
  useEffect(() => {
    fetch("http://localhost:5000/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setStudent(data))
      .finally(() => setLoading(false));
  }, [token]);

  /* ================= APPOINTMENT ================= */
  useEffect(() => {
    fetch("http://localhost:5000/api/appointment/my-appointments", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setAppointments(data))
      .catch(() => setAppointments([]));
  }, [token]);

  /* ================= VACCINE ================= */
  useEffect(() => {
    fetch("http://localhost:5000/api/vaccine/my", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (!data.message) {
          setVaccine(data);
          setCertificate(data.certificate || null);
        }
      })
      .catch(() => { });
  }, [token]);

  /* ================= MEDICAL HISTORY ================= */
  useEffect(() => {
    fetch("http://localhost:5000/api/student/my-history", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setMedicalRecords(data.records || []))
      .catch(() => setMedicalRecords([]));
  }, [token]);

  /* ================= REPORTS ================= */
  const fetchReports = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/student/reports", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setReports(data.reports || []);
    } catch {
      setReports([]);
    }
  };
  useEffect(() => { fetchReports(); }, [token]);

  /* ================= FILE SELECT ================= */
  const handleFileSelect = (testId, file) => {
    setUploadingTests(prev => ({
      ...prev,
      [testId]: { file, uploaded: false }
    }));
  };

  /* ================= REPORT UPLOAD ================= */
  const handleInlineUpload = async (testId, recordId) => {
    const file = uploadingTests[testId]?.file;
    if (!file) return alert("Select file first");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("testId", testId);
    formData.append("recordId", recordId);

    try {
      const res = await fetch("http://localhost:5000/api/student/upload-report", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setUploadingTests(prev => ({
        ...prev,
        [testId]: { ...prev[testId], uploaded: true }
      }));

      fetchReports();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!student) return <p className="text-center mt-10 text-red-500">Student not found</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Welcome, {student.name}</h1>

      {/* ================= PROFILE + VACCINE + RECORDS CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow rounded-xl p-6 flex gap-4 items-center">
          <FaUser className="text-3xl text-blue-600" />
          <div>
            <h2 className="font-bold text-lg">Profile</h2>
            <p>Email: {student.email}</p>
            <p>Department: {student.department}</p>
            <p>Session: {student.session}</p>
            <p>University ID: {student.universityId}</p>
          </div>
        </div>

        <div className="bg-white shadow rounded-xl p-6 flex gap-4 items-center">
          <FaSyringe className="text-3xl text-purple-600" />
          <div>
            <h2 className="font-bold text-lg">Vaccine</h2>
            {vaccine ? <p>{vaccine.status}</p> : <p className="text-gray-500">No vaccine info</p>}
          </div>
        </div>

        <div className="bg-white shadow rounded-xl p-6 flex gap-4 items-center">
          <FaNotesMedical className="text-3xl text-red-500" />
          <div>
            <h2 className="font-bold text-lg">Medical Records</h2>
            <p>{medicalRecords.length} records</p>
          </div>
        </div>
      </div>

      {/* ================= APPOINTMENTS TABLE ================= */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <FaCalendarAlt /> My Appointments
        </h2>
        {appointments.length === 0 ? (
          <p className="text-gray-500">No appointments scheduled.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-2 border">Date</th>
                  <th className="px-4 py-2 border">Time</th>
                  <th className="px-4 py-2 border">Doctor</th>
                  <th className="px-4 py-2 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((a) => (
                  <tr key={a._id} className="even:bg-gray-50 hover:bg-gray-100">
                    <td className="px-4 py-2 border">{new Date(a.date).toLocaleDateString()}</td>
                    <td className="px-4 py-2 border">{a.time}</td>
                    <td className="px-4 py-2 border">{a.doctorName || "Unknown"}</td>
                    <td className="px-4 py-2 border">{a.status || "Pending"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= MEDICAL RECORDS ================= */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">Medical Records & Prescriptions</h2>
        {medicalRecords.length === 0 ? (
          <p className="text-gray-500">No records found</p>
        ) : (
          <div className="space-y-4">
            {medicalRecords.map(record => (
              <div key={record._id} className="border-l-4 border-blue-500 p-4 rounded bg-gray-50 space-y-2">
                <p className="font-semibold">Diagnosis: {record.diagnosis || "N/A"}</p>
                <p>Note: {record.note || "—"}</p>

                {(!record.testInfo || record.testInfo.length === 0) && (
                  <p>
                    Medicines: {record.medicines?.map(m => `${m.name || "Unknown"} × ${m.quantity}`).join(", ") || "None"}
                  </p>
                )}

                {record.testInfo && record.testInfo.length > 0 && (
                  <div className="mt-2 p-2 border rounded bg-white">
                    <p className="font-semibold text-purple-600 mb-2">Tests prescribed by doctor:</p>
                    {record.testInfo.map(test => (
                      <div key={test._id} className="flex gap-2 items-center mt-1">
                        <span className="flex-1">{test.name}</span>
                        <input
                          type="file"
                          onChange={(e) => handleFileSelect(test._id, e.target.files[0])}
                          className="border rounded px-2 py-1"
                        />
                        <button
                          onClick={() => handleInlineUpload(test._id, record._id)}
                          className={`px-2 py-1 rounded text-sm ${uploadingTests[test._id]?.uploaded ? "bg-green-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700"}`}
                          disabled={uploadingTests[test._id]?.uploaded}
                        >
                          {uploadingTests[test._id]?.uploaded ? "Uploaded" : "Upload"}
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-gray-500 text-sm">Date: {new Date(record.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= REPORTS ================= */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <FaFileMedical /> My Reports
        </h2>
        {reports.length === 0 ? (
          <p className="text-gray-500">No reports uploaded.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.map(r => (
              <div key={r._id} className="border p-4 rounded flex flex-col gap-2 bg-gray-50">
                <p className="font-semibold">Test: {r.test?.name || "Unknown Test"}</p>
                <p className="text-gray-500 text-sm">Date: {new Date(r.createdAt).toLocaleDateString()}</p>
                <a href={`http://localhost:5000/${r.fileUrl}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  View / Download
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;