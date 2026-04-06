import React from "react";
import "./CircleLoader.css";

const CircleLoader: React.FC = () => {
  return (
    <div className="circle-loader-overlay">
      <div className="circle-loader"></div>
    </div>
  );
};

export default CircleLoader;