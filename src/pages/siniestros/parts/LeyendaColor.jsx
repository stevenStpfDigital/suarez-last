import React from "react";

const LeyendaColor = ({ color, txt }) => {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div
        style={{
          width: "25px",
          height: "25px",
          background: color,
          marginRight: "10px",
          borderRadius: "4px",
        }}
      ></div>
      <span className={"form-label text-bold text-secondary fs-6 mt-1"}>
        {txt}
      </span>
    </div>
  );
};

export default LeyendaColor;
