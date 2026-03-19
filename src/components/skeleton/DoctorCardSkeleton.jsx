import React from "react";

const DoctorCardSkeleton = () => {
  return (
    <div className="card bg-base-100 shadow-md rounded-2xl animate-pulse flex flex-col">
      <figure className="px-6 pt-6">
        <div className="w-32 h-32 rounded-full bg-gray-300 mx-auto"></div>
      </figure>

      <div className="card-body items-center text-center p-6 flex flex-col flex-1 space-y-3">
        <div className="h-4 w-40 bg-gray-300 rounded mx-auto"></div>
        <div className="h-3 w-32 bg-gray-200 rounded mx-auto"></div>
        <div className="h-5 w-24 bg-gray-200 rounded-full mx-auto"></div>
        <div className="h-8 w-full bg-gray-300 rounded-full mt-auto"></div>
      </div>
    </div>
  );
};

export default DoctorCardSkeleton;
