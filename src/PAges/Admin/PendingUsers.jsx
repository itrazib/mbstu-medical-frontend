import { useEffect, useState } from "react";

const PendingUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  console.log(token)

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/pending-users", {
      headers: {
           "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log("API Response:", data); // Debugging

        // Ensure users is always an array
        if (Array.isArray(data)) {
          setUsers(data);
        } 
        else if (Array.isArray(data.users)) {
          setUsers(data.users);
        } 
        else {
          console.warn("Invalid data format, setting users = []");
          setUsers([]);
        }

        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch Error:", err);
        setUsers([]);
        setLoading(false);
      });
  }, []);

  const updateRole = async (id, role) => {
    const res = await fetch("http://localhost:5000/api/admin/update-role", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ userId: id, role })
    });

    const data = await res.json();

    if (res.ok) {
      alert("Role updated ✅");
      setUsers(prev => prev.filter(user => user._id !== id));
    } else {
      alert(data.message || "Something went wrong");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-3xl font-bold mb-5">Pending Users</h2>

      {users.length === 0 ? (
        <p className="text-green-600">No pending users ✅</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {users.map(user => (
            <div key={user._id} className="bg-white p-5 shadow rounded">
              <h3 className="font-bold text-lg">{user.name}</h3>
              <p>Email: {user.email}</p>
              <p>University ID: {user.universityId}</p>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => updateRole(user._id, "student")}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Student
                </button>

                <button
                  onClick={() => updateRole(user._id, "doctor")}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Doctor
                </button>

                <button
                  onClick={() => updateRole(user._id, "staff")}
                  className="bg-purple-600 text-white px-3 py-1 rounded"
                >
                  Staff
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingUsers;
