import { useEffect, useState } from "react";

const DoctorHome = () => {
  const [appointments, setAppointments] = useState([]);
  const [todayAppoinments, setTodayAppointments] = useState(null);
  const token = localStorage.getItem("token");
  
  useEffect(() => {
    fetch("http://localhost:5000/api/appointment/doctor-appointments", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setAppointments(data);
      })
      .catch((err) => console.error(err));
  }, [token]);
  useEffect(() => {
    fetch("http://localhost:5000/api/doctor/today-patients", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setTodayAppointments(data)
      })
      .catch((err) => console.error(err));
  }, [token]);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Welcome Doctor</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white shadow p-5 rounded">
          <h3 className="font-bold">Total Appointments</h3>
          <p className="text-2xl">{appointments.length}</p>
        </div>

        <div className="bg-white shadow p-5 rounded">
          <h3 className="font-bold">Today’s Patients</h3>
          <p className="text-2xl">{todayAppoinments}</p>
        </div>

        <div className="bg-white shadow p-5 rounded">
          <h3 className="font-bold">Room</h3>
          <p className="text-2xl">204</p>
        </div>
      </div>
    </div>
  );
};

export default DoctorHome;
