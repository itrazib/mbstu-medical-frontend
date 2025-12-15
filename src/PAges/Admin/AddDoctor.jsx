import { useState } from "react";

const AddUser = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    uniId: "",
    role: "",
    department: "",
    specialization: ""
  });

  const [loading, setLoading] = useState(false);

  const departments = ["General Medicine","Pediatrics","Surgery","Cardiology","Neurology","Orthopedics"];
  const specializations = ["Internal Medicine","Child Specialist","Heart Specialist","Brain & Nerve Specialist","Bone & Joint Specialist","Physiotherapy"];

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!form.role) {
      alert("Please select role");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login as admin first!");
        setLoading(false);
        return;
      }

      const res = await fetch("http://localhost:5000/api/admin/users/create-user", {
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

      if (data.user) {
        alert(`${form.role} registered successfully!`);
        setForm({
          name: "",
          email: "",
          password: "",
          uniId: "",
          role: "",
          department: "",
          specialization: ""
        });
      } else {
        alert("Failed to add user");
      }
    } catch (err) {
      setLoading(false);
      alert("Error adding user. Try again.");
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Add New User</h2>

        <form onSubmit={handleSubmit} className="space-y-3">

          <input name="name" type="text" placeholder="Name" className="w-full border p-2 rounded" value={form.name} onChange={handleChange} />

          <input name="email" type="email" placeholder="Email" className="w-full border p-2 rounded" value={form.email} onChange={handleChange} />

          <input name="password" type="password" placeholder="Password" className="w-full border p-2 rounded" value={form.password} onChange={handleChange} />

          <input name="uniId" type="text" placeholder="University ID" className="w-full border p-2 rounded" value={form.uniId} onChange={handleChange} />


          {/* ROLE SELECT */}
          <select name="role" className="w-full border p-2 rounded" value={form.role} onChange={handleChange}>
            <option value="">Select Role</option>
            <option value="doctor">Doctor</option>
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>


          {/* Only for doctor */}
          {form.role === "doctor" && (
            <>
              <select name="department" className="w-full border p-2 rounded" value={form.department} onChange={handleChange}>
                <option value="">Select Department</option>
                {departments.map(dep => <option key={dep} value={dep}>{dep}</option>)}
              </select>

              <select name="specialization" className="w-full border p-2 rounded" value={form.specialization} onChange={handleChange}>
                <option value="">Select Specialization</option>
                {specializations.map(spec => <option key={spec} value={spec}>{spec}</option>)}
              </select>
            </>
          )}

          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded mt-2" disabled={loading}>
            {loading ? "Processing..." : "Add User"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddUser;
