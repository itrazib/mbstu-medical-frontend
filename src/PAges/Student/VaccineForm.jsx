import React, { useEffect, useState } from "react";

const VaccineForm = () => {
  const [vaccine, setVaccine] = useState({
    dose1: false,
    dose2: false,
    vaccineName: "",
    dose1Date: "",
    dose2Date: "",
  });

  const token = localStorage.getItem("token");

  // Fetch vaccine status
  useEffect(() => {
    fetch("http://localhost:5000/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setVaccine({
          dose1: data.dose1 || false,
          dose2: data.dose2 || false,
          vaccineName: data.vaccineName || "",
          dose1Date: data.dose1Date || "",
          dose2Date: data.dose2Date || "",
        });
      });
  }, [token]);

  return (
    <div className="bg-white p-6 shadow rounded-xl max-w-lg">

      <h2 className="text-xl font-bold mb-4">Your Vaccine Status</h2>

      <p className="mb-2">
        <strong>Vaccine Name:</strong> {vaccine.vaccineName || "N/A"}
      </p>
      <p className="mb-2">
        <strong>Dose 1:</strong>{" "}
        {vaccine.dose1 ? `Completed (${vaccine.dose1Date})` : "Not Taken"}
      </p>
      <p className="mb-2">
        <strong>Dose 2:</strong>{" "}
        {vaccine.dose2 ? `Completed (${vaccine.dose2Date})` : "Not Taken"}
      </p>

      <div className="mt-4">
        {vaccine.dose1 && vaccine.dose2 ? (
          <span className="text-green-600 font-bold">
            Fully Vaccinated ✔
          </span>
        ) : (
          <span className="text-yellow-600 font-bold">
            Not Fully Vaccinated ❗
          </span>
        )}
      </div>
    </div>
  );
};

export default VaccineForm;
