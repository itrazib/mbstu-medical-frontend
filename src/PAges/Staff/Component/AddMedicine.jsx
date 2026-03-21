import React, { useState } from "react";
import { useNavigate } from "react-router";

export default function AddMedicinePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    genericName: "",
    type: "Tablet",
    mainStockQuantity: 0,
    monthlyStockQuantity: 0,
    dosage: "",
    manufacturer: "",
    price: 0,
    expiryDate: "",
    batchNumber: "",
    storageCondition: "",
    sideEffects: "",
    usageInstructions: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized!");
        return;
      }

      const payload = {
        ...form,
        sideEffects: form.sideEffects
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      const res = await fetch("http://localhost:5000/api/medicine/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add medicine");
      navigate(`/medicines/${data.medicine._id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-10 bg-base-100 rounded-3xl shadow-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center text-primary">
        Add New Medicine
      </h1>

      {error && <div className="alert alert-error shadow-lg mb-6">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="input input-bordered w-full"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Brand Name"
          required
        />
        <input
          className="input input-bordered w-full"
          name="genericName"
          value={form.genericName}
          onChange={handleChange}
          placeholder="Generic Name"
          required
        />
        <select
          className="select select-bordered w-full"
          name="type"
          value={form.type}
          onChange={handleChange}
        >
          <option>Tablet</option>
          <option>Capsule</option>
          <option>Syrup</option>
        </select>
        <input
          className="input input-bordered w-full"
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
        />
        <input
          className="input input-bordered w-full"
          type="number"
          name="mainStockQuantity"
          value={form.mainStockQuantity}
          onChange={handleChange}
          placeholder="Main Stock"
          required
        />
        <input
          className="input input-bordered w-full"
          type="number"
          name="monthlyStockQuantity"
          value={form.monthlyStockQuantity}
          onChange={handleChange}
          placeholder="Monthly Stock"
          required
        />
        <input
          className="input input-bordered w-full"
          name="dosage"
          value={form.dosage}
          onChange={handleChange}
          placeholder="Dosage"
        />
        <input
          className="input input-bordered w-full"
          name="manufacturer"
          value={form.manufacturer}
          onChange={handleChange}
          placeholder="Manufacturer"
        />
        <input
          className="input input-bordered w-full"
          type="date"
          name="expiryDate"
          value={form.expiryDate}
          onChange={handleChange}
        />
        <input
          className="input input-bordered w-full"
          name="batchNumber"
          value={form.batchNumber}
          onChange={handleChange}
          placeholder="Batch Number"
        />
        <textarea
          className="textarea textarea-bordered w-full"
          name="storageCondition"
          value={form.storageCondition}
          onChange={handleChange}
          placeholder="Storage Condition"
        />
        <input
          className="input input-bordered w-full"
          name="sideEffects"
          value={form.sideEffects}
          onChange={handleChange}
          placeholder="Side Effects (comma separated)"
        />
        <textarea
          className="textarea textarea-bordered w-full"
          name="usageInstructions"
          value={form.usageInstructions}
          onChange={handleChange}
          placeholder="Usage Instructions"
        />

        <button className="btn btn-primary w-full mt-4">Save Medicine</button>
      </form>
    </div>
  );
}
