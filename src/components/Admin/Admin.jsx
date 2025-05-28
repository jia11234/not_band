import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material"; //모달 임포트

import "../../css/admin/admin.css";
import "../../css/main/index.css";

import AdminMenu from "./AdminMenu";
import AdminDashboard from "./AdminDashboard";
import AdminCustomerCenter from "./AdminCustomerCenter";
import AdminMember from "./AdminMember";
import AdminInquiry from "./AdminInquiry";
import AdminOrder from "./AdminOrder";
import AdminProduct from "./AdminProduct";
import AdminProductUpload from "./AdminProductUpload";
import AdminProductEdit from "./AdminProductEdit";
import AdminReview from "./AdminReview";
import AdminResell from "./AdminResell";
import InquiryAdmin from "../Inquiry/InquiryAdmin";
import AdminCsUpload from "./AdminCsUpload";

export default function Admin() {
  const [cookies] = useCookies(["accessToken"]);
  const [adminId, setAdminId] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const handleInquire = () => {
    console.log("Inquire button clicked");
  };

  const getAdminIdFromToken = (token) => {
    if (!token) return null;
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(window.atob(base64));
    return decoded.sub;
  };

  const handleClose = () => {
    setOpen(false);
    navigate("/not_band");
  };

  const handleLogin = () => {
    setOpen(false);
    navigate("/not_band/login");
  };

  useEffect(() => {
    const token = cookies.accessToken;
    const id = getAdminIdFromToken(token);
    if (id === "admin") {
      setAdminId(id);
    } else {
      setOpen(true);
    }
  }, []);

  return (
    <>
      <Dialog open={open} onClose={handleClose} disableScrollLock>
        <DialogTitle>관리자 접근</DialogTitle>
        <DialogContent>
          <p>이 페이지는 관리자만 접근 가능합니다.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>닫기</Button>
          <Button onClick={handleLogin} sx={{ color: "orange" }}>
            로그인
          </Button>
        </DialogActions>
      </Dialog>
      <div className="admin_group">
        <AdminMenu handleInquire={handleInquire} />
        <div className="admin_contents_area">
          {path === "/not_band/admin" && <AdminDashboard />}
          {path === "/not_band/admin/product" && <AdminProduct />}
          {path === "/not_band/admin/productupload" && <AdminProductUpload />}
          {path === "/not_band/admin/productEdit" && <AdminProductEdit />}
          {path === "/not_band/admin/cs" && <AdminCustomerCenter />}
          {path === "/not_band/admin/member" && <AdminMember />}
          {path === "/not_band/admin/order" && <AdminOrder />}
          {path === "/not_band/admin/review" && <AdminReview />}
          {path === "/not_band/admin/inquiry" && <AdminInquiry />}
          {path === "/not_band/admin/inquiry/chat" && <InquiryAdmin />}
          {path === "/not_band/admin/resell" && <AdminResell />}
          {path === "/not_band/admin/csupload" && <AdminCsUpload/>}
          {path === "/not_band/admin/resell"}
        </div>
      </div>
    </>
  );
}
