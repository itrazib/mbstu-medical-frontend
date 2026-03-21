import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeftIcon, PencilIcon } from "lucide-react";

export default function MedicineDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Unauthorized. Please login.");

        const res = await fetch(`http://localhost:5000/api/medicine/medicines/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch medicine");

        setMedicine(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMedicine();
  }, [id]);

  if (loading) return <p className="p-6 text-gray-500">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!medicine) return <p className="p-6 text-gray-500">No data found.</p>;

  const {
    name,
    genericName,
    dosage,
    type,
    manufacturer,
    mainStockQuantity,
    monthlyStockQuantity,
    price,
    expiryDate,
    batchNumber,
    storageCondition,
    sideEffects,
    usageInstructions,
  } = medicine;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-blue-600 to-teal-400 text-white rounded-2xl p-8 shadow-lg">
        <button onClick={() => navigate(-1)}
                className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center bg-white/30 hover:bg-white/50 rounded-full">
          <ArrowLeftIcon size={16} />
        </button>
        <button onClick={() => navigate(`/staff-dashboard/medicines/${id}/edit`)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/30 hover:bg-white/50 rounded-full">
          <PencilIcon size={16} />
        </button>
        <h1 className="text-4xl font-bold">{name}</h1>
        <p className="mt-2 italic">{genericName} • {dosage || "N/A"}</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {[
          { label: "Form", value: type },
          { label: "Manufacturer", value: manufacturer || "N/A" },
          { label: "Main Stock", value: mainStockQuantity },
          { label: "Monthly Stock", value: monthlyStockQuantity },
          { label: "Price", value: price ? `${price} BDT` : "N/A" },
          { label: "Expiry", value: expiryDate ? new Date(expiryDate).toLocaleDateString() : "N/A" },
          { label: "Batch", value: batchNumber || "N/A" },
        ].map(item => (
          <div key={item.label} className="bg-white p-6 rounded-xl shadow">
            <p className="text-xs text-gray-500 uppercase">{item.label}</p>
            <p className="mt-1 text-lg font-semibold text-gray-700">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Extra Sections */}
      <div className="mt-8 space-y-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-2">Storage</h2>
          <p>{storageCondition || "N/A"}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-2">Side Effects</h2>
          {sideEffects?.length ? (
            <ul className="list-disc pl-5 space-y-1">
              {sideEffects.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          ) : <p>None</p>}
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-2">Usage</h2>
          <p>{usageInstructions || "N/A"}</p>
        </div>
      </div>
    </div>
  );
}