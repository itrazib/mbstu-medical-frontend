import { useState } from "react";

const DoctorProfile = () => {
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    department: "",
    specialization: "",
    education: "",
    experience: "",
    room: "",
    availableTime: "",
    phone: "",
    fee: "",
    days: "",
    bio: "",
    image: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/doctor/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    alert(data.message);
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 py-10">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow p-8">

        <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">
          Edit Doctor Profile
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Department */}
          <div>
            <label className="label">Department</label>
            <input
              className="input input-bordered w-full"
              name="department"
              value={form.department}
              placeholder="e.g. Medical"
              onChange={handleChange}
            />
          </div>

          {/* Specialization */}
          <div>
            <label className="label">Specialization</label>
            <input
              className="input input-bordered w-full"
              name="specialization"
              value={form.specialization}
              placeholder="e.g. Cardiologist"
              onChange={handleChange}
            />
          </div>

          {/* Education */}
          <div>
            <label className="label">Education</label>
            <input
              className="input input-bordered w-full"
              name="education"
              value={form.education}
              placeholder="MBBS, FCPS"
              onChange={handleChange}
            />
          </div>

          {/* Experience */}
          <div>
            <label className="label">Experience</label>
            <input
              className="input input-bordered w-full"
              name="experience"
              value={form.experience}
              placeholder="5 years"
              onChange={handleChange}
            />
          </div>

          {/* Room */}
          <div>
            <label className="label">Room No</label>
            <input
              className="input input-bordered w-full"
              name="room"
              value={form.room}
              placeholder="204"
              onChange={handleChange}
            />
          </div>

          {/* Available Time */}
          <div>
            <label className="label">Available Time</label>
            <input
              className="input input-bordered w-full"
              name="availableTime"
              value={form.availableTime}
              placeholder="10 AM - 2 PM"
              onChange={handleChange}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="label">Phone Number</label>
            <input
              className="input input-bordered w-full"
              name="phone"
              value={form.phone}
              placeholder="017xxxxxxxx"
              onChange={handleChange}
            />
          </div>

          {/* Fee */}
          <div>
            <label className="label">Consultation Fee</label>
            <input
              className="input input-bordered w-full"
              name="fee"
              value={form.fee}
              type="number"
              placeholder="500"
              onChange={handleChange}
            />
          </div>

          {/* Days */}
          <div>
            <label className="label">Working Days</label>
            <input
              className="input input-bordered w-full"
              name="days"
              value={form.days}
              placeholder="Sun, Mon, Wed"
              onChange={handleChange}
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="label">Profile Image URL</label>
            <input
              className="input input-bordered w-full"
              name="image"
              value={form.image}
              placeholder="https://..."
              onChange={handleChange}
            />
          </div>

          {/* Image Preview */}
          {form.image && (
            <div className="md:col-span-2 flex justify-center">
              <img
                src={form.image}
                alt="Preview"
                className="h-28 w-28 rounded-full object-cover border mt-2"
              />
            </div>
          )}

          {/* Bio */}
          <div className="md:col-span-2">
            <label className="label">Short Bio</label>
            <textarea
              className="textarea textarea-bordered w-full"
              name="bio"
              value={form.bio}
              rows="4"
              placeholder="Write something about yourself..."
              onChange={handleChange}
            ></textarea>
          </div>

          <button className="btn btn-primary md:col-span-2 mt-5 text-lg">
            Update Profile
          </button>

        </form>
      </div>
    </div>
  );
};

export default DoctorProfile;
