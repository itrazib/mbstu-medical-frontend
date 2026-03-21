import React, { useState } from "react";

const DispenseDetail = ({ record, onUpdate }) => {
  const [loading, setLoading] = useState(false);

  async function toggleRequest() {
    setLoading(true);
    const nextStatus =
      record.overallStatus === "pending" ? "completed" : "pending";
    const token = localStorage.getItem("token");

    try {
      // Update overallStatus
      const res = await fetch(
        `http://localhost:5000/api/dispense/dispense-records/${record._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ overallStatus: nextStatus }),
        }
      );
      if (!res.ok) throw new Error("Failed to update status");

      // If completed, finalize dispense
      if (nextStatus === "completed") {
        const finalizeRes = await fetch(
          `http://localhost:5000/api/dispense/dispense-records/${record._id}/finalize`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!finalizeRes.ok) throw new Error("Failed to finalize dispense");
      }

      onUpdate(); // Refresh parent list
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 flex flex-col justify-between">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Request Details</h2>
        <span
          className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
            record.overallStatus === "completed"
              ? "bg-green-200 text-green-800"
              : "bg-red-200 text-red-800"
          }`}
        >
          {record.overallStatus.toUpperCase()}
        </span>
      </div>

      <ul className="flex-1 divide-y divide-gray-100">
        {record.medicines.map((item) => (
          <li key={item._id} className="py-3 flex justify-between items-center">
            <div>
              <div className="font-medium text-lg">{item.medicine.name}</div>
              <div className="text-sm text-gray-500">
                {item.medicine.dosage || "No dose info"}
              </div>
            </div>
            <span className="text-xl font-bold text-indigo-700">
              × {item.quantity}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-6 text-right">
        <button
          disabled={loading}
          onClick={toggleRequest}
          className={`px-4 py-2 rounded-md text-sm font-medium transition ${
            record.overallStatus === "pending"
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-yellow-500 hover:bg-yellow-600 text-white"
          } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {loading
            ? "..."
            : record.overallStatus === "pending"
            ? "Mark Completed"
            : "Revert Pending"}
        </button>
      </div>
    </div>
  );
};

export default DispenseDetail;