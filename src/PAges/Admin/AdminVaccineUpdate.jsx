import { useState } from "react";

export default function AdminVaccineUpdate() {

  const [universityId, setUniversityId] = useState("");
  const [dose1, setDose1] = useState(false);
  const [dose2, setDose2] = useState(false);
  const [msg, setMsg] = useState("");
    const token = localStorage.getItem("token");

  const update = async () => {
    setMsg("");

    if (!universityId) {
      setMsg("❌ University ID is required");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/vaccine/update-vaccine", {
        method: "POST",
        headers: { "Content-Type": "application/json" ,
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ universityId, dose1, dose2 }),
      });

      const data = await res.json();
      setMsg(data.message);

    } catch (error) {
      console.error(error);
      setMsg("❌ Update failed! Try again.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">

      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Update Vaccine Status</h2>

        {/* University ID */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">University ID</label>
          <input
            type="text"
            placeholder="Enter student university ID"
            value={universityId}
            onChange={(e) => setUniversityId(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Dose 1 */}
        <div className="flex items-center gap-2 mb-3">
          <input
            type="checkbox"
            checked={dose1}
            onChange={(e) => setDose1(e.target.checked)}
          />
          <label className="font-medium">Dose 1 Completed</label>
        </div>

        {/* Dose 2 */}
        <div className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={dose2}
            onChange={(e) => setDose2(e.target.checked)}
          />
          <label className="font-medium">Dose 2 Completed</label>
        </div>

        {/* Message */}
        {msg && (
          <p
            className={`text-center mb-3 font-semibold ${
              msg.includes("success") ? "text-green-600" : "text-red-600"
            }`}
          >
            {msg}
          </p>
        )}

        {/* Update Button */}
        <button
          onClick={update}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Update Vaccine Status
        </button>
      </div>

    </div>
  );
}
