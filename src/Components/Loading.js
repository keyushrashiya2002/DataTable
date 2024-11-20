import React from "react";

const Loading = () => {
  return (
    <div className="d-flex align-items-center justify-content-center p-4 w-100 bg-light text-dark">
      <i className="ri-loader-4-line fs-2 spinner"></i>
      <p className="fs-3 ms-2 mb-0">Loading</p>
    </div>
  );
};

export default Loading;
