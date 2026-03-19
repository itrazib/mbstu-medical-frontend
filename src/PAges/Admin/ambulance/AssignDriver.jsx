import { useEffect, useState } from "react";
import PageHeader from "../PageHeader";
import Loader from "../Loader";

const AssignDriver = () => {
  const now = new Date();
  const year = now.getFullYear();
  const defaultMonth = `${year}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const [month, setMonth] = useState(defaultMonth);
  const [drivers, setDrivers] = useState([]);
  const [assigned, setAssigned] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  //   useEffect(() => {
  //     setLoading(true);
  //     Promise.all([
  //       axiosSecure.get("/admin/medical/get-drivers"),
  //       axiosSecure.get("/admin/medical/current-driver", { params: { month } }),
  //     ])
  //       .then(([all, asg]) => {
  //         setDrivers(all.data);
  //         setAssigned(new Set(asg.data.drivers.map((d) => d._id)));
  //       })
  //       .finally(() => setLoading(false));
  //   }, [month]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setMsg("Please login first!");
          setLoading(false);
          return;
        }

        // Fetch all drivers
        const resAll = await fetch(
          "http://localhost:5000/api/admin/dashboard/get-drivers",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const allData = await resAll.json();

        // Fetch current drivers for the selected month
        const resAssigned = await fetch(
          `http://localhost:5000/api/admin/dashboard/current-driver?month=${month}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const assignedData = await resAssigned.json();

        // Set state
        setDrivers(allData);
        setAssigned(new Set(assignedData.drivers.map((d) => d._id)));
      } catch (err) {
        console.error(err);
        setMsg("Error fetching drivers. Try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [month]);

  const toggle = (id) => {
    setAssigned((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const save = async () => {
    setSaving(true);
    setMsg("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMsg("Please login first!");
        return;
      }

      const res = await fetch(
        "http://localhost:5000/api/admin/dashboard/assign-driver",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            month,
            driverIds: [...assigned],
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setMsg("Drivers assigned successfully!");
      } else {
        setMsg(data.message || "Failed to assign drivers.");
      }
    } catch (err) {
      console.error(err);
      setMsg("Error assigning drivers. Try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <PageHeader
        title="Assign Ambulance Drivers"
        subtitle="Monthly duty assignment"
      />

      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-4">
          <label className="block mb-1 font-medium">Select Month</label>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border p-2 rounded"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-3 mb-6">
          {drivers.map((d) => (
            <label
              key={d._id}
              className="flex items-center border p-3 rounded cursor-pointer hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={assigned.has(d._id)}
                onChange={() => toggle(d._id)}
                className="mr-3"
              />
              <div>
                <p className="font-medium">{d.name}</p>
                <p className="text-sm text-gray-500">{d.mobile}</p>
              </div>
            </label>
          ))}
        </div>

        <button
          onClick={save}
          disabled={saving}
          className="w-full bg-teal-600 text-white py-2 rounded"
        >
          {saving ? "Saving..." : "Save Assignment"}
        </button>

        {msg && <p className="text-center mt-3 text-green-600">{msg}</p>}
      </div>
    </div>
  );
};

export default AssignDriver;
