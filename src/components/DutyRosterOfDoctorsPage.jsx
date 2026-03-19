import React, { useState, useEffect } from "react";

// Skeleton Loader Component
const SkeletonCard = () => (
  <div className="animate-pulse bg-white rounded-xl shadow p-5 h-40 flex flex-col justify-between">
    <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
  </div>
);

// Modal Component
const Modal = ({ day, roster, onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-none">
    <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-md relative pointer-events-auto">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 bg-teal-700 text-white w-6 h-6 flex items-center justify-center rounded-full text-sm"
      >
        ×
      </button>

      <h3 className="text-2xl font-bold mb-4 text-teal-600">
        {day} - Full Roster
      </h3>

      {Object.entries(roster).map(([shift, doctors]) =>
        doctors.length > 0 ? (
          <section key={shift} className="mb-4">
            <h4 className="font-semibold text-lg text-teal-700 capitalize">
              {shift} Shift:
            </h4>
            <ul className="list-disc list-inside text-gray-700">
              {doctors.map((doc, idx) => (
                <li key={idx} className="text-sm sm:text-base">
                  {doc}
                </li>
              ))}
            </ul>
          </section>
        ) : null
      )}

      {Object.values(roster).every(arr => arr.length === 0) && (
        <p className="text-gray-500 text-sm">
          No doctors assigned for this day.
        </p>
      )}
    </div>
  </div>
);


const DutyRosterOfDoctorsPage = () => {
    // const [dutyRosterDoctor, setDutyRosterDoctor] = useState([]);
  const daysOfWeek = [
    "Saturday",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ];

  const [rosters, setRosters] = useState(
    daysOfWeek.reduce(
      (acc, day) => ({ ...acc, [day]: { morning: [], evening: [], fullDay: [] } }),
      {}
    )
  );
  const [selectedDay, setSelectedDay] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchRoster = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "http://localhost:5000/api/admin/dashboard/duty-roster-doctor-api"
      );
      if (!res.ok) throw new Error("Failed to fetch roster");

      const entries = await res.json(); // ✅ DIRECT USE

      const grouped = daysOfWeek.reduce(
        (acc, day) => ({
          ...acc,
          [day]: { morning: [], evening: [], fullDay: [] },
        }),
        {}
      );

      entries.forEach(({ day, shift, startTime, endTime, doctor }) => {
        if (!grouped[day] || !doctor) return;

        const key =
          shift === "Full Day" ? "fullDay" : shift.toLowerCase();

        grouped[day][key].push(
          `${doctor.name} (${startTime} - ${endTime})`
        );
      });

      setRosters(grouped);

      // ✅ Correct today mapping
      const todayMap = {
        0: "Sunday",
        1: "Monday",
        2: "Tuesday",
        3: "Wednesday",
        4: "Thursday",
        5: "Friday",
        6: "Saturday",
      };

      const today = todayMap[new Date().getDay()];
      if (grouped[today]) setSelectedDay(today);

    } catch (err) {
      console.error("Roster fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchRoster();
}, []);


  return (
    <div className="min-h-screen bg-teal-50 py-10 px-4">
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-teal-600 mb-8">
        Doctors Duty Roster (Weekly)
      </h2>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading
          ? Array(7)
              .fill(0)
              .map((_, idx) => <SkeletonCard key={idx} />)
          : daysOfWeek.map((day) => (
              <div
                key={day}
                className="bg-white rounded-xl shadow hover:shadow-lg p-5 cursor-pointer transition transform hover:-translate-y-1"
                onClick={() => setSelectedDay(day)}
              >
                <h3 className="text-lg sm:text-xl font-semibold text-teal-700 mb-2">{day}</h3>
                {rosters[day].morning.length > 0 && (
                  <p className="text-gray-700 text-sm sm:text-base">
                    Morning: {rosters[day].morning.length} Doctors
                  </p>
                )}
                {rosters[day].evening.length > 0 && (
                  <p className="text-gray-700 text-sm sm:text-base">
                    Evening: {rosters[day].evening.length} Doctors
                  </p>
                )}
                {rosters[day].fullDay.length > 0 && (
                  <p className="text-gray-700 text-sm sm:text-base">
                    Full Day: {rosters[day].fullDay.length} Doctors
                  </p>
                )}
                {Object.values(rosters[day]).every(arr => arr.length === 0) && (
                  <p className="text-gray-400 text-sm">No doctors assigned</p>
                )}
              </div>
            ))}
      </div>

      {selectedDay && (
        <Modal
          day={selectedDay}
          roster={rosters[selectedDay]}
          onClose={() => setSelectedDay(null)}
        />
      )}
    </div>
  );
};

export default DutyRosterOfDoctorsPage;
