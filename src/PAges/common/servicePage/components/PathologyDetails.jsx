import React, { useEffect, useState } from "react";

const PathologyDetails = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Unauthorized. Please login.");

        const res = await fetch(
          "http://localhost:5000/api/diagnosis/pathology-tests",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json(); // ✅ only once

        if (!res.ok) {
          throw new Error(data.error || "Failed to load pathology tests.");
        }

        // ✅ backend structure অনুযায়ী
        setTests(data.tests || []);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  if (loading) return <p>Loading pathology tests…</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <p className="mb-4 text-gray-800">
        The Pathology Department at MBSTU Medical Center provides diagnostic
        services through lab tests and blood sample collection.
      </p>

      <h4 className="font-semibold text-lg text-teal-700 mb-2">
        🧪 Blood/Sample Collection Time
      </h4>
      <ul className="list-disc list-inside mb-4 text-gray-700">
        <li>Morning: 8:00 AM – 12:00 PM</li>
        <li>Evening: 2:00 PM – 6:00 PM</li>
      </ul>

      <h4 className="font-semibold text-lg text-teal-700 mb-2">
        🔬 Available Tests
      </h4>

      <ul className="list-disc list-inside mb-4 text-gray-700">
        {tests.length === 0 ? (
          <li>No tests available currently.</li>
        ) : (
          tests.map((test) => (
            <li key={test._id} className="mb-1">
              <strong>{test.name}</strong>
              {test.price ? (
                <span className="ml-2 text-gray-500">
                  ({test.price} BDT)
                </span>
              ) : null}
            </li>
          ))
        )}
      </ul>

      <h4 className="font-semibold text-lg text-teal-700 mb-2">
        📞 Contact Numbers
      </h4>
      <ul className="list-disc list-inside text-gray-700">
        <li>Shahoriyar Khan : 01700-614613</li>
        <li>Md. Mostafizur Rahman: 01751-457683</li>
      </ul>
    </div>
  );
};

export default PathologyDetails;