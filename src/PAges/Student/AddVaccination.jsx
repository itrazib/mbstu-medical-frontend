import { useState, useEffect } from "react";
import Certificate from "./Certificate"; // Certificate.jsx import
const universityName = "Your University Name";
const universityLogoUrl = "/logo.png";

export default function AddVaccination() {
  const [form, setForm] = useState({
    vaccineName: "",
    doseNumber: "",
    date: "",
    center: "",
  });
  const [status, setStatus] = useState(null);
  const [existingDoses, setExistingDoses] = useState([]);
  const [certificate, setCertificate] = useState(null);
  const [userId, setUserId] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch my vaccination
  useEffect(() => {
    const fetchVaccine = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/vaccine/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!data.message && data.doses) {
          setExistingDoses(data.doses);
          setStatus(data.status);
          setUserId(data.userId); // needed for certificate
          if (data.status === "verified") setCertificate(data.certificateNo);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchVaccine();
  }, [token]);

  const handleSubmit = async () => {
    if (!form.vaccineName || !form.doseNumber || !form.date || !form.center) {
      return alert("All fields required");
    }

    try {
      const res = await fetch("http://localhost:5000/api/vaccine/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...form, doseNumber: Number(form.doseNumber) }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Submitted for verification");
        setStatus("pending");
        setExistingDoses(prev => [...prev, { ...form, status: "pending" }]);
      } else {
        alert(data.message || "Failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-50 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-2 text-center">Vaccination Registration</h2>

      <div className="mb-4 text-center">
        {status && (
          <span
            className={`inline-block px-3 py-1 rounded-full text-white ${
              status === "pending"
                ? "bg-yellow-400"
                : status === "verified"
                ? "bg-green-500"
                : "bg-red-500"
            }`}
          >
            {status.toUpperCase()}
          </span>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label>Vaccine Name</label>
          <select
            value={form.vaccineName}
            onChange={e => setForm({ ...form, vaccineName: e.target.value })}
            disabled={status === "verified"}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select Vaccine</option>
            <option>Pfizer</option>
            <option>Moderna</option>
            <option>Sinopharm</option>
          </select>
        </div>

        <div>
          <label>Dose</label>
          <select
            value={form.doseNumber}
            onChange={e => setForm({ ...form, doseNumber: e.target.value })}
            disabled={status === "verified"}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select Dose</option>
            <option value="1">Dose 1</option>
            <option value="2">Dose 2</option>
            <option value="3">Booster</option>
          </select>
        </div>

        <div>
          <label>Date</label>
          <input
            type="date"
            value={form.date}
            onChange={e => setForm({ ...form, date: e.target.value })}
            disabled={status === "verified"}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label>Center</label>
          <input
            type="text"
            value={form.center}
            onChange={e => setForm({ ...form, center: e.target.value })}
            disabled={status === "verified"}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={status === "verified"}
          className={`w-full py-2 rounded text-white ${
            status === "verified"
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          Submit for Verification
        </button>
      </div>

      {existingDoses.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold mb-1">Existing Doses:</h3>
          <ul className="space-y-1">
            {existingDoses.map(d => (
              <li key={d.doseNumber}>
                Dose {d.doseNumber}: {d.date} at {d.center} — <strong>{d.status}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Certificate preview if fully verified */}
      {status === "verified" && userId && (
        <Certificate
          userId={userId}
          universityName={universityName}
          universityLogoUrl={universityLogoUrl}
        />
      )}
    </div>
  );
}