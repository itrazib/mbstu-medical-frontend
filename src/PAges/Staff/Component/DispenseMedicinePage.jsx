import React, { useEffect, useState } from "react";
import DispenseDetail from "./DispenseDetail";

export default function DispenseMedicinePage() {
  const [records, setRecords] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecords = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Unauthorized. Please login.");
      setLoading(false);
      return;
    }

    try {
      const params = new URLSearchParams({ page, limit });
      if (filter !== "all") params.append("status", filter);
      if (dateFilter) params.append("date", dateFilter);

      const res = await fetch(
        `http://localhost:5000/api/dispense/dispense-records?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch records");

      setRecords(data.items || []);
      setTotalPages(data.totalPages || 1);

      // refresh selected record if still in current page
      if (selected) {
        const updated = (data.items || []).find((r) => r._id === selected._id);
        setSelected(updated || null);
      }

      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on filter, dateFilter, page change
  useEffect(() => {
    fetchRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, dateFilter, page]);

  const selectTab = (tab) => {
    setFilter(tab);
    setPage(1);
    setSelected(null);
  };

  const handleDateChange = (e) => {
    setDateFilter(e.target.value);
    setPage(1);
    setSelected(null);
  };

  if (loading) return <p className="text-center mt-8">Loading...</p>;
  if (error) return <p className="text-center mt-8 text-red-600">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-center mb-8 text-teal-500">
        Dispense Records
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <div className="flex gap-2">
          {["all", "pending", "completed"].map((tab) => (
            <button
              key={tab}
              onClick={() => selectTab(tab)}
              className={`px-3 py-1 rounded border transition ${
                filter === tab
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div>
          <label className="mr-2 text-sm">Filter by Date:</label>
          <input
            type="date"
            value={dateFilter}
            onChange={handleDateChange}
            className="px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Records List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4 col-span-1">
          {records.length > 0 ? (
            records.map((rec) => (
              <div
                key={rec._id}
                onClick={() => setSelected(rec)}
                className={`p-4 bg-white rounded-xl shadow-md cursor-pointer border-l-4 transition ${
                  rec.overallStatus === "completed"
                    ? "border-green-500 hover:scale-105"
                    : "border-red-500 hover:scale-105"
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-sm font-mono bg-gray-100 border border-gray-300 px-2 py-1 rounded">
                    Rx #{rec._id.slice(-6)}
                  </span>
                  <div className="text-sm text-gray-600 text-right">
                    <p>{new Date(rec.createdAt).toLocaleTimeString()}</p>
                    <p>{new Date(rec.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <p className="mt-2 text-sm">
                  Patient:{" "}
                  <span className="font-semibold text-blue-600">
                    {rec.patient?.name || "Unknown"}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  Doctor: {rec.doctor?.name || "Unknown"}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">
              No dispense records found.
            </p>
          )}

          {/* Pagination */}
          <div className="flex justify-center items-center mt-4 space-x-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-indigo-600 text-white rounded disabled:bg-gray-300"
            >
              Prev
            </button>
            <span className="text-sm">
              {page}/{totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 bg-indigo-600 text-white rounded disabled:bg-gray-300"
            >
              Next
            </button>
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-2">
          {selected ? (
            <DispenseDetail record={selected} onUpdate={fetchRecords} />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 italic">
              Select a record to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}