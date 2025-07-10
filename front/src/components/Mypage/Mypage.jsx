import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  getOrderRequest,
  allProducts,
  getUserRequest,
  inquiryRoom,
} from "../../apis";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import "../../css/mypage/mypage.css";
import "../../css/main/index.css";
import MypageMenu from "./MypageMenu";
import MypageUser from "./MypageUser";
import MypageOrder from "./MypageOrder";
import MypageWish from "./MypageWish";
import MypageReview from "./MypageReview";
import MypageUserEdit from "./MypageUserEdit";
import MypageResell from "./MypageResell";

export default function Mypage() {
  const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);
  const [products, setProducts] = useState([]); //상품 목록
  const [memId, setMemId] = useState(null);
  const [page, setPage] = useState("order");
  const [user, setUser] = useState({});
  const [open, setOpen] = useState(false); //모달
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const getMemIdFromToken = (token) => {
    if (!token) return null;

    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/"); // JWT 디코딩을 위한 변환
    const decoded = JSON.parse(window.atob(base64)); // 디코딩

    return decoded.sub; // memId 반환
  };

  const handleClose = () => {
    setOpen(false); // 모달 닫기
    navigate("/not_band");
  };

  const handleClose2 = () => {
    setOpen(false); // 모달 닫기
    navigate("/not_band/login");
  };

  const handleInquire = async () => {
    try {
      if (memId) {
        const response = {
          memId: memId,
          selId: "admin",
        };
        const data = await inquiryRoom(response);
        if (!data.isNew) {
          window.location.href = `/not_band/inquiry?chatId=${data.chatId}`;
        }
      }
    } catch (error) {
      console.error("찜 토글 실패", error);
      setOpen(true);
    }
  };

  useEffect(() => {
    const token = cookies.accessToken; // 쿠키에서 토큰 가져오기
    const memId = getMemIdFromToken(token);
    if (memId) {
      setMemId(memId);
      fetchProducts();
      fetchUser(memId);
    } else {
      setOpen(true);
    }
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await allProducts();
      setProducts(response);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchUser = async (memId) => {
    try {
      const response = await getUserRequest(memId);
      setUser(response);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="mypage_group">
      <Dialog open={open} onClose={handleClose} disableScrollLock>
        <DialogTitle>NOT_BAND</DialogTitle>
        <DialogContent>
          <p>마이페이지는 로그인 후에만 사용할 수 있어여</p>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            sx={{
              color: "#0371B9",
              fontSize: "19px",
              fontWeight: "500",
              width: "150px",
            }}
          >
            닫기
          </Button>
          <Button
            onClick={handleClose2}
            sx={{
              color: "#FF4A01",
              fontSize: "19px",
              fontWeight: "500",
              width: "150px",
            }}
          >
            로그인하기
          </Button>
        </DialogActions>
      </Dialog>
      <div className="mypage_title">MYPAGE</div>
      <div className="mypage_flex">
        <MypageMenu handleInquire={handleInquire} />
        <div className="mypage_right_group">
          <MypageUser user={user} />
          {path === "/not_band/mypage" && (
            <MypageOrder memId={memId} products={products} />
          )}
          {path === "/not_band/mypage/wish" && <MypageWish />}
          {path === "/not_band/mypage/review" && <MypageReview />}
          {path === "/not_band/mypage/user-edit" && <MypageUserEdit />}
          {path === "/not_band/mypage/resell" && <MypageResell />}
        </div>
      </div>
    </div>
  );
}
