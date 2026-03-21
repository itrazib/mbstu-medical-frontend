import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";

export default function EditMedicinePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `http://localhost:5000/api/medicine/medicines/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch");
        setForm({
          ...data,
          expiryDate: data.expiryDate?.split("T")[0],
          sideEffects: data.sideEffects?.join(", "),
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMedicine();
  }, [id]);

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
      const payload = {
        ...form,
        sideEffects: form.sideEffects.split(",").map((s) => s.trim()),
      };
      const res = await fetch(
        `http://localhost:5000/api/medicine/medicines/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update");
      navigate(`/staff-dashboard/medicines/${id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading)
    return <p className="p-6 text-center text-gray-500">Loading...</p>;
  if (error) return <p className="p-6 text-center text-red-500">{error}</p>;
  if (!form) return null;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-10 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl shadow-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center text-purple-700">
        Edit Medicine
      </h1>

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
        <input
          className="input input-bordered w-full"
          name="type"
          value={form.type}
          onChange={handleChange}
          placeholder="Type"
        />
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
        />
        <input
          className="input input-bordered w-full"
          type="number"
          name="monthlyStockQuantity"
          value={form.monthlyStockQuantity}
          onChange={handleChange}
          placeholder="Monthly Stock"
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

        <button className="btn btn-secondary w-full mt-4">
          Update Medicine
        </button>
      </form>
    </div>
  );
}
