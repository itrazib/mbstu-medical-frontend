
import { useEffect, useState } from "react";

const ManageDoctors = () => {
  const token = localStorage.getItem("token");
  const [list, setList] = useState([]);

  const load = () => {
    fetch("http://localhost:5000/api/admin/users/doctors", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("API Response:", data);

        if (Array.isArray(data)) {
          setList(data);
        } else if (Array.isArray(data.doctors)) {
          setList(data.doctors);
        } else {
          console.warn("Invalid response. Setting empty array.");
          setList([]);
        }
      })
      .catch((err) => {
        console.error("Fetch Error:", err);
        setList([]);
      });
  };

  useEffect(() => {
    load();
  }, []);

  const deleteDoctor = async (id) => {
    if (!confirm("Are you sure?")) return;

    const res = await fetch(
      `http://localhost:5000/api/admin/users/doctor/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await res.json();

    if (res.ok) {
      alert("Doctor removed");
      load();
    } else {
      alert(data.message || "Something went wrong");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">Manage Doctors</h2>

      {list.length === 0 ? (
        <p className="text-gray-600">No doctors found.</p>
      ) : (
        <table className="w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {list.map((doc) => (
              <tr key={doc._id} className="border-b">
                <td className="p-2">{doc.name}</td>
                <td className="p-2">{doc.email}</td>
                <td className="p-2">
                  <button
                    onClick={() => deleteDoctor(doc._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageDoctors;
