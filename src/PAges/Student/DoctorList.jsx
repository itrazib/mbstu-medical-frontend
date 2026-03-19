import { useEffect, useState } from "react";
import { Link } from "react-router";
import DoctorCardSkeleton from "../../components/skeleton/DoctorCardSkeleton";
import DoctorCard from "../../components/DoctorCard";

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    setLoading(true);
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
          setLoading(false);

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
      <h2 className="text-3xl font-bold  text-center  my-10">Our Doctors</h2>

      {doctors.length === 0 ? (
        <p>No doctors found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <DoctorCardSkeleton key={i} />
              ))
            : doctors.map((doc) => (
                <DoctorCard key={doc.userId} doctor={doc} />
              ))}
        </div>
      )}
    </div>
  );
};

export default DoctorList;
