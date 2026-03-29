import React, { useEffect, useState } from "react";

export default function DoctorReport({ studentId }) {
  const [reports, setReports] = useState([]);
  const [record, setRecord] = useState(null);
  const [newMedicines, setNewMedicines] = useState([]);
  const [medName, setMedName] = useState("");
  const [medQty, setMedQty] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (studentId) {
      fetchReports();
      fetchRecord();
    }
  }, [studentId]);

  const fetchReports = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/student/reports/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setReports(data.reports);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRecord = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/doctor/patient-record/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setRecord(data.record);
    } catch (err) {
      console.error(err);
    }
  };

  const addMedicine = () => {
    if (!medName || !medQty) return;
    setNewMedicines((prev) => [...prev, { name: medName, quantity: medQty }]);
    setMedName("");
    setMedQty("");
  };

  const saveMedicines = async () => {
    if (newMedicines.length === 0) return;
    try {
      const res = await fetch("http://localhost:5000/api/doctor/add-medicine", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ recordId: record._id, medicines: newMedicines }),
      });
      const data = await res.json();
      if (data.success) {
        setRecord((prev) => ({
          ...prev,
          medicines: [...prev.medicines, ...newMedicines],
        }));
        setNewMedicines([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!record) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Patient Report</h2>

      {/* Uploaded Test Reports */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Uploaded Test Reports</h3>
        {reports.length > 0 ? (
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
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>No test reports uploaded yet.</p>
        )}
      </div>

      {/* Existing Medicines */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Existing Medicines</h3>
        {record.medicines.length > 0 ? (
          <ul className="list-disc pl-5">
            {record.medicines.map((m, i) => (
              <li key={i}>
                {m.name} ({m.quantity})
              </li>
            ))}
          </ul>
        ) : (
          <p>No medicines yet.</p>
        )}
      </div>

      {/* Add Medicines */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Add Medicines</h3>
        <div className="flex gap-2 mb-2">
          <input
            placeholder="Medicine Name"
            className="border p-2 flex-1"
            value={medName}
            onChange={(e) => setMedName(e.target.value)}
          />
          <input
            placeholder="Quantity"
            className="border p-2 w-24"
            value={medQty}
            onChange={(e) => setMedQty(e.target.value)}
          />
          <button className="bg-blue-600 text-white px-4 rounded" onClick={addMedicine}>
            Add
          </button>
        </div>

        {newMedicines.length > 0 && (
          <ul className="list-disc pl-5 mb-2">
            {newMedicines.map((m, i) => (
              <li key={i}>
                {m.name} ({m.quantity})
              </li>
            ))}
          </ul>
        )}

        <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={saveMedicines}>
          Save Medicines
        </button>
      </div>
    </div>
  );
}