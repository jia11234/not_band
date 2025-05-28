import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function AdminMenu() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="admin_left_menu_group">
      <div className="admin_left_menu">
        <Link to="/not_band/admin">
          <p className={path === "/not_band/admin" ? "active" : ""}>
            대시 보드
          </p>
        </Link>
        <Link to="/not_band/admin/product">
          <p className={path === "/not_band/admin/product" ? "active" : ""}>
            상품 관리
          </p>
        </Link>
        <Link to="/not_band/admin/resell">
          <p className={path === "/not_band/admin/resell" ? "active" : ""}>
            중고 거래 관리
          </p>
        </Link>
        <Link to="/not_band/admin/inquiry">
          <p className={path === "/not_band/admin/inquiry" ? "active" : ""}>
            1:1 문의톡 관리
          </p>
        </Link>
        <Link to="/not_band/admin/cs">
          <p className={path === "/not_band/admin/cs" ? "active" : ""}>
            고객센터
          </p>
        </Link>
        <Link to="/not_band/admin/order">
          <p className={path === "/not_band/admin/order" ? "active" : ""}>
            주문 관리
          </p>
        </Link>
        <Link to="/not_band/admin/review">
          <p className={path === "/not_band/admin/review" ? "active" : ""}>
            리뷰 관리
          </p>
        </Link>
        <Link to="/not_band/admin/member">
          <p className={path === "/not_band/admin/member" ? "active" : ""}>
            회원 관리
          </p>
        </Link>
      </div>
    </div>
  );
}
