import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Suspense } from "react";
import ReactDOM from "react-dom/client";
import Header from "./components/Main/Header.jsx";
import Footer from "./components/Main/Footer.jsx";
import Routing from "./Routing.jsx";
import Scroll from "./components/Scroll";
import { getCartCount } from "./apis";
import "./css/main/index.css";
import { BrowserRouter, useLocation } from "react-router-dom";
import AdminHeader from "./components/Admin/AdminHeader.jsx";

//푸터 삭제
const AppLayout = () => {
  const location = useLocation();
  const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);
  const [memId, setMemId] = useState(null);
  const pathname = location.pathname;
  const hideFooter = location.pathname === "/not_band/chat";
  const hideFooter2 = location.pathname === "/not_band/inquiry";
  const hideFooter3 = location.pathname === "/not_band/game/card";
  const hideFooter4 = location.pathname === "/not_band/3d";
  const hideFooteradmin =
    pathname === "/not_band/admin" || pathname.startsWith("/not_band/admin/");
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const token = cookies.accessToken; 
    const memId = getMemIdFromToken(token);
    if (memId) {
      fetchCartCount(memId);
    }
  }, [memId]);

  const getMemIdFromToken = (token) => {
    if (!token) return null;

    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/"); // JWT 디코딩을 위한 변환
    const decoded = JSON.parse(window.atob(base64)); // 디코딩
    return decoded.sub; // memId 반환
  };


  const fetchCartCount = async (id) => {
    const data = await getCartCount(id);
    setCartCount(data);
  };

  return (
    <>
      <Scroll />
      {!hideFooteradmin && <Header cartCount={cartCount} />}
      {hideFooteradmin && <AdminHeader />}
      <main style={{ paddingTop: hideFooteradmin ? "0" : "80px" }}>
        <Routing setCartCount={setCartCount}/>
      </main>
      {!hideFooter && !hideFooter2 && !hideFooteradmin && !hideFooter3 && !hideFooter4&& (
        <Footer />
      )}
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Suspense>
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  </Suspense>,
);
