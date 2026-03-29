// src/pages/DoctorAppointments.jsx
import { useEffect, useState } from "react";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedData, setSelectedData] = useState(null);

  const [diagnosis, setDiagnosis] = useState("");
  const [note, setNote] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [availableMeds, setAvailableMeds] = useState([]);
  const [availableTests, setAvailableTests] = useState([]);
  const [selectedTests, setSelectedTests] = useState([]);

  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // ================= FETCH DOCTOR APPOINTMENTS =================
  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:5000/api/appointment/doctor-appointments", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setAppointments(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  // ================= FETCH AVAILABLE MEDICINES =================
  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:5000/api/medicine/all-medicines", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setAvailableMeds(data.medicines || []))
      .catch(console.error);
  }, [token]);

  // ================= FETCH AVAILABLE TESTS =================
  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:5000/api/diagnosis/pathology-tests", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setAvailableTests(data.tests || []))
      .catch(console.error);
  }, [token]);

  // ================= UPDATE APPOINTMENT STATUS =================
  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/appointment/update-status",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ appointmentId: id, status }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status } : a))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  // ================= MEDICINE MANAGEMENT =================
  const addMedicine = () =>
    setMedicines((prev) => [...prev, { medicineId: "", quantity: 1 }]);
  const updateMedicine = (index, field, value) => {
    const newMeds = [...medicines];
    newMeds[index][field] = field === "quantity" ? parseInt(value) : value;
    setMedicines(newMeds);
  };
  const removeMedicine = (index) =>
    setMedicines(medicines.filter((_, i) => i !== index));

  // ================= HANDLE TEST SELECTION =================
  const toggleTest = (test) => {
    if (selectedTests.find((t) => t._id === test._id)) {
      setSelectedTests(selectedTests.filter((t) => t._id !== test._id));
    } else {
      setSelectedTests([...selectedTests, test]);
    }
  };

  // ================= SUBMIT PRESCRIPTION =================
  const handleSubmitPrescription = async () => {
    if (!diagnosis.trim()) return alert("Diagnosis is required");

    // Medicine validation only if no tests
    if (selectedTests.length === 0) {
      if (medicines.length === 0) return alert("Add at least 1 medicine");
      if (medicines.some((m) => !m.medicineId || !m.quantity))
        return alert("All medicines must have selection and quantity");
    }

    try {
      const res = await fetch("http://localhost:5000/api/medical/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          studentId: selectedData.studentId,
          diagnosis: diagnosis.trim(),
          medicines: selectedTests.length > 0 ? [] : medicines,
          problem: selectedData.problem || "",
          note: note.trim() || "",
          testInfo: selectedTests,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert("Prescription saved ✅");

      // Reset
      setSelectedData(null);
      setDiagnosis("");
      setNote("");
      setMedicines([]);
      setSelectedTests([]);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to save prescription");
    }
  };

  if (loading) return <p className="text-center mt-6">Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Doctor Appointments
      </h2>

      <table className="w-full bg-white shadow rounded-xl overflow-hidden">
        <thead className="bg-blue-800 text-white">
          <tr>
            <th className="p-3 text-left">Patient</th>
            <th>Date</th>
            <th>Time</th>
            <th className="text-left">Problem</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {appointments.length ? (
            appointments.map((a) => (
              <tr key={a._id} className="border-b hover:bg-gray-50 text-center">
                <td className="p-3 text-left">{a.patientName || "Unknown"}</td>
                <td>{a.date}</td>
                <td>{a.time}</td>
                <td className="text-left">{a.problem || "N/A"}</td>
                <td
                  className={`font-semibold ${
                    a.status === "pending"
                      ? "text-yellow-600"
                      : a.status === "approved"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {a.status}
                </td>
                <td>
                  {a.status === "pending" && (
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleUpdateStatus(a._id, "approved")}
                        className="px-3 py-1 bg-green-600 text-white rounded"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(a._id, "rejected")}
                        className="px-3 py-1 bg-red-600 text-white rounded"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                  {a.status === "approved" && (
                    <button
                      onClick={() =>
                        setSelectedData({
                          studentId: a.studentId,
                          patientName: a.patientName,
                          problem: a.problem,
                        })
                      }
                      className="px-3 py-1 bg-blue-600 text-white rounded"
                    >
                      Write Prescription
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center p-4 text-gray-500">
                No appointments found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ================= PRESCRIPTION MODAL ================= */}
      {selectedData && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold mb-4">Write Prescription</h2>
            <p className="mb-1">
              <strong>Patient:</strong> {selectedData.patientName}
            </p>
            <p className="mb-3">
              <strong>Problem:</strong> {selectedData.problem || "N/A"}
            </p>

            <input
              type="text"
              placeholder="Diagnosis"
              className="border p-2 w-full mb-2"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
            />
            <textarea
              placeholder="Note (optional)"
              className="border p-2 w-full mb-2"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />

            {/* ================= TESTS UI ================= */}
            <h3 className="font-semibold mb-2">Optional Tests</h3>
            {availableTests.length === 0 ? (
              <p className="text-gray-500">No tests available</p>
            ) : (
              availableTests.map((test) => (
                <div key={test._id} className="flex items-center gap-2 mb-1">
                  <input
                    type="checkbox"
                    checked={!!selectedTests.find((t) => t._id === test._id)}
                    onChange={() => toggleTest(test)}
                  />
                  <span>{test.name}</span>
                </div>
              ))
            )}

            {/* ================= MEDICINES UI ================= */}
            {selectedTests.length === 0 && (
              <>
                <h3 className="font-semibold mb-2">Medicines</h3>
                {medicines.map((m, i) => (
                  <div key={i} className="flex gap-2 mb-2 items-center">
                    <select
                      className="border p-1 flex-1"
                      value={m.medicineId}
                      onChange={(e) =>
                        updateMedicine(i, "medicineId", e.target.value)
                      }
                    >
                      <option value="">Select medicine</option>
                      {availableMeds.map((med) => (
                        <option key={med._id} value={med._id}>
                          {med.name} ({med.type})
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min="1"
                      value={m.quantity}
                      onChange={(e) =>
                        updateMedicine(i, "quantity", e.target.value)
                      }
                      className="border p-1 w-20"
                    />
                    <button
                      onClick={() => removeMedicine(i)}
                      className="bg-red-600 text-white px-2 rounded"
                    >
                      X
                    </button>
                  </div>
                ))}
                <button
                  onClick={addMedicine}
                  className="bg-blue-600 text-white px-3 py-1 rounded mb-4"
                >
                  Add Medicine
                </button>
              </>
            )}

            {selectedTests.length > 0 && (
              <p className="text-yellow-600 mb-4">
                Tests selected. Medicines will be given after test report.
              </p>
            )}

            <div className="flex justify-between mt-3">
              <button
                onClick={() => setSelectedData(null)}
                className="px-4 py-1 bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitPrescription}
                className="px-4 py-1 bg-green-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;