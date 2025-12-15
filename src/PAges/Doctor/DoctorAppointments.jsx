// src/pages/DoctorAppointments.jsx
import { useEffect, useState } from "react";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedData, setSelectedData] = useState(null);

  const [diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState("");
  const [note, setNote] = useState("");

  const token = localStorage.getItem("token");

  // FETCH DOCTOR APPOINTMENTS
  useEffect(() => {
    fetch("http://localhost:5000/api/appointment/doctor-appointments", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("APPOINTMENTS:", data);
        // handle both [] or { appointments: [] } responses:
        setAppointments(data.appointments || data || []);
      })
      .catch((err) => console.error(err));
  }, [token]);

  // ACCEPT / REJECT
  const handleUpdateStatus = (id, status) => {
    fetch("http://localhost:5000/api/appointment/update-status", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ appointmentId: id, status }),
    })
      .then((res) => res.json())
      .then((result) => {
        // optimistic update
        setAppointments((prev) =>
          prev.map((a) => (a._id === id ? { ...a, status } : a))
        );
      })
      .catch((err) => console.log(err));
  };

  // SUBMIT PRESCRIPTION (includes appointment info + doctorName if available)
  const handleSubmitPrescription = () => {
    const payload = {
      studentId: selectedData.studentId,
      appointmentId: selectedData.appointmentId || null,
      doctorName: selectedData.doctorName || null,
      problem: selectedData.problem || null,
      diagnosis,
      prescription,
      note,
    };

    fetch("http://localhost:5000/api/medical/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        alert("Prescription saved successfully!");
        // Optionally mark appointment as completed or link
        setSelectedData(null);
        setDiagnosis("");
        setPrescription("");
        setNote("");
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">My Appointments</h2>

      <table className="table-auto w-full bg-white shadow rounded-lg">
        <thead className="bg-blue-900 text-white">
          <tr>
            <th className="px-4 py-2 text-left">Patient</th>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Time</th>
            <th className="px-4 py-2 text-left">Problem</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>

        <tbody>
          {appointments.length > 0 ? (
            appointments.map((a) => (
              <tr key={a._id} className="text-center border-b hover:bg-gray-50">
                <td className="px-4 py-2 text-left">{a.patientName || "Unknown"}</td>
                <td className="px-4 py-2">{a.date}</td>
                <td className="px-4 py-2">{a.time}</td>
                <td className="px-4 py-2 text-left text-gray-700">{a.problem || "Not Provided"}</td>

                <td className={`px-4 py-2 font-semibold ${
                    a.status === "pending" ? "text-yellow-600" :
                    a.status === "approved" ? "text-green-600" : "text-red-600"
                  }`}>
                  {a.status}
                </td>

                <td className="px-4 py-2">
                  {a.status === "pending" ? (
                    <div className="flex gap-2 justify-center">
                      <button
                        className="px-3 py-1 bg-green-600 text-white rounded"
                        onClick={() => handleUpdateStatus(a._id, "approved")}
                      >
                        Accept
                      </button>
                      <button
                        className="px-3 py-1 bg-red-600 text-white rounded"
                        onClick={() => handleUpdateStatus(a._1d, "rejected")}
                      >
                        Reject
                      </button>
                    </div>
                  ) : a.status === "approved" ? (
                    <button
                      className="px-3 py-1 bg-blue-600 text-white rounded"
                      onClick={() =>
                        setSelectedData({
                          studentId: a.studentId,
                          appointmentId: a._id,
                          patientName: a.patientName,
                          problem: a.problem,
                          doctorName: a.doctorName || null,
                        })
                      }
                    >
                      Write Prescription
                    </button>
                  ) : (
                    <span>—</span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center p-4 text-gray-500">No appointments found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* MODAL */}
      {selectedData && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4">Write Prescription</h2>

            <p className="mb-1"><strong>Patient:</strong> {selectedData.patientName}</p>
            <p className="mb-3"><strong>Problem:</strong> {selectedData.problem || "N/A"}</p>

            <input
              type="text"
              placeholder="Diagnosis"
              className="border p-2 w-full mb-2"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
            />

            <textarea
              placeholder="Prescription"
              className="border p-2 w-full mb-2"
              value={prescription}
              onChange={(e) => setPrescription(e.target.value)}
            />

            <textarea
              placeholder="Note (optional)"
              className="border p-2 w-full mb-2"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />

            <div className="flex justify-between mt-2">
              <button
                className="bg-gray-500 text-white px-4 py-1 rounded"
                onClick={() => setSelectedData(null)}
              >
                Cancel
              </button>
              <button
                className="bg-green-600 text-white px-4 py-1 rounded"
                onClick={handleSubmitPrescription}
              >
                Save Prescription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;
