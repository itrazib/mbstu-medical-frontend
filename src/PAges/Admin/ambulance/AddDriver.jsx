import { useState } from "react";
import PageHeader from "../PageHeader";
// import PageHeader from "../../../components/admin/PageHeader";

const AddDriver = () => {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    designation: "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    // try {
    //   await axiosSecure.post("/admin/medical/add-driver", form);
    //   setMsg("Driver added successfully");
    //   setForm({ name: "", mobile: "", designation: "" });
    // } catch {
    //   setMsg("Failed to add driver");
    // } finally {
    //   setLoading(false);
    // }

     try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login as admin first!");
        setLoading(false);
        return;
      }

      const res = await fetch("http://localhost:5000/api/admin/dashboard/add-driver", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      setLoading(false);
      console.log(data);

      if (data.driverId) {
        alert(`Driver added successfully!`);
         setForm({ name: "", mobile: "", designation: "" });
      } else {
        alert("Failed to add user");
      }
    } catch (err) {
      setLoading(false);
      setMsg("Failed to add driver");
      console.error(err);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <PageHeader
        title="Add Ambulance Driver"
        subtitle="Create a new ambulance driver profile"
      />

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-lg p-6 space-y-4"
      >
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Driver Name"
          className="w-full border p-2 rounded"
          required
        />
        <input
          name="mobile"
          value={form.mobile}
          onChange={handleChange}
          placeholder="Mobile Number"
          className="w-full border p-2 rounded"
          required
        />
        <input
          name="designation"
          value={form.designation}
          onChange={handleChange}
          placeholder="Designation (optional)"
          className="w-full border p-2 rounded"
        />

        <button
          disabled={loading}
          className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700"
        >
          {loading ? "Saving..." : "Add Driver"}
        </button>

        {msg && <p className="text-center text-sm text-green-600">{msg}</p>}
      </form>
    </div>
  );
};

export default AddDriver;
