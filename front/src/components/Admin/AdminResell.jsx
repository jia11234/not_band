import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { allResells, resellDelete } from "../../apis";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import "../../css/admin/adminResell.css";
import "../../css/main/index.css";
import Paging from "../Mypage/Paging";

export default function AdminResell() {
  const [value2, setValue2] = useState(1);
  const [resells, setResells] = useState([]);
  const page = 10;
  const start = (value2 - 1) * page;
  const end = start + page;
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const toggleHeart = async (resId, memId) => {
    const data = await resellDelete(resId);
    fetchResells();
    setOpenDeleteModal(true);
  };

  useEffect(() => {
    fetchResells();
  }, []);
  const fetchResells = async () => {
    try {
      const result = await allResells();
      const sorted = [...result].sort(
        (a, b) => new Date(b.resTime) - new Date(a.resTime),
      );
      setResells(sorted);
    } catch (error) {
      console.error("중고 상품 조회 실패:", error);
    }
  };

  const pagedItems = resells.slice(start, end);

  return (
    <>
      <div className="adminResell_top">
        <h1>중고 거래 관리</h1>
      </div>

      <div className="adminResell_group">
        <div className="adminResell_maintitle">
          <h2>상품 목록</h2>
          <p>
            {resells.length}
            <span>개</span>
          </p>
        </div>

        <div className="adminResell_titleArea">
          <div className="adminResell_title">
            <p>상품 사진</p>
            <p>제목</p>
            <p>가격</p>
            <p>작성자</p>
            <p>날짜</p>
            <p>거래유형</p>
            <p>상태</p>
            <p>정보</p>
            <p>관리</p>
          </div>
        </div>

        <table>
          <tbody>
            {pagedItems.map((resell) => (
              <tr className="adminResell_Tbody" key={resell.id}>
                <td>
                  {" "}
                  <img
                    src={`http://localhost:8080/api/v1/not_band${resell.resImgUrl1}`}
                    alt={`${resell.resPrd}`}
                  />
                </td>
                <td>{resell.resDetail}</td>
                <td>{resell.resPrice.toLocaleString()}</td>
                <td>{resell.memId}</td>
                <td>
                  {resell.resTime
                    ? resell.resTime.slice(5, 10).replace("-", ".")
                    : "-"}
                </td>
                <td>{resell.resDelivery}</td>
                <td>
                  {resell.resComment === 1
                    ? "판매중"
                    : resell.resComment === 2
                      ? "예약중"
                      : "판매완료"}
                </td>
                <td>
                  <button onClick={() => navigate("")}>
                    <Link to={`/not_band/resell-detail?resId=${resell.resId}`}>
                      <p style={{ color: "#0a0a0a" }}>더보기</p>
                    </Link>
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => toggleHeart(resell.resId, resell.memId)}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="page_change3">
          <Paging
            page={page}
            value2={value2}
            setValue2={setValue2}
            totalPage={resells.length}
          />
        </div>
      </div>

      <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <DialogTitle>NOT_BAND</DialogTitle>
        <DialogContent>
          <p style={{ width: "200px", textAlign: "center", marginTop: "10px" }}>
            삭제가 완료되었습니다.
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteModal(false)} color="secondary">
            닫기
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
