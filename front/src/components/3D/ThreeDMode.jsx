import React from "react";

export default function ThreeDMode({ setMode, currentMode }) {
  return (
    <div className="mode-buttons">
      <button
        onClick={() => setMode("view")}
        className={currentMode === "view" ? "active" : ""}
      >
        구경 모드
      </button>
      <button
        onClick={() => setMode("play")}
        className={currentMode === "play" ? "active" : ""}
      >
        연주 모드
      </button>
    </div>
  );
}
