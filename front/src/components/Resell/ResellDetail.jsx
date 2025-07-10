import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  resellDetail,
  wishToggle,
  getWishRequest,
  viewCount,
  chatRoom,
} from "../../apis";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import "../../css/main/index.css";
import "../../css/resell/resellDetail.css";

export default function ResellDetail() {
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false); //모달
  const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);
  const resId = new URLSearchParams(location.search).get("resId");
  const [seller, setSeller] = useState();
  const [id, setId] = useState();
  const [resell, setResell] = useState({
    resImgUrl: [],
  });
  const [viewCount2, setViewCount2] = useState(0);
  const [hasViewed, setHasViewed] = useState(false);

  //모달 닫기
  const handleClose = () => {
    setOpen(false);
  };

  //로그인 창으로 이동
  const handleClose2 = () => {
    setOpen(false);
    navigate("/not_band/login");
  };

  const getMemIdFromToken = (token) => {
    if (!token) return null;


    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/"); // JWT 디코딩을 위한 변환
    const decoded = JSON.parse(window.atob(base64)); // 디코딩

    return decoded.sub; // memId 반환
  };

  useEffect(() => {
    const viewed = localStorage.getItem(`viewed_${resId}`);
    const token = cookies.accessToken;
    const memId = getMemIdFromToken(token);
    const lastViewedDate = localStorage.getItem(`viewed_date_${resId}`);
    const today = new Date().toISOString().slice(0, 10);
    if (memId) {
      setId(memId);
      getWish(memId, resId);
    }
    if (lastViewedDate !== today) {
      const increaseView = async () => {
        try {
          await viewCount(resId);
          setViewCount2((prevCount) => prevCount + 1);

          localStorage.setItem(`viewed_${resId}`, "true");
          localStorage.setItem(`viewed_date_${resId}`, today);
        } catch (error) {
          console.error("조회수 증가 실패", error);
        }
      };

      increaseView();
      fetchProduct();
    }
    fetchProduct();
  }, []);

  //종고 상품 상세 조회
  const fetchProduct = async () => {
    if (resId) {
      const resData = await resellDetail(resId);
      setResell(resData);
      setSeller(resData.memId);
    }
  };

  //찜 토글 api 함수 호출
  const getWish = async (memId, resId) => {
    try {
      const resData = await getWishRequest(memId, resId);
      if (resData) {
        setIsLiked(true);
      } else {
        setIsLiked(false);
      }
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
    return `${diffDays}일 전`;
  };

  // 이미지 변경 함수 (토글 방식)
  const toggleHeart = async () => {
    try {
      if (id) {
        const response = {
          memId: id,
          resId,
        };
        const data = await wishToggle(response);
        setIsLiked((prev) => !prev);
        fetchProduct();
      } else {
        setOpen(true);
      }
    } catch (error) {
      console.error("찜 토글 실패", error);
      alert("오류가 발생했습니다");
    }
  };

  //만약 판매자라면 경고문 출력 방이 없다면 채팅방 생성 있다면 채팅방으로 이동
  const handleChat = async () => {
    try {
      if (id) {
        if (seller !== id) {
          const response = {
            memId2: id,
            resId,
            memId1: seller,
          };
          const data = await chatRoom(response);
          if (!data.isNew) {
            window.location.href = `/not_band/chat?chatId=${data.chatId}&resId=${resId}`;
          }
        } else {
          alert("회원님이 작성한 글입니다.");
        }
      } else {
        setOpen(true);
      }
    } catch (error) {
      console.error("찜 토글 실패", error);
      alert("오류가 발생했습니다");
    }
  };

  // 슬라이드 설정
  const reselldtl = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose} disableScrollLock>
        <DialogTitle>NOT_BAND</DialogTitle>
        <DialogContent>
          <p>로그인 후에만 사용할 수 있어여</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            닫기
          </Button>
          <Button onClick={handleClose2} color="primary">
            로그인하기
          </Button>
        </DialogActions>
      </Dialog>
      <div className="reselldtl_group">
        <div className="reselldtl_left">
          {resell.resImgUrl.length > 1 ? (
            <Slider {...reselldtl}>
              {resell.resImgUrl.map((url, index) => (
                <div key={index}>
                  <img
                    src={`http://localhost:8080/api/v1/not_band${url}`}
                    alt={`resell-image-${index}`}
                  />
                </div>
              ))}
            </Slider>
          ) : (
            <div>
              <img
                src={`http://localhost:8080/api/v1/not_band${resell.resImgUrl}`}
                alt={`resell-image-${resell.resImgUrl}`}
              />
            </div>
          )}
          <div className="resell_id">
            <p>판매자</p>
            {resell.memNick}
          </div>
        </div>
        <div className="resellprd_info_group">
          <h3>{resell.resPrd}</h3>
          <h1>{Number(resell.resPrice).toLocaleString()}원</h1>
          <div className="resellviewer">
            <img src="/images/resell/reselldtl_viewer.png" alt="viewer" />
            <p>{resell.resView}</p>
            <img
              src="/images/resell/reselldtl_heartCount.png"
              alt="heartCount"
            />
            <p>{resell.resLike}</p>
          </div>
          <div className="resell_line"></div>
          <h4>{getTimeAgo(resell.resTime)}</h4>
          <div className="resellprd_group">
            <div className="resellprd">
              <p>태그</p>
              <p>{resell.resTag}</p>
            </div>
            <div className="resellprd">
              <p>상품상태</p>
              <p>{resell.resCondition}</p>
            </div>
            {resell.resDelivery &&
              (resell.resDelPrice == 0 ? (
                <div className="resellprd">
                  <p>배송비</p>
                  <p>무료배송</p>
                </div>
              ) : (
                <div className="resellprd">
                  <p>배송비</p>
                  <p>{resell.resCondition}</p>
                </div>
              ))}
            {resell.resAddress == "" ? (
              <div className="resellprd">
                <p>직거래</p>
                <p>불가</p>
              </div>
            ) : (
              <div className="resellprd">
                <p>직거래</p>
                <p>{resell.resAddress}</p>
              </div>
            )}
          </div>
          <div className="resDetail">
            <p
              dangerouslySetInnerHTML={{
                __html: resell.resDetail
                  ? resell.resDetail.replace(/\n/g, "<br />")
                  : "",
              }}
            />
          </div>
          <div className="reselldtl_btn_group">
            <div>
              <img
                src={
                  isLiked
                    ? "/images/resell/heart_filled.png"
                    : "/images/resell/heart_btn.png"
                }
                alt="찜하기"
                onClick={toggleHeart}
              />
            </div>
            <div className="resell_btn" onClick={handleChat}>
              채팅하기
            </div>
          </div>
          <div className="resell_warning">
            <input type="checkbox" id="toggle" hidden />
            <label htmlFor="toggle">중고거래 주의 사항 </label>
            <div className="content">
              &#8226; 물품 상태를 직접 확인하세요. <br />
              &#8226; 비정상적으로 높거나 낮은 가격은 주의하세요. <br />
              &#8226; 공개된 장소에서 거래하세요. <br />
              &#8226; 현금 거래 시 위조 지폐 여부를 확인하세요. <br />
              &#8226; 급한 거래나 의심스러운 행동 시 즉시 거래를 중단하세요.{" "}
              <br />
              &#8226; 물건을 수령한 후에 송금하세요. <br />
              &#8226; 고가의 제품은 계약서 작성을 권장합니다. <br />
              &#8226; 판매자 정보가 신뢰할 수 있는지 확인하세요. <br />
              &#8226; 반품/교환 가능 여부를 사전에 확인하고 합의하세요. <br />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
