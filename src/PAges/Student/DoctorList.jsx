import { useEffect, useState } from "react";
import { Link } from "react-router";

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:5000/api/doctor/list", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch doctors");
        return res.json();
      })
      .then((data) => {
        console.log("Doctor list:", data);

        if (Array.isArray(data)) {
          setDoctors(data);
        } else if (Array.isArray(data?.doctors)) {
          setDoctors(data.doctors);
        } else {
          setDoctors([]);
        }
      })
      .catch((err) => console.error(err));
  }, [token]);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">Our Doctors</h2>

      {doctors.length === 0 ? (
        <p>No doctors found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {doctors.map((doc) => (
            <div key={doc._id} className="p-4 bg-white shadow rounded">
              <h3 className="text-xl font-bold">{doc.name}</h3>
              <p><b>Dept:</b> {doc.department}</p>
              <p><b>Specialization:</b> {doc.specialization}</p>
              <p><b>Room:</b> {doc.room}</p>
              <p><b>Available:</b> {doc.availableTime}</p>

              <Link to={`/doctorDetails/${doc._id}`}><a
                href=""
                className="mt-3 inline-block bg-blue-600 text-white px-3 py-1 rounded"
              >
                View Details
              </a></Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorList;
