import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function MypageMenu({ handleInquire }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="mypage_left_group">
      <div className="mp_L_stitle">
        <h3>쇼핑</h3>
        <Link to="/not_band/mypage">
          <p
            className={
              isActive("/not_band/mypage") ? "active-link" : "inactive-link"
            }
          >
            주문 내역
          </p>
        </Link>
        <Link to="/not_band/mypage/review">
          <p
            className={
              isActive("/not_band/mypage/review")
                ? "active-link"
                : "inactive-link"
            }
          >
            리뷰 관리
          </p>
        </Link>
      </div>

      <div className="mp_L_stitle">
        <h3>내 정보관리</h3>
        <Link to="/not_band/mypage/user-edit">
          <p
            className={
              isActive("/not_band/mypage/user-edit")
                ? "active-link"
                : "inactive-link"
            }
          >
            회원 정보 수정
          </p>
        </Link>
      </div>

      <div className="mp_L_stitle">
        <h3>중고마켓</h3>
        <Link to="/not_band/mypage/wish">
          <p
            className={
              isActive("/not_band/mypage/wish")
                ? "active-link"
                : "inactive-link"
            }
          >
            찜 목록
          </p>
        </Link>
        <Link to="/not_band/mypage/resell">
          <p
            className={
              isActive("/not_band/mypage/resell")
                ? "active-link"
                : "inactive-link"
            }
          >
            내 상품
          </p>
        </Link>
      </div>
    </div>
  );
}
