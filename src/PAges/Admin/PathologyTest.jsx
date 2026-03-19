import React, { useState } from "react";

const PathologyTest = () => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [available, setAvailable] = useState(true);
  const [price, setPrice] = useState(0);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Unauthorized. Please login.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/diagnosis/pathology-tests-add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          code,
          description,
          availableInMedicalCenter: available,
          price,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to add test");
      }

      const data = await res.json();
      setMessage(data.message || "Test added successfully");

      // reset form
      setName("");
      setCode("");
      setDescription("");
      setPrice(0);
      setAvailable(true);

    } catch (err) {
      console.error(err);
      setMessage(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl border">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Add Pathology Test</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium text-gray-700 mb-1">Test Name *</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Complete Blood Count (CBC)"
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Code</label>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="CBC"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description"
            rows={3}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none resize-none"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Price (BDT)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            placeholder="500"
            min="0"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={available}
            onChange={(e) => setAvailable(e.target.checked)}
            className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
          />
          <span className="text-gray-700 text-sm">Available in Medical Center</span>
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors duration-200 shadow"
        >
          Add Test
        </button>

        {message && <p className="text-center mt-2 text-sm font-medium text-gray-800">{message}</p>}
      </form>
    </div>
  );
};

export default PathologyTest;