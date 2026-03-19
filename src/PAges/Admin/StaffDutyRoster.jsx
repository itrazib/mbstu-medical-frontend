// src/components/StaffDutyRoster.jsx
import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const days = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const shifts = ["Morning", "Evening"];
const timeMap = {
  Morning: { startTime: "8:00 am", endTime: "2:00 pm" },
  Evening: { startTime: "2:00 pm", endTime: "8:00 pm" },
};
const departments = ["Senior Nurse","Brother","Assistant Technical Officer", "Office Attendant", "MLMS","Medical Staff","Senior Brother","Dispensing Assistant"];

export default function StaffDutyRoster() {
  const [department, setDepartment] = useState(departments[0]);
  const [staff, setStaff] = useState([]);
  const [assignments, setAssignments] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async (dept) => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");

    try {
      // Fetch staff
      const staffRes = await fetch(
        `http://localhost:5000/api/staff/medical-users?department=${encodeURIComponent(dept)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const staffData = await staffRes.json();
      const staffArray = Array.isArray(staffData) ? staffData : [];
      setStaff(staffArray);

      // Fetch roster
      const rosterRes = await fetch(
        `http://localhost:5000/api/staff/duty-roster?department=${encodeURIComponent(dept)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const rosterData = await rosterRes.json();

      // Transform rosterData to { [day]___[shift]: [records] } format
      const initAssignments = {};
      rosterData.forEach((item) => {
        const key = `${item.day}___${item.shift}`;
        if (!initAssignments[key]) initAssignments[key] = [];

        // staffInfo from API or fallback to staff array
        const staffName =
          item.staffInfo?.name ||
          staffArray.find((s) => s._id === item.staff || s._id === item.staff?._id)?.name ||
          "Unknown";

        initAssignments[key].push({ ...item, staffInfo: { name: staffName } });
      });
      setAssignments(initAssignments);
    } catch (err) {
      console.error(err);
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(department);
  }, [department]);

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination || source.droppableId === destination.droppableId) return;

    if (source.droppableId === "STAFF_LIST" && destination.droppableId !== "STAFF_LIST") {
      const [day, shift] = destination.droppableId.split("___");
      const times = timeMap[shift] || timeMap.Morning;
      const token = localStorage.getItem("token");

      try {
        const res = await fetch("http://localhost:5000/api/staff/duty-roster/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            staff: draggableId,
            department,
            day,
            shift,
            ...times,
          }),
        });
        const newRecord = await res.json();

        // Find staff name from local staff array
        const staffName = staff.find((s) => s._id === draggableId)?.name || "Unknown";
        const recordWithStaffInfo = { ...newRecord, staffInfo: { name: staffName } };

        setAssignments((prev) => {
          const key = destination.droppableId;
          const existing = prev[key] || [];
          return { ...prev, [key]: [...existing, recordWithStaffInfo] };
        });
      } catch (err) {
        console.error("Failed to add duty:", err);
      }
    }
  };

  const handleRemove = async (assignId, cellId) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`http://localhost:5000/api/staff/duty-roster/delete/${assignId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssignments((prev) => {
        const updated = { ...prev };
        updated[cellId] = updated[cellId].filter((a) => a._id !== assignId);
        return updated;
      });
    } catch (err) {
      console.error("Failed to remove duty:", err);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-teal-600">
        Loading staff and roster...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-white">
      <h1 className="text-2xl sm:text-3xl font-poetsen text-teal-700 mb-6 text-center">
        Staff Duty Roster Management
      </h1>

      {/* Department selector */}
      <div className="mb-6 flex justify-center">
        <label htmlFor="department" className="mr-2 font-semibold">
          Select Department:
        </label>
        <select
          id="department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1"
        >
          {departments.map((dep) => (
            <option key={dep} value={dep}>
              {dep.charAt(0).toUpperCase() + dep.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-col lg:flex-row lg:space-x-6">
          {/* Staff Sidebar */}
          <Droppable droppableId="STAFF_LIST">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="w-full lg:w-48 p-4 bg-teal-50 rounded-lg shadow-inner mb-4 lg:mb-0 overflow-y-auto max-h-[70vh]"
              >
                <h2 className="font-semibold mb-2 capitalize">{department} Staff</h2>
                {staff.length === 0 && <p className="text-sm text-gray-500">No staff found.</p>}
                {staff.map((stf, idx) => (
                  <Draggable key={stf._id} draggableId={stf._id} index={idx}>
                    {(prov) => (
                      <div
                        ref={prov.innerRef}
                        {...prov.draggableProps}
                        {...prov.dragHandleProps}
                        className="p-2 mb-2 bg-white rounded cursor-move shadow"
                      >
                        {stf.name}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* Roster Grid */}
          <div className="flex-1 overflow-x-auto lg:overflow-visible">
            <div className="min-w-max lg:min-w-full grid grid-cols-8 sm:grid-cols-8 border border-gray-200 rounded-lg">
              {/* Corner */}
              <div className="p-2 bg-gray-50"></div>

              {/* Day headers */}
              {days.map((day) => (
                <div
                  key={day}
                  className="p-2 bg-teal-100 text-sm sm:text-base text-center font-semibold text-gray-800 border-l border-gray-200"
                >
                  {day}
                </div>
              ))}

              {/* Shift rows */}
              {shifts.map((shift) => (
                <React.Fragment key={shift}>
                  <div className="p-2 bg-teal-100 text-sm sm:text-base font-semibold border-t border-gray-200">
                    <div>{shift}</div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      {timeMap[shift].startTime} - {timeMap[shift].endTime}
                    </div>
                  </div>

                  {days.map((day) => {
                    const cellId = `${day}___${shift}`;
                    const cellItems = assignments[cellId] || [];
                    return (
                      <Droppable droppableId={cellId} key={cellId}>
                        {(prov, snapshot) => (
                          <div
                            ref={prov.innerRef}
                            {...prov.droppableProps}
                            className={
                              "min-h-[4rem] p-2 border-t border-l border-gray-200 rounded " +
                              (snapshot.isDraggingOver ? "bg-green-50" : "bg-white")
                            }
                          >
                            {cellItems.map((rec) => (
                              <div
                                key={rec._id}
                                className="flex justify-between items-center p-1 mb-1 bg-teal-50 rounded"
                              >
                                <span className="text-sm sm:text-base">{rec.staffInfo?.name}</span>
                                <button
                                  onClick={() => handleRemove(rec._id, cellId)}
                                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 text-[0.6rem] w-4 h-4 flex items-center justify-center rounded-full"
                                  title="Remove duty"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                            {prov.placeholder}
                          </div>
                        )}
                      </Droppable>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
}