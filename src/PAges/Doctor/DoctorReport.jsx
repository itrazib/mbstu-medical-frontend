import React, { useEffect, useState } from "react";

export default function DoctorReport({ studentId, token }) {
  const [reports, setReports] = useState([]);
  const [record, setRecord] = useState(null);
  const [newMedicines, setNewMedicines] = useState([]);
  const [medName, setMedName] = useState("");
  const [medQty, setMedQty] = useState("");

  useEffect(() => {
    if (!studentId) return;

    const fetchData = async () => {
      try {
        // fetch all reports
        const resReports = await fetch(`http://localhost:5000/api/student/reports/${studentId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const dataReports = await resReports.json();
        if (dataReports.success) setReports(dataReports.reports);

        // fetch existing medical record
        const resRecord = await fetch(`http://localhost:5000/api/doctor/patient-record/${studentId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const dataRecord = await resRecord.json();
        if (dataRecord.success) setRecord(dataRecord.record);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [studentId]);

  const addMedicine = () => {
    if (!medName || !medQty) return;
    setNewMedicines(prev => [...prev, { name: medName, quantity: medQty }]);
    setMedName("");
    setMedQty("");
  };

  const saveMedicines = async () => {
    if (!record || newMedicines.length === 0) return;

    try {
      const res = await fetch(`http://localhost:5000/api/doctor/record/${record._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ 
          medicines: [...record.medicines, ...newMedicines],
          diagnosis: record.diagnosis,
          note: record.note
        })
      });
      const data = await res.json();
      if (data.success) {
        setRecord(data.record);
        setNewMedicines([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!record) return <p>Loading...</p>;

  return (
    <div className="bg-white p-6 rounded shadow space-y-4">
      <h2 className="text-xl font-bold">Reports & Prescription</h2>

      <div>
        <h3 className="font-semibold">Uploaded Reports</h3>
        <ul>
          {reports.map(r => (
            <li key={r._id}>
              <a href={`http://localhost:5000/${r.fileUrl}`} target="_blank" rel="noreferrer">
                {r.fileUrl.split("/").pop()}
              </a> - {new Date(r.createdAt).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-semibold">Existing Medicines</h3>
        <ul>
          {record.medicines.map((m, i) => (
            <li key={i}>{m.name} ({m.quantity})</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-semibold">Add Medicines</h3>
        <div className="flex gap-2 mb-2">
          <input placeholder="Medicine Name" className="border p-2 flex-1" value={medName} onChange={e => setMedName(e.target.value)} />
          <input placeholder="Quantity" className="border p-2 w-24" value={medQty} onChange={e => setMedQty(e.target.value)} />
          <button className="bg-blue-600 text-white px-4 rounded" onClick={addMedicine}>Add</button>
        </div>
        {newMedicines.length > 0 && (
          <ul className="list-disc pl-5 mb-2">
            {newMedicines.map((m, i) => <li key={i}>{m.name} ({m.quantity})</li>)}
          </ul>
        )}
        <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={saveMedicines}>Save Medicines</button>
      </div>
    </div>
  );
}