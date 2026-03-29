import React, { useMemo, useEffect, useState } from "react";

export default function AvailableMedicinePage() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const today = useMemo(() => new Date(), []);

  const fetchMedicines = async (currentPage = 1) => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Unauthorized. Please login.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/medicine/medicines?page=${currentPage}&limit=${limit}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch medicines");

      setMedicines(data.items || []);
      setTotalPages(data.totalPages || 1);
      setPage(data.currentPage || 1);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines(page);
  }, [page]);

  if (loading) return <p className="text-center text-gray-500 mt-8">Loading...</p>;
  if (error) return <p className="text-center text-red-500 mt-8">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto mt-12 p-4">
      <div className="bg-teal-50 p-6 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-4xl font-poetsen text-center text-teal-500 mb-5">
          Medicine List
        </h2>
        <p className="text-center text-2xl text-teal-900 mb-5">
          View all available medicines and their details
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-center border">
            <thead className="bg-teal-100 text-teal-900 sticky top-0 text-xl">
              <tr>
                <th className="px-4 py-3 border">Name</th>
                <th className="px-4 py-3 border">Generic</th>
                <th className="px-4 py-3 border">Type</th>
                <th className="px-4 py-3 border">Quantity</th>
                <th className="px-4 py-3 border">Expiry</th>
              </tr>
            </thead>
            <tbody>
              {medicines.length > 0 ? (
                medicines.map((m, i) => {
                  const expiryDate = new Date(m.expiryDate);
                  const isExpired = expiryDate < today;
                  return (
                    <tr key={i} className="even:bg-gray-50 hover:bg-gray-100 transition-colors">
                      <td className="px-4 py-2 border">{m.name}</td>
                      <td className="px-4 py-2 border">{m.genericName}</td>
                      <td className="px-4 py-2 border">
                        <span className="bg-teal-100 text-teal-400 px-2 py-1 rounded-full text-xl">
                          {m.type}
                        </span>
                      </td>
                      <td className="px-4 py-2 border">{m.monthlyStockQuantity}</td>
                      <td className="px-4 py-2 border">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            isExpired ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"
                          }`}
                        >
                          {expiryDate.toISOString().split("T")[0]}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="py-4 text-violet-600 text-2xl">
                    No medicines available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center mt-6 space-x-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-indigo-600 text-white rounded disabled:bg-gray-300"
          >
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-indigo-600 text-white rounded disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}