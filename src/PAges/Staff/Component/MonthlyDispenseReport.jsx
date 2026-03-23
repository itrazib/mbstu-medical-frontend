import React, { useState, useEffect } from "react";

export default function MonthlyDispenseReport() {
  const today = new Date();
  const defaultStart = new Date(today.getFullYear(), today.getMonth(), 1)
    .toISOString()
    .substr(0, 10);
  const defaultEnd = today.toISOString().substr(0, 10);

  const [range, setRange] = useState({
    start: defaultStart,
    end: defaultEnd,
  });

  const [data, setData] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Unauthorized");
        return;
      }

      try {
        const params = new URLSearchParams({
          start: range.start,
          end: range.end,
        });

        const res = await fetch(
          `http://localhost:5000/api/dispense/dispense-records/report?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const result = await res.json();

        if (!res.ok) throw new Error(result.message);

        setData(result);
        setError("");
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    fetchReport();
  }, [range]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center text-teal-600">
        Monthly Dispensed Stock
      </h2>

      {error && <p className="text-center text-red-500 mb-4">{error}</p>}

      {/* Date */}
      <div className="flex gap-6 mb-6">
        <input
          type="date"
          value={range.start}
          onChange={(e) => setRange((r) => ({ ...r, start: e.target.value }))}
          className="input input-bordered"
        />
        <input
          type="date"
          value={range.end}
          onChange={(e) => setRange((r) => ({ ...r, end: e.target.value }))}
          className="input input-bordered"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Medicine</th>
              <th>Dispensed</th>
              <th>Remaining</th>
            </tr>
          </thead>
          <tbody>
            {data.map((m) => (
              <tr key={m.medicineId}>
                <td>{m.name}</td>
                <td>{m.dispensedQuantity}</td>
                <td>{m.remainingMonthlyStock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
