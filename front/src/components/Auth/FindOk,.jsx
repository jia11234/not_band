import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../../css/main/index.css";
import "../../css/main/main.css";

export default function FindOk({}) {
  const location = useLocation();
  const memId = location.state?.memId;
  return (
    <div className="not_found">
      <p class="material-symbols-outlined">check_circle</p>
      <h1>아이디 찾기 성공!</h1>
      <p style={{ color: "#ff4a01", marginTop: "10px", fontWeight: "600" }}>
        아이디:{memId}
      </p>
      <button className="found_btn">
        <Link to="/not_band/login">로그인 하러가기</Link>
      </button>
    </div>
  );
}
