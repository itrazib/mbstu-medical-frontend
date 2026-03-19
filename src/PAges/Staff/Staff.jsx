import React, { useEffect, useState } from "react";

const Staff = () => {
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/staff/medical-staff");
        if (!res.ok) throw new Error("Failed to fetch medical staff");
        const data = await res.json();
        setStaff(data.staff);
      } catch (error) {
        console.error("Error fetching medical staff:", error);
      }
    };

    fetchStaff();
  }, []);

  const renderGroup = (title, filterFn) => {
    const groupMembers = staff.filter(filterFn);

    if (groupMembers.length === 0) return null;

    return (
      <section className="mb-20 border-b border-teal-200 pb-10 last:border-0 last:pb-0">
        <h2 className="text-3xl font-poetsen text-center text-teal-500 mb-10">
          {title}
        </h2>

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {groupMembers.map((member) => (
            <div
              key={member._id}
              className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition duration-300 border flex flex-col"
            >
              {/* Image */}
              <div className="h-64 w-full bg-gray-100 overflow-hidden">
                <img
                  src={member.photoUrl}
                  alt={member.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>

              {/* Info */}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-semibold text-teal-700 mb-1">
                  {member.name}
                </h3>

                <p className="text-sm text-gray-700">{member.designation}</p>

                <p className="text-sm text-gray-600 mt-1">{member.office}</p>

                <p className="text-sm text-gray-600">
                  Mawlana Bhashani Science and Technology University
                </p>

                <div className="mt-4 text-sm text-gray-600 space-y-1">
                  <p>
                    <span className="font-medium">Phone:</span> {member.phone}
                  </p>

                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    {member.email || "N/A"}
                  </p>

                  <p>
                    <span className="font-medium">Blood Group:</span>{" "}
                    {member.bloodGroup}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-teal-50 px-4 py-10">
      {renderGroup(
        "Office Attendant",
        (member) =>
          member.designation?.toLowerCase() === "office attendant"
      )}

      {renderGroup(
        "Nurse and Brother",
        (member) =>
          [
            "nurse",
            "brother",
            "senior nurse",
            "senior brother",
            "nurse and brother",
          ].includes(member.designation?.toLowerCase())
      )}

      {renderGroup(
        "Assistant Technical Officer",
        (member) =>
          member.designation?.toLowerCase() === "assistant technical officer"
      )}

      {renderGroup(
        "Other Medical Staffs",
        (member) =>
          ![
            "nurse",
            "brother",
            "senior nurse",
            "senior brother",
            "nurse and brother",
            "office attendant",
            "assistant technical officer",
          ].includes(member.designation?.toLowerCase())
      )}
    </div>
  );
};

export default Staff;