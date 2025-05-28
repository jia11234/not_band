import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../css/main/index.css";
import "../../css/main/main.css";

export default function SignIn() {
  return (
    <div className="not_found">
      <p class="material-symbols-outlined">check_circle</p>
      <h1>회원가입성공!</h1>
      <p>
        회원가입을 축하합니다.
        <br /> 이제 not_band에서 당신의 밴드 열정을 마음껏 펼쳐보세요!
      </p>
      <button className="found_btn">
        <Link to="/not_band/login">로그인 하러가기</Link>
      </button>
    </div>
  );
}
