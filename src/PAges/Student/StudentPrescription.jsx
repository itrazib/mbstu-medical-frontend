import React, { useEffect, useState } from "react";
import { FaDownload, FaFileMedical, FaUserMd } from "react-icons/fa";
import { jsPDF } from "jspdf";

const StudentPrescription = () => {
  const [records, setRecords] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:5000/api/medical/my-history", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setRecords(data || []))
      .catch((err) => console.error(err));
  }, [token]);


  // ================================
  // Generate PDF (Working 100%)
  // ================================
  const generatePDF = (record) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Prescription Report", 10, 10);

    doc.setFontSize(12);
    doc.text(`Patient: ${record.studentName || "N/A"}`, 10, 30);
    doc.text(`Doctor: ${record.doctorName || "Doctor"}`, 10, 40);
    doc.text(`Date: ${new Date(record.createdAt).toLocaleString()}`, 10, 50);

    doc.text(`Diagnosis: ${record.diagnosis}`, 10, 70);
    doc.text(`Problem: ${record.problem}`, 10, 80);

    doc.text("Prescription:", 10, 100);
    doc.text(record.prescription, 10, 110, { maxWidth: 180 });

    if (record.note) {
      doc.text("Note:", 10, 140);
      doc.text(record.note, 10, 150, { maxWidth: 180 });
    }

    doc.save(`prescription-${record._id}.pdf`);
  };


  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Prescriptions</h2>

      {records.length === 0 ? (
        <p className="text-gray-600">No prescriptions found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {records.map((r) => (
            <div key={r._id} className="bg-white p-5 rounded shadow">
              <div className="flex items-center gap-3">
                <FaFileMedical className="text-3xl text-blue-600" />
                <div>
                  <h3 className="font-semibold">{r.diagnosis || "Prescription"}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(r.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <p className="mt-3"><strong>Problem:</strong> {r.problem || "—"}</p>
              <p className="mt-2"><strong>Prescription:</strong> {r.prescription}</p>
              {r.note && <p className="mt-1 text-gray-600">{r.note}</p>}

              <div className="flex items-center gap-2 mt-3">
                <FaUserMd className="text-green-700" />
                <span className="font-medium">{r.doctorName || "Doctor"}</span>
              </div>

              <button
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-2"
                onClick={() => generatePDF(r)}
              >
                <FaDownload /> Download PDF
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentPrescription;
