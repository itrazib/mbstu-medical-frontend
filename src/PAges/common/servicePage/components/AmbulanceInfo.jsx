import React, { useState, useEffect } from "react";

export const AmbulanceInfo = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Unauthorized. Please login.");

        // ✅ current month তৈরি (YYYY-MM)
        const now = new Date();
        const month = `${now.getFullYear()}-${String(
          now.getMonth() + 1
        ).padStart(2, "0")}`;

        const res = await fetch(
          `http://localhost:5000/api/admin/dashboard/current-driver?month=${month}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load ambulance info.");
        }

        setDrivers(data.drivers || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
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