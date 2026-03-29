import { useEffect, useState } from "react";

export default function AdminVaccinationPanel() {
  const [pending, setPending] = useState([]);
  const token = localStorage.getItem("token");

  const fetchPending = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/vaccine/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPending(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleVerify = async (id, doseNumber) => {
    try {
      const res = await fetch(`http://localhost:5000/api/vaccine/verify/${id}/${doseNumber}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      alert(data.message);
      fetchPending();
    } catch (err) {
      console.error(err);
      alert("Error verifying");
    }
  };

  const handleReject = async (id, doseNumber) => {
    try {
      const res = await fetch(`http://localhost:5000/api/vaccine/reject/${id}/${doseNumber}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      alert(data.message);
      fetchPending();
    } catch (err) {
      console.error(err);
      alert("Error rejecting");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Pending Vaccinations</h2>
      {pending.map(v => (
        <div key={v._id} className="mb-4 p-3 border rounded">
          <p>
            <strong>{v.user.name}</strong> ({v.user.universityId}) — {v.vaccineName}
          </p>
          {v.doses.map(d => (
            <div key={d.doseNumber} className="ml-4 flex items-center gap-2">
              <span>Dose {d.doseNumber} — {d.status}</span>
              {d.status === "pending" && (
                <>
                  <button
                    className="px-2 py-1 bg-green-600 text-white rounded"
                    onClick={() => handleVerify(v._id, d.doseNumber)}
                  >
                    Verify
                  </button>
                  <button
                    className="px-2 py-1 bg-red-600 text-white rounded"
                    onClick={() => handleReject(v._id, d.doseNumber)}
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}