import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Loader from "./Loader";
import PageHeader from "./PageHeader";

const days = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

const TelemedicineDutyRoster = () => {
  const [doctors, setDoctors] = useState([]);
  const [assignments, setAssignments] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  // ================= FETCH DATA =================
  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMsg("Please login as admin!");
        return;
      }

      const res = await fetch(
        "http://localhost:5000/api/admin/dashboard/telemedicine-duty",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      setDoctors(data.doctors || []);

      // group by day
      const grouped = {};
      (data.duties || []).forEach((item) => {
        if (!item?.day) return;
        grouped[item.day] = grouped[item.day] || [];
        grouped[item.day].push(item);
      });

      setAssignments(grouped);
    } catch (err) {
      console.error(err);
      setMsg("Error loading data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= DRAG & DROP =================
  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    if (
      source.droppableId === "DOCTOR_LIST" &&
      destination.droppableId !== "DOCTOR_LIST"
    ) {
      const day = destination.droppableId;
      setSaving(true);

      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "http://localhost:5000/api/admin/dashboard/telemedicine-duty/add",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ doctor: draggableId, day }),
          }
        );

        const newRecord = await res.json();

        setAssignments((prev) => ({
          ...prev,
          [day]: [...(prev[day] || []), newRecord],
        }));

        setMsg("Doctor assigned successfully!");
        setTimeout(() => setMsg(""), 3000);
      } catch (err) {
        console.error(err);
        setMsg("Failed to assign doctor");
      } finally {
        setSaving(false);
      }
    }
  };

  // ================= REMOVE ASSIGNMENT =================
  const handleRemove = async (assignId, day) => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      await fetch(
        `http://localhost:5000/api/admin/dashboard/telemedicine-duty/delete/${assignId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAssignments((prev) => ({
        ...prev,
        [day]: prev[day].filter((a) => a._id !== assignId),
      }));

      setMsg("Assignment removed");
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      console.error(err);
      setMsg("Failed to remove assignment");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Telemedicine Duty Roster"
        subtitle="Assign doctors to telemedicine duty"
      />

      {msg && (
        <p className="text-center mb-4 text-green-600 font-medium">{msg}</p>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* ================= DOCTOR LIST ================= */}
          <Droppable droppableId="DOCTOR_LIST">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="w-full lg:w-64 bg-teal-50 rounded-lg p-4 shadow-inner max-h-[70vh] overflow-y-auto"
              >
                <h2 className="font-semibold text-center mb-3">Doctors</h2>

                {doctors.map((doc, idx) => (
                  <Draggable
                    key={doc._id}
                    draggableId={doc._id}
                    index={idx}
                  >
                    {(prov) => (
                      <div
                        ref={prov.innerRef}
                        {...prov.draggableProps}
                        {...prov.dragHandleProps}
                        className="p-3 mb-2 bg-white rounded shadow cursor-move hover:bg-teal-100 text-sm"
                      >
                        {doc.name || "Unnamed Doctor"}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* ================= DUTY GRID ================= */}
          <div className="flex-1 overflow-auto">
            <div className="border rounded-lg divide-y bg-white">
              {days.map((day) => {
                const cellItems = (assignments[day] || []).filter(
                  (item) => item?.doctor && item.doctor?.name
                );

                return (
                  <Droppable droppableId={day} key={day}>
                    {(prov, snapshot) => (
                      <div
                        ref={prov.innerRef}
                        {...prov.droppableProps}
                        className={`p-4 flex flex-col sm:flex-row gap-4 ${
                          snapshot.isDraggingOver
                            ? "bg-green-50"
                            : "bg-white"
                        }`}
                      >
                        <div className="w-full sm:w-36 font-semibold text-gray-700">
                          {day}
                        </div>

                        <div className="flex flex-wrap gap-2 flex-1 min-h-[2.5rem]">
                          {cellItems.length === 0 && (
                            <span className="text-gray-400 italic text-sm">
                              No doctors assigned
                            </span>
                          )}

                          {cellItems.map((rec) => (
                            <div
                              key={rec._id}
                              className="flex items-center bg-teal-100 text-teal-900 px-3 py-1 rounded shadow-sm"
                            >
                              <span className="mr-2 text-sm">
                                {rec.doctor?.name || "Unknown Doctor"}
                              </span>
                              <button
                                onClick={() =>
                                  handleRemove(rec._id, day)
                                }
                                disabled={saving}
                                className="w-4 h-4 flex items-center justify-center rounded-full bg-gray-300 hover:bg-red-500 hover:text-white text-xs"
                                aria-label={`Remove ${
                                  rec.doctor?.name || "doctor"
                                } from ${day}`}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                          {prov.placeholder}
                        </div>
                      </div>
                    )}
                  </Droppable>
                );
              })}
            </div>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};

export default TelemedicineDutyRoster;
