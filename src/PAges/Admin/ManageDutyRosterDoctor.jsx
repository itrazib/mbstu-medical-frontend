import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Loader from "./Loader";
import PageHeader from "./PageHeader";
// import { Loader } from "lucide-react";
// import Loader from "../Loader";
// import PageHeader from "../PageHeader";

const days = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const shifts = ["Morning", "Evening", "Full Day"];
const timeMap = {
  Morning: { startTime: "8:00 am", endTime: "2:00 pm" },
  Evening: { startTime: "2:00 pm", endTime: "8:00 pm" },
  "Full Day": { startTime: "9:00 am", endTime: "5:00 pm" },
};

const ManageDutyRosterDoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [assignments, setAssignments] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  // Fetch doctors & duty roster
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setMsg("Please login as admin!");
          return;
        }

        const res = await fetch("http://localhost:5000/api/admin/dashboard/duty-roster-doctor", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        setDoctors(data.doctors);

        const initial = {};
        data.dutyRosterDoctor.forEach((item) => {
          const key = `${item.day}___${item.shift}`;
          initial[key] = initial[key] || [];
          initial[key].push(item);
        });
        setAssignments(initial);
      } catch (err) {
        console.error(err);
        setMsg("Error loading data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Drag & Drop
  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    // Drag from doctor list to roster
    if (source.droppableId === "DOCTOR_LIST" && destination.droppableId !== "DOCTOR_LIST") {
      const [day, shift] = destination.droppableId.split("___");
      const times = timeMap[shift] || timeMap.Morning;

      setSaving(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/api/diagnosis/pathology-tests-add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ doctor: draggableId, day, shift, ...times }),
        });
        const newAssignment = await res.json();

        setAssignments((prev) => {
          const key = destination.droppableId;
          const existing = prev[key] || [];
          return { ...prev, [key]: [...existing, newAssignment] };
        });

        setMsg("Doctor assigned successfully!");
        setTimeout(() => setMsg(""), 3000);
      } catch (err) {
        console.error(err);
        setMsg("Failed to assign doctor.");
      } finally {
        setSaving(false);
      }
    }
  };

  const handleRemove = async (assignId, cellId) => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5000/api/admin/dashboard/duty-roster-doctor/delete/${assignId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      setAssignments((prev) => {
        const updated = { ...prev };
        updated[cellId] = updated[cellId].filter((a) => a._id !== assignId);
        return updated;
      });

      setMsg("Assignment removed!");
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      console.error(err);
      setMsg("Failed to remove assignment.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <PageHeader title="Doctor Duty Roster" subtitle="Assign doctors to shifts" />

      {msg && <p className="text-center mb-3 text-green-600 font-medium">{msg}</p>}

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-col lg:flex-row lg:space-x-6">
          {/* Doctor List */}
          <Droppable droppableId="DOCTOR_LIST">
            {(provided) => (
              <div
                className="w-full lg:w-64 p-4 bg-teal-50 rounded-lg shadow-inner mb-4 lg:mb-0 max-h-[70vh] overflow-y-auto"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <h2 className="font-semibold mb-2 text-center">Doctors</h2>
                {doctors.map((doc, idx) => (
                  <Draggable key={doc._id} draggableId={doc._id} index={idx}>
                    {(prov) => (
                      <div
                        ref={prov.innerRef}
                        {...prov.draggableProps}
                        {...prov.dragHandleProps}
                        className="p-2 mb-2 bg-white rounded shadow cursor-move hover:bg-teal-100"
                      >
                        {doc.name}
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
            <div className="min-w-max lg:min-w-full grid grid-cols-8 border border-gray-200 rounded-lg">
              {/* corner */}
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

              {/* Shifts */}
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
                            className={`min-h-[4rem] p-2 border-t border-l border-gray-200 rounded ${
                              snapshot.isDraggingOver ? "bg-green-50 border-dashed border-2" : "bg-white"
                            }`}
                          >
                            {cellItems.map((rec, idx) => (
                              <div
                                key={rec._id}
                                className="flex justify-between items-center p-1 mb-1 bg-teal-50 rounded shadow"
                              >
                                <span className="text-sm sm:text-base">{rec.doctor.name}</span>
                                <button
                                  onClick={() => handleRemove(rec._id, cellId)}
                                  disabled={saving}
                                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 text-[0.6rem] w-4 h-4 flex items-center justify-center rounded-full"
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
};

export default ManageDutyRosterDoctor;
