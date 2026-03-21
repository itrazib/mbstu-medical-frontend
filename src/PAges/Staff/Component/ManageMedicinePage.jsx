import { PencilIcon, TrashIcon, XIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

export default function ManageMedicinePage() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMed, setCurrentMed] = useState(null);
  const [quantityChange, setQuantityChange] = useState(0);

  const pageSize = 10;
  const lowStockThreshold = 5;
  const navigate = useNavigate();

  // Fetch medicines
  const fetchMedicines = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Unauthorized. Please login.");
      setLoading(false);
      return;
    }
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      params.append("page", page);
      params.append("limit", pageSize);

      const res = await fetch(
        `http://localhost:5000/api/medicine/medicines?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch medicines");

      setMedicines(data.items);
      setTotalPages(data.totalPages);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, [page, search]);

  // Filter medicines
  const displayedMeds = medicines.filter((med) => {
    if (stockFilter === "low")
      return med.monthlyStockQuantity > 0 && med.monthlyStockQuantity <= lowStockThreshold;
    if (stockFilter === "out") return med.monthlyStockQuantity === 0;
    return true;
  });

  const openModal = (med) => {
    setCurrentMed(med);
    setQuantityChange(0);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentMed(null);
  };

  // Update stock & expiry
  const handleUpdate = async (e) => {
    e.preventDefault();
    const updatedStock = (currentMed.monthlyStockQuantity || 0) + quantityChange;
    if (updatedStock < 0) {
      alert("Stock cannot be negative!");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      await fetch(
        `http://localhost:5000/api/medicine/medicines/${currentMed._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            monthlyStockQuantity: updatedStock,
            expiryDate: e.target.expiryDate.value,
          }),
        }
      );
      closeModal();
      fetchMedicines();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete medicine
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this medicine?")) return;
    const token = localStorage.getItem("token");
    try {
      await fetch(`http://localhost:5000/api/medicine/medicines/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMedicines();
    } catch (err) {
      console.error(err);
    }
  };

  // Increment / Decrement buttons
  const changeQuantity = (delta) => {
    const newQty = quantityChange + delta;
    if ((currentMed.monthlyStockQuantity || 0) + newQty < 0) return; // prevent negative
    setQuantityChange(newQty);
  };

  return (
    <div className="p-6 bg-base-100 rounded-3xl shadow-xl min-h-screen">
      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 space-y-3 md:space-y-0">
        <input
          type="text"
          placeholder="Search by name, generic, manufacturer..."
          className="input input-bordered w-full md:w-1/2"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <select
          className="select select-bordered"
          value={stockFilter}
          onChange={(e) => {
            setStockFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="all">All medicines</option>
          <option value="low">Low stock (≤{lowStockThreshold})</option>
          <option value="out">Out of stock</option>
        </select>
        <button onClick={() => window.print()} className="btn btn-primary">
          Print
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : displayedMeds.length === 0 ? (
        <p className="text-center text-gray-500">No medicines found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Generic</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Expiry</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedMeds.map((med) => {
                const expDate = new Date(med.expiryDate);
                const isExpiringSoon = (expDate - new Date()) / (1000 * 60 * 60 * 24) < 30;
                return (
                  <tr key={med._id}>
                    <td
                      className="text-blue-600 cursor-pointer"
                      onClick={() => navigate(`/staff-dashboard/medicines/${med._id}`)}
                    >
                      {med.name}
                    </td>
                    <td>{med.genericName}</td>
                    <td>{med.type}</td>
                    <td>{med.monthlyStockQuantity}</td>
                    <td className={isExpiringSoon ? "text-red-600 font-bold" : ""}>
                      {new Date(med.expiryDate).toLocaleDateString()}
                    </td>
                    <td className="flex space-x-2 justify-center">
                      <button onClick={() => openModal(med)} className="btn btn-sm btn-accent">
                        <PencilIcon size={16} />
                      </button>
                      <button onClick={() => handleDelete(med._id)} className="btn btn-sm btn-error">
                        <TrashIcon size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-end mt-4 space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="btn btn-outline btn-sm"
            >
              Previous
            </button>
            <span className="px-2 py-1">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="btn btn-outline btn-sm"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {isModalOpen && currentMed && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-base-100 rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Update Medicine</h3>
              <button onClick={closeModal}>
                <XIcon size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">
                  Current Stock: {currentMed.monthlyStockQuantity}
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <button
                    type="button"
                    onClick={() => changeQuantity(-1)}
                    className="btn btn-outline btn-sm"
                  >
                    −
                  </button>
                  <input
                    name="quantityChange"
                    type="number"
                    value={quantityChange}
                    onChange={(e) => setQuantityChange(parseInt(e.target.value) || 0)}
                    className="input input-bordered w-20 text-center"
                  />
                  <button
                    type="button"
                    onClick={() => changeQuantity(1)}
                    className="btn btn-outline btn-sm"
                  >
                    +
                  </button>
                </div>
              </div>
              <div>
                <input
                  name="expiryDate"
                  type="date"
                  defaultValue={currentMed.expiryDate.split("T")[0]}
                  required
                  className="input input-bordered w-full mt-2"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={closeModal} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}