// src/components/DutyRosterViewer.jsx
import React, { useEffect, useState } from "react";

function capitalizeFirstLetter(string) {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export default function DutyRosterViewer() {
  const [departments, setDepartments] = useState([]);
  const [activeDept, setActiveDept] = useState("");
  const [staffList, setStaffList] = useState([]);
  const [roster, setRoster] = useState({});

  const daysOfWeek = ["Saturday","Sunday","Monday","Tuesday","Wednesday","Thursday","Friday"];
  const shifts = ["Morning","Evening"];

  // Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please login.");
        
        const res = await fetch("http://localhost:5000/api/staff/departments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setDepartments(data);
        setActiveDept(data[0] || "");
      } catch (err) {
        console.error("Departments fetch error:", err);
      }
    };
    fetchDepartments();
  }, []);

  // Fetch staff & roster for active department
  useEffect(() => {
    if (!activeDept) return;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please login.");

        const [staffRes, rosterRes] = await Promise.all([
          fetch(`http://localhost:5000/api/staff/medical-users?department=${encodeURIComponent(activeDept)}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`http://localhost:5000/api/staff/duty-roster?department=${encodeURIComponent(activeDept)}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const staffData = await staffRes.json();
        const rosterData = await rosterRes.json();

        setStaffList(Array.isArray(staffData) ? staffData : []);

        // Transform rosterData to { [day]: { [shift]: [names] } } format
        const transformedRoster = {};
        rosterData.forEach((item) => {
          const day = item.day;
          const shift = item.shift;
          const name = item.staff?.name || ""; // <-- ঠিক করা হয়েছে
          if (!transformedRoster[day]) transformedRoster[day] = {};
          if (!transformedRoster[day][shift]) transformedRoster[day][shift] = [];
          transformedRoster[day][shift].push(name);
        });
        setRoster(transformedRoster);

      } catch (err) {
        console.error("Staff/roster fetch error:", err);
      }
    };

    fetchData();
  }, [activeDept]);

  return (
    <div style={{ display: "flex", padding: 20, fontFamily: "Arial, sans-serif", marginBottom: 40 }}>
      {/* Staff Sidebar */}
      <div style={{ width: 200, marginRight: 30, backgroundColor: "#e6f7f7", padding: 15, borderRadius: 8 }}>
        <h3>{capitalizeFirstLetter(activeDept)} Staff</h3>
        {staffList.length === 0 && <p>No staff found.</p>}
        {staffList.map((staff) => (
          <div
            key={staff._id}
            style={{
              backgroundColor: "white",
              padding: "8px 12px",
              margin: "8px 0",
              borderRadius: 6,
              boxShadow: "0 0 5px #ddd",
            }}
          >
            {staff.name}
          </div>
        ))}
      </div>

      <div style={{ flexGrow: 1 }}>
        {/* Departments Selector */}
        <div style={{ marginBottom: 20 }}>
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setActiveDept(dept)}
              style={{
                padding: "8px 20px",
                marginRight: 10,
                cursor: "pointer",
                backgroundColor: dept === activeDept ? "#008080" : "#ccc",
                color: dept === activeDept ? "white" : "#333",
                border: "none",
                borderRadius: 6,
                textTransform: "capitalize",
              }}
            >
              {dept}
            </button>
          ))}
        </div>

        {/* Roster Table */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "center",
            backgroundColor: "#f9ffff",
            borderRadius: 10,
            overflow: "hidden",
            marginBottom: 40,
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#b6e0e0", fontWeight: "bold" }}>
              <th>Shift / Day</th>
              {daysOfWeek.map((day) => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shifts.map((shift) => (
              <tr key={shift} style={{ backgroundColor: "white" }}>
                <td
                  style={{
                    fontWeight: "bold",
                    padding: "8px 10px",
                    borderRight: "1px solid #ccc",
                    borderLeft: "1px solid #ccc",
                    borderBottom: "1px solid #ccc",
                  }}
                >
                  {shift}
                </td>
                {daysOfWeek.map((day) => (
                  <td
                    key={day}
                    style={{
                      padding: 10,
                      borderRight: "1px solid #ccc",
                      borderBottom: "1px solid #ccc",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {roster[day] && roster[day][shift]
                      ? roster[day][shift].join("\n")
                      : "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}