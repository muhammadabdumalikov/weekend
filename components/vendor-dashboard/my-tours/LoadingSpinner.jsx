import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="text-center py-40">
      <div className="spinner-border text-blue-1" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <div className="text-16 text-light-1 mt-10">Loading your tours...</div>
    </div>
  );
};

export default LoadingSpinner; 