import React, { useEffect, useState } from "react";
import { FaUser, FaNotesMedical, FaPills, FaFileMedical, FaUpload } from "react-icons/fa";

/* ------------------- Doctor Dashboard ------------------- */
export const DoctorTodayPatients = () => {
  const token = localStorage.getItem("token");

  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [medicineInput, setMedicineInput] = useState({ name: "", dosage: "", quantity: "" });
  const [adding, setAdding] = useState(false);

  // Fetch today's patients
  useEffect(() => {
    fetch("http://localhost:5000/api/doctor/today-patients", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => console.log("Today patirnt",data))
      .catch(() => setPatients([]));
  }, [token]);

  // Select patient and fetch medical records
  const selectPatient = async (patientId) => {
    setSelectedPatient(null);
    setMedicalRecords([]);
    try {
      const res = await fetch(`http://localhost:5000/api/student/my-history/${patientId}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      console.log("student REcorer", data)
      setSelectedPatient(patients.find(p => p._id === patientId));
      setMedicalRecords(data.records || []);
    } catch {
      setMedicalRecords([]);
    }
  };

  // Add medicine to a record
  const handleAddMedicine = async (recordId) => {
    if (!medicineInput.name || !medicineInput.dosage || !medicineInput.quantity) return alert("Fill all fields");
    setAdding(true);
    try {
      const res = await fetch("http://localhost:5000/api/doctor/add-medicine", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ recordId, medicine: { ...medicineInput } })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add medicine");

      // Update local state instantly
      setMedicalRecords(prev => prev.map(r => r._id === recordId ? { ...r, medicines: [...r.medicines, medicineInput] } : r));
      setMedicineInput({ name: "", dosage: "", quantity: "" });
      alert("Medicine added successfully!");
    } catch (err) {
      alert(err.message);
    } finally { setAdding(false); }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Today's Patients</h1>

      {/* Patients List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {patients.map(patient => (
          <div key={patient._id} className={`p-4 rounded shadow cursor-pointer ${selectedPatient?._id === patient._id ? 'bg-blue-100' : 'bg-white'}`} onClick={() => selectPatient(patient._id)}>
            <div className="flex items-center gap-2"><FaUser className="text-xl text-blue-600" /><h2 className="font-semibold">{patient.name}</h2></div>
            <p className="text-gray-500 text-sm">ID: {patient.universityId}</p>
          </div>
        ))}
      </div>

      {/* Selected Patient Details */}
      {selectedPatient && (
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4">Patient Profile</h2>
          <p><strong>Name:</strong> {selectedPatient.name}</p>
          <p><strong>Email:</strong> {selectedPatient.email}</p>
          <p><strong>Department:</strong> {selectedPatient.department}</p>
          <p><strong>Session:</strong> {selectedPatient.session}</p>

          {/* Medical Records */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Medical Records</h3>
            {medicalRecords.length === 0 ? <p className="text-gray-500">No records</p> :
              <div className="space-y-4">
                {medicalRecords.map(record => (
                  <div key={record._id} className="border-l-4 border-blue-500 p-4 rounded bg-gray-50 space-y-2">
                    <p><strong>Diagnosis:</strong> {record.diagnosis}</p>
                    <p><strong>Note:</strong> {record.note || '—'}</p>
                    <p className="flex items-center gap-2"><FaPills /> Medicines: {record.medicines.length === 0 ? 'None' : record.medicines.map(m => `${m.name} (${m.dosage} × ${m.quantity})`).join(', ')}</p>

                    {/* Test Reports */}
                    {record.testInfo && record.testInfo.length > 0 && (
                      <div className="mt-2 p-2 border rounded bg-white">
                        <p className="font-semibold text-purple-600">Tests:</p>
                        {record.testInfo.map(test => (
                          <div key={test._id} className="flex justify-between items-center mt-1">
                            <span>{test.name}</span>
                            {test.reportUrl ? <span className="text-green-600 font-semibold">Uploaded</span> : <span className="text-gray-500">Pending</span>}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Medicine */}
                    <div className="mt-2 p-2 border rounded bg-white space-y-2">
                      <h4 className="font-semibold">Add Medicine</h4>
                      <input type="text" placeholder="Name" className="border px-2 py-1 rounded w-full" value={medicineInput.name} onChange={e => setMedicineInput(prev => ({ ...prev, name: e.target.value }))} />
                      <input type="text" placeholder="Dosage" className="border px-2 py-1 rounded w-full" value={medicineInput.dosage} onChange={e => setMedicineInput(prev => ({ ...prev, dosage: e.target.value }))} />
                      <input type="number" placeholder="Quantity" className="border px-2 py-1 rounded w-full" value={medicineInput.quantity} onChange={e => setMedicineInput(prev => ({ ...prev, quantity: e.target.value }))} />
                      <button disabled={adding} onClick={() => handleAddMedicine(record._id)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">{adding ? "Adding..." : "Add Medicine"}</button>
                    </div>
                  </div>
                ))}
              </div>
            }
          </div>
        </div>
      )}
    </div>
  );
};


/* ------------------- Student Dashboard ------------------- */
export const StudentDashboard = () => {
  const token = localStorage.getItem("token");
  const [medicalRecords, setMedicalRecords] = useState([]);
  
  useEffect(() => {
    fetch("http://localhost:5000/api/student/my-history", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setMedicalRecords(data.records || []))
      .catch(() => setMedicalRecords([]));
  }, [token]);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">My Medical Records</h1>
      {medicalRecords.length === 0 ? <p className="text-gray-500">No records found</p> :
        <div className="space-y-4">
          {medicalRecords.map(record => (
            <div key={record._id} className="border-l-4 border-blue-500 p-4 rounded bg-gray-50 space-y-2">
              <p><strong>Diagnosis:</strong> {record.diagnosis}</p>
              <p><strong>Note:</strong> {record.note || '—'}</p>
              <p className="flex items-center gap-2"><FaPills /> Medicines: {record.medicines.length === 0 ? 'None' : record.medicines.map(m => `${m.name} (${m.dosage} × ${m.quantity})`).join(', ')}</p>
              {record.testInfo && record.testInfo.length > 0 && (
                <div className="mt-2 p-2 border rounded bg-white">
                  <p className="font-semibold text-purple-600">Tests:</p>
                  {record.testInfo.map(test => (
                    <div key={test._id} className="flex justify-between items-center mt-1">
                      <span>{test.name}</span>
                      {test.reportUrl ? <span className="text-green-600 font-semibold">Uploaded</span> : <span className="text-gray-500">Pending</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      }
    </div>
  );
};