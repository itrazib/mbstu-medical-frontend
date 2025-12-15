import { useState } from "react";
import { Link } from "react-router";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    uniId: "",
    session: "",
    department: "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setMsg("✅ Registration successful! Please wait for admin approval.");
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        setMsg(data.message);
      }

    } catch (error) {
      setLoading(false);
      setMsg("❌ Registration failed! Try again.", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-300 px-4">

      <div className="w-full max-w-md bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl">

        <h2 className="text-3xl font-bold text-center text-green-700 mb-2">
          MBSTU Medical Register
        </h2>

        <p className="text-center text-sm mb-6 text-gray-500">
          Your account needs admin approval before login
        </p>

        <form onSubmit={submit} className="space-y-4">

          {/* Name */}
          <div>
            <label className="block mb-1 text-sm">Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          {/* University ID */}
          <div>
            <label className="block mb-1 text-sm">University ID</label>
            <input
              type="text"
              placeholder="22CSE001"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={form.uniId}
              onChange={(e) => setForm({ ...form, uniId: e.target.value })}
              required
            />
          </div>

          {/* Session */}
          <div>
            <label className="block mb-1 text-sm">Session</label>
            <input
              type="text"
              placeholder="2020-21"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={form.session}
              onChange={(e) => setForm({ ...form, session: e.target.value })}
              required
            />
          </div>

          {/* Department */}
          <div>
            <label className="block mb-1 text-sm">Department</label>
            <input
              type="text"
              placeholder="CSE / EEE / ME / ICT"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-sm">Email</label>
            <input
              type="email"
              placeholder="example@mbstu.ac.bd"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 text-sm">Password</label>
            <input
              type="password"
              placeholder="Create a password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          {msg && (
            <p
              className={`text-center text-sm font-semibold ${
                msg.includes("✅") ? "text-green-600" : "text-red-500"
              }`}
            >
              {msg}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-60"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-sm text-center mt-5">
          Already have an account?{" "}
          <Link className="text-green-700 font-semibold hover:underline" to="/login">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;
