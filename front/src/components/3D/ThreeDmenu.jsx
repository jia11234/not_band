import React from "react";
import { Link } from "react-router-dom";
import "../../css/main/index.css";
import "../../css/3d/Three.css";

export default function ThreeDmenu() {
  return (
    <div className="threeD_menu_bg">
      {/* 3d 메뉴 */}
      <div className="main_3d">
        <Link to={"/"}>
          <div className="main_3d_title">
            <img src="/images/main/3D_text.png" alt="" />
          </div>
        </Link>
        <div className="threeD_menu">
          <Link to="/not_band/bass" className="threeD_menu_icon" />
          <Link to="/not_band/elec" className="threeD_menu_icon" />
          <Link to="/not_band/3d" className="threeD_menu_icon" />
          <Link to="/not_band/drum" className="threeD_menu_icon" />

          <div className="threeD_menu_icon"></div>
        </div>
      </div>
    </div>
  );
}
