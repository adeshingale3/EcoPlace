import React from "react";
import { SkewLoader } from "react-spinners";

const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <SkewLoader color="#36d7b7" size={50} />
    </div>
  );
};

export default Loader;
