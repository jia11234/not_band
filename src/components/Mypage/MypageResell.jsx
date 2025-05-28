import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import {
  Link,
  useNavigate,
  useOutletContext,
  useLocation,
} from "react-router-dom";
import {
  getUserRequest,
  resellUser,
  resellStatus,
  resellDelete,
} from "../../apis";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import "../../css/mypage/mypageResell.css";
import "../../css/main/index.css";
import { LineLoop } from "three";

export default function MypageResell() {
  const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);
  const [value2, setValue2] = useState(1);
  const [resell, setResell] = useState([]);
  const [productTitle, setProductTitle] = useState("");
  const [sortedProducts, setSortedProducts] = useState([]);
  const [memId, setMemId] = useState(null);
  const [starter, setStarter] = useState(false);
  const [filter, setFilter] = useState("전체");
  const [open, setOpen] = useState(false);

  const location = useLocation();
  const category = new URLSearchParams(location.search).get("category");
  const navigate = useNavigate();

  const getMemIdFromToken = (token) => {
    if (!token) return null;


    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/"); // JWT 디코딩을 위한 변환
    const decoded = JSON.parse(window.atob(base64)); // 디코딩

    return decoded.sub; // memId 반환
  };

  useEffect(() => {
    const token = cookies.accessToken; // 쿠키에서 토큰 가져오기
    const memId = getMemIdFromToken(token);
    if (memId) {
      setMemId(memId);
      fetchUser(memId);
      fetchResell(memId);
    } else {
      setOpen(true);
    }
  }, []);

  const fetchResell = async (memId) => {
    try {
      const response = await resellUser(memId);
      setResell(response);
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

  const getTimeAgo = (resTime) => {
    const posted = new Date(resTime);
    const now = new Date();

    const diffMs = now - posted;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "방금 전";
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 10) return `${diffDays}일 전`;

    const year = posted.getFullYear();
    const month = String(posted.getMonth() + 1).padStart(2, "0");
    const day = String(posted.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };


  const handleConfirmDelete = () => {
    if (selectedItem) {
    }
    setOpenDeleteModal(false); // 모달 닫기
    setSelectedItem(null); // 초기화
  };

  const filteredItems = resell.filter((item) => {
    if (filter === "전체") return true; // 필터가 전체일 경우 모든 항목을 반환
    if (filter === "판매중") return item.resComment === 1; // 판매중일 경우 rescomment가 1인 항목만
    if (filter === "예약중") return item.resComment === 2; // 예약중일 경우 rescomment가 2인 항목만
    if (filter === "판매완료") return item.resComment === 0; // 판매완료일 경우 rescomment가 0인 항목만
    return false; // 그 외에는 필터 조건에 맞지 않음
  });
  const itemsPerPageMP = 5;
  const [currentPageMP, setCurrentPageMP] = useState(1);

  // 2. 전체 페이지 수
  const totalPagesMP = Math.ceil(filteredItems.length / itemsPerPageMP);

  // 3. 현재 페이지에 보여줄 상품 데이터 자르기
  const startIndexMP = (currentPageMP - 1) * itemsPerPageMP;
  const endIndexMP = startIndexMP + itemsPerPageMP;
  const currentItems = filteredItems.slice(startIndexMP, endIndexMP);

  const statusToText = {
    0: "판매완료",
    1: "판매중",
    2: "예약중",
  };

  const textToStatus = {
    판매완료: 0,
    판매중: 1,
    예약중: 2,
  };

  const toggleHeart = async (resId) => {
    try {
      const data = await resellDelete(resId);
      fetchResell(memId);
      setOpenDeleteModal(true);
    } catch (error) {
      console.error("찜 토글 실패", error);
      alert("오류가 발생했습니다");
    }
  };

  const handleStatusChange = async (resId, newStatus) => {
    try {
      await resellStatus(resId, newStatus); // 백엔드에 상태 변경 요청

      // 프론트 상태도 반영
      setResell((prev) =>
        prev.map((item) =>
          item.resId === resId ? { ...item, resComment: newStatus } : item,
        ),
      );
    } catch (error) {
      console.error("상태 변경 실패:", error);
      alert("상품 상태 변경에 실패했습니다.");
    }
  };
  const [openDeleteModal, setOpenDeleteModal] = useState(false); // 삭제 확인 모달

  return (
    <div className="mp_R_ord_delivery">
      <div className="mp_R_s_title3">
        <h3>내 상품</h3>
        <div className="mp_R_myprd_menu">
          {["전체", "판매중", "예약중", "판매완료"].map((menu) => (
            <p
              key={menu}
              onClick={() => setFilter(menu)} // 메뉴 클릭 시 필터 상태 변경
              className={`menu-item ${filter === menu ? "active" : ""}`} // 선택된 메뉴에 active 클래스 추가
            >
              {menu}
            </p>
          ))}
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="mp_R_wishlist_empty">등록된 상품이 없습니다.</div>
      ) : (
        filteredItems.map((item) => (
          <>
          <div key={item.prdNo} className="mp_R_myprd_group">
            <img
              src={`http://localhost:8080/api/v1/not_band${item.resImgUrl1}`}
              alt={`${item.resPrd}`}
            />
            <div className="mp_R_ws_prd_text">
              <p className="mp_R_ws_2222" style={{color: "#0a0a0a"}}>{item.resPrd}</p>
              <p className="mp_R_ws_2222" style={{color: "#0a0a0a", fontWeight: "600"}}>{item.resPrice.toLocaleString("ko-KR")} 원</p>
              <p>{getTimeAgo(item.resTime)}</p>
            </div>
            <div>
              <select
                value={statusToText[item.resComment]} // 현재 상태를 문자열로 표시
                onChange={
                  (e) =>
                    handleStatusChange(item.resId, textToStatus[e.target.value]) // 상태 숫자와 resId 전달
                }
              >
                <option value="판매중">판매중</option>
                <option value="예약중">예약중</option>
                <option value="판매완료">판매완료</option>
              </select>
            </div>
            <button>
              <img
                src="/images/cart/cart_x.png"
                alt="x"
                onClick={() => toggleHeart(item.resId)}
              />
            </button>
          </div>
            <div className="resell_state_group">
              <select
                value={statusToText[item.resComment]} // 현재 상태를 문자열로 표시
                onChange={
                  (e) =>
                    handleStatusChange(item.resId, textToStatus[e.target.value]) // 상태 숫자와 resId 전달
                }
              >
                <option value="판매중">판매중</option>
                <option value="예약중">예약중</option>
                <option value="판매완료">판매완료</option>
              </select>
            </div>
            </>
          
        ))
      )}

      <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <DialogTitle>NOT_BAND</DialogTitle>
        <DialogContent>
          <p>삭제완료</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteModal(false)} color="secondary">
            닫기
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
