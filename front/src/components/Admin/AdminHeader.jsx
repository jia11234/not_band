import React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import "../../css/admin/admin.css";
import "../../css/main/index.css";
import { FaHome, FaSignOutAlt, FaUser } from "react-icons/fa";

export default function AdminHeader() {
  const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);
  const navigate = useNavigate();
  const handleLogout = () => {
    removeCookie("accessToken", { path: "/" });
    navigate("/not_band");
  };
  return (
    <div className="adminHeader_wrapper">
      <div style={{ display: "flex" }}>
        <div className="admin_header">
        <Link to="/not_band/admin">
          <img src="/images/header/logo_black.png" alt="Logo" />
        </Link>
        </div>

        <div className="admin_header_menu">
          <div className="admin_header_menu_content">
            <img src="/images/header/homepage_go.png" alt="" />
            <Link to="/not_band">
              <p>홈 페이지 가기</p>
            </Link>
          </div>
          <div className="admin_header_menu_content">
            <img
              src="/images/header/logout_img.png"
              alt=""
              style={{ width: "21px" }}
            />
            <p onClick={handleLogout}>로그아웃</p>
          </div>
          <div className="admin_header_menu_content">
            <img
              src="/images/header/admin.png"
              alt=""
              style={{ width: "21px" }}
            />
            <p>관리자</p>
          </div>
        </div>
      </div>
    </div>
  );
}
