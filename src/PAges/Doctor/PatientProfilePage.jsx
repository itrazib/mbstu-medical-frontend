import React, { useEffect, useState } from "react";
import {
  FaUserCircle,
  FaPhoneAlt,
  FaBirthdayCake,
  FaEnvelope,
  FaUniversity,
  FaBuilding,
  FaUserTag,
  FaTint,
  FaIdBadge,
} from "react-icons/fa";
import { useParams, useNavigate } from "react-router";
import { InfoField } from "../../components/InfoField";
// import { InfoField } from "../../components/InfoField";

export default function PatientProfilePage() {
  const { uniqueId } = useParams();
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:5000/api/doctor/patient/${uniqueId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setUserInfo(data.user);
        if (data.user.photoUrl) setProfileImage(data.user.photoUrl);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (uniqueId) fetchProfile();
  }, [uniqueId]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;
  if (!userInfo)
    return <p className="text-center mt-10">No patient found</p>;

  const capitalize = (str) =>
    str?.charAt(0).toUpperCase() + str?.slice(1);

  const dob = new Date(userInfo.dob);
  const formattedDOB = dob.toLocaleDateString("en-GB");

  return (
    <div className="flex justify-center items-start min-h-screen bg-base-200 py-10 px-4">
      <div className="bg-base-100 p-8 rounded-2xl shadow-xl w-full max-w-2xl">

        {/* Profile */}
        <div className="flex flex-col items-center mb-6">
          {profileImage ? (
            <img
              src={profileImage}
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <FaUserCircle className="text-teal-500 text-7xl" />
          )}

          <h2 className="text-2xl font-bold mt-3">{userInfo.name}</h2>
          <p className="text-gray-500">{userInfo.role}</p>
        </div>

        {/* Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoField icon={<FaIdBadge />} label="ID" value={userInfo.uniqueId} />
          <InfoField icon={<FaBirthdayCake />} label="DOB" value={formattedDOB} />
          <InfoField icon={<FaTint />} label="Blood" value={userInfo.bloodGroup} />
          <InfoField icon={<FaPhoneAlt />} label="Phone" value={userInfo.phone} />
          <InfoField icon={<FaEnvelope />} label="Email" value={userInfo.emails} />
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-center gap-4">
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/write-prescription/${uniqueId}`)}
          >
            Write Prescription
          </button>
          <button
            className="btn btn-outline"
            onClick={() => navigate(`/doctor/patient-history/${uniqueId}`)}
          >
            History
          </button>
        </div>
      </div>
    </div>
  );
}