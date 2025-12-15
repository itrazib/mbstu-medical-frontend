import { useEffect, useState } from "react";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:5000/api/appointment/my-appointments", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setAppointments(data);
        console.log(data);
      });
  }, [token]);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">My Appointments</h2>

      <table className="table w-full bg-white shadow">
        <thead className="bg-blue-900 text-white">
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {appointments.map((a) => (
            <tr key={a._id}>
              <td>{a.date}</td>
              <td>{a.time}</td>
              <td
                className={`font-semibold ${
                  a.status === "approved"
                    ? "text-green-500"
                    : a.status === "pending"
                    ? "text-yellow-500"
                    : a.status === "rejected"
                    ? "text-red-500"
                    : "text-blue-700"
                }`}
              >
                {a.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyAppointments;
