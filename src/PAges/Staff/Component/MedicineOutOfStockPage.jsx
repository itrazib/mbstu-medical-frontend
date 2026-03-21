import React, { useEffect, useState } from "react";

// MedicineCard: modern card styling
function MedicineCard({ med }) {
  const isZero = med.monthlyStockQuantity === 0;
  const isLow = med.monthlyStockQuantity > 0 && med.monthlyStockQuantity <= 5;

  const badgeText = isZero
    ? "Out of Stock"
    : isLow
    ? `Low Stock: ${med.monthlyStockQuantity}`
    : "";

  const badgeBg = isZero ? "bg-red-100" : "bg-yellow-100";
  const badgeTextColor = isZero ? "text-red-600" : "text-yellow-600";
  const ringColor = isZero ? "ring-red-100" : "ring-yellow-100";

  return (
    <div
      className={`relative bg-white rounded-2xl p-6 shadow-md ring-1 ${ringColor} hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer`}
    >
      {badgeText && (
        <span
          className={`absolute top-4 right-4 ${badgeBg} ${badgeTextColor} text-xs font-semibold uppercase px-2 py-1 rounded-full`}
        >
          {badgeText}
        </span>
      )}
      <h3 className={`text-xl font-semibold mb-4`}>{med.name}</h3>
      <div className="space-y-1 text-gray-700">
        <p>
          <span className="font-medium text-gray-900">Generic:</span>{" "}
          {med.genericName}
        </p>
        <p>
          <span className="font-medium text-gray-900">Manufacturer:</span>{" "}
          {med.manufacturer}
        </p>
        <p>
          <span className="font-medium text-gray-900">Type:</span> {med.type}
        </p>
        <p>
          <span className="font-medium text-gray-900">Batch:</span>{" "}
          {med.batchNumber}
        </p>
        <p>
          <span className="font-medium text-gray-900">Expiry:</span>{" "}
          {new Date(med.expiryDate).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

export default function MedicineOutOfStockPage() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLowStock = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized. Please login.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          "http://localhost:5000/api/medicine/low-stock?threshold=5",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (!res.ok && res.status !== 200) throw new Error(data.message || "Failed to fetch");

        const sorted = data.sort((a, b) => {
          if (a.monthlyStockQuantity === 0 && b.monthlyStockQuantity !== 0) return -1;
          if (a.monthlyStockQuantity !== 0 && b.monthlyStockQuantity === 0) return 1;
          return b.monthlyStockQuantity - a.monthlyStockQuantity;
        });

        setMedicines(sorted);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Couldn’t load medicines. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchLowStock();
  }, []);

  if (loading) return <p className="text-center text-gray-500 mt-8">Loading…</p>;
  if (error) return <p className="text-center text-red-500 mt-8">{error}</p>;
  if (medicines.length === 0) return <p className="text-center text-gray-500 mt-8">All medicines are sufficiently stocked! ✅</p>;

  return (
    <div className="max-w-6xl mx-auto mt-12 px-6 pb-16">
      <h2 className="text-4xl text-center text-teal-500 mb-8 underline decoration-gray-300 decoration-4 underline-offset-8">
        Medicines Low & Out of Stock
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {medicines.map((med) => (
          <MedicineCard key={med._id} med={med} />
        ))}
      </div>
    </div>
  );
}