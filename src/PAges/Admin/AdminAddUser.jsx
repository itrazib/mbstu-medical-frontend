
import React, { useState } from "react";

/* dropdown data */

const doctorDesignations = [
  "Medical Officer",
  "Chief Medical Officer",
  "Consultant",
  "Specialist Doctor",
];

const staffDesignations = [
  "Nurse",
  "Senior Nurse",
  "Brother",
  "Senior Brother",
  "Office Attendant",
  "Assistant Technical Officer",
  "Dispensing Assistant",
  "Medical Staff",
  "MLMS",
];

const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

const AdminAddUser = () => {
  const [role, setRole] = useState("doctor");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    designation: "",
    phone: "",
    office: "",
    bloodGroup: "",
    photoUrl: "",
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataImg = new FormData();
    formDataImg.append("image", file);

    try {
      setLoading(true);

      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_KEY}`,
        {
          method: "POST",
          body: formDataImg,
        }
      );

      const data = await res.json();
      if (!data.success) throw new Error("Image upload failed");

      setFormData((prev) => ({
        ...prev,
        photoUrl: data.data.url,
      }));
    } catch (err) {
      alert("Image upload failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const payload = {
      name: formData.name,
      password: formData.password,
      role,
      designation: formData.designation,
      phone: formData.phone,
      bloodGroup: formData.bloodGroup,
      photoUrl: formData.photoUrl,
    };

    // ✅ only doctor gets email
    if (role === "doctor") {
      payload.email = formData.email;
    }

    // ✅ staff extra field
    if (role === "staff") {
      payload.office = formData.office;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login as admin first!");
        return;
      }

      const res = await fetch(
        "http://localhost:5000/api/admin/users/create-user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMessage("User created successfully");

      setFormData({
        name: "",
        email: "",
        password: "",
        designation: "",
        phone: "",
        office: "",
        bloodGroup: "",
        photoUrl: "",
      });
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-10">
        <h1 className="text-3xl font-bold text-center text-teal-600 mb-8">
          Add Doctor / Staff
        </h1>

        {message && (
          <p className="text-center mb-6 font-medium text-gray-700">
            {message}
          </p>
        )}

        {/* Role Switch */}
        <div className="flex justify-center gap-4 mb-8">
          {["doctor", "staff"].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => {
                setRole(r);
                setFormData((prev) => ({ ...prev, email: "" }));
              }}
              className={`px-6 py-2 rounded-full font-medium transition ${
                role === r
                  ? "bg-teal-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          <Input label="Full Name" name="name" onChange={handleChange} required />

          {/* ✅ Email only for doctor */}
          {role === "doctor" && (
            <Input
              label="Email Address"
              name="email"
              type="email"
              onChange={handleChange}
              required
            />
          )}

          <Input
            label="Password"
            name="password"
            type="password"
            onChange={handleChange}
            required
          />

          <Select
            label="Designation"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            options={role === "doctor" ? doctorDesignations : staffDesignations}
          />

          <Input
            label="Phone Number"
            name="phone"
            onChange={handleChange}
            required
          />

          <Select
            label="Blood Group"
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            options={bloodGroups}
          />

          {/* Photo */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1">
              {role === "doctor" ? "Doctor Photo" : "Staff Photo"}
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full border rounded-lg px-3 py-2 text-sm
              focus:outline-none focus:ring-2 focus:ring-teal-500"
            />

            {formData.photoUrl && (
              <img
                src={formData.photoUrl}
                alt="Preview"
                className="mt-3 w-32 h-32 object-cover rounded-xl border"
              />
            )}
          </div>

          {/* Staff Only */}
          {role === "staff" && (
            <Input
              label="Office / Room"
              name="office"
              onChange={handleChange}
              required
            />
          )}

          <div className="sm:col-span-2">
            <button
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* Reusable Components */

const Input = ({ label, required = false, ...props }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      {...props}
      required={required}
      placeholder={`Enter ${label}`}
      className="w-full border rounded-lg px-3 py-2 text-sm
      focus:outline-none focus:ring-2 focus:ring-teal-500"
    />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <select
      {...props}
      required
      className="w-full border rounded-lg px-3 py-2 text-sm
      focus:outline-none focus:ring-2 focus:ring-teal-500"
    >
      <option value="">Select {label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

export default AdminAddUser;

