import React, { useState, useEffect } from "react";

export const AmbulanceInfo = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Unauthorized. Please login.");
          setLoading(false);
          return;
        }

        // 👉 format: "March-2026" বা "2026-03" (backend er sathe match korte hobe)
        const now = new Date();
        const month = `${now.getFullYear()}-${String(
          now.getMonth() + 1
        ).padStart(2, "0")}`;

        const res = await fetch(
          `http://localhost:5000/api/admin/dashboard/current-driver?month=${month}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setDrivers(res.data.drivers || []);
      } catch (err) {
        setError("Failed to load ambulance info.",err);
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  if (loading) return <p>Loading ambulance info…</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!drivers.length) return <p>No ambulance drivers assigned this month.</p>;

  return (
    <div>
      <h4 className="font-semibold mb-2">
        Ambulance Drivers for{" "}
        {new Date().toLocaleString("default", {
          month: "long",
          year: "numeric",
        })}
      </h4>

      <ul className="list-disc list-inside">
        {drivers.map((d) => (
          <li key={d._id}>
            <strong>{d.name}</strong> – {d.mobile}
          </li>
        ))}
      </ul>
    </div>
  );
};