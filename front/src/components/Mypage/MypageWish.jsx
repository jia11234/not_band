import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useCookies } from "react-cookie";
import { getWishAllRequest, allResells, wishToggle } from "../../apis";
import "../../css/main/index.css";
import "../../css/mypage/mypageWish.css";

export default function MypageWish() {
  const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);
  const [memId, setMemId] = useState(null);
  const [wish, setWish] = useState([]);
  const [products, setProducts] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([
    { prdNo: 101, name: "이것은 좋은 기타다다", price: 69000, selected: false },
    { prdNo: 102, name: "베이스 기타 스트랩", price: 32000, selected: false },
  ]);

  const getMemIdFromToken = (token) => {
    if (!token) return null;

    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/"); // JWT 디코딩을 위한 변환
    const decoded = JSON.parse(window.atob(base64)); // 디코딩

    return decoded.sub; // memId 반환
  };

  //상품 등록일 출력
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
  const deleteSelectedItems = () => {
    setWishlistItems((prev) => prev.filter((item) => !item.selected));
  };

  useEffect(() => {
    const token = cookies.accessToken; // 쿠키에서 토큰 가져오기
    const memId = getMemIdFromToken(token);
    if (memId) {
      fetchWish(memId);
      fetchProducts();
    }
    setMemId(memId);
  }, []);

  const fetchProducts = async () => {
    const data = await allResells();
    setProducts(data);
  };

  //찜 api함수 호출
  const fetchWish = async (memId) => {
    try {
      const data = await getWishAllRequest(memId); // 수정된 API 호출
      setWish(data);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  //하트 토글
  const toggleHeart = async (resId) => {
    try {
      if (memId) {
        const response = {
          memId,
          resId,
        };
        const data = await wishToggle(response);
        fetchWish(memId);
      } else {
      }
    } catch (error) {
      console.error("찜 토글 실패", error);
      alert("오류가 발생했습니다");
    }
  };

  return (
    <div className="mp_R_ord_delivery">
      <div className="mp_R_s_title2">
        <h3>찜 목록</h3>
        <div className="mp_R_wishlist_check"></div>
      </div>
      {wish.length === 0 ? (
        <div className="mp_R_wishlist_empty">
          찜 목록에 담긴 상품이 없습니다.
        </div>
      ) : (
        wish.map((item) => {
          const productName =
            products.find((p) => p.resId === item.resId)?.resPrd ||
            "알 수 없는 상품";
          const productPrice =
            products.find((p) => p.resId === item.resId)?.resPrice ||
            "알 수 없는 상품";
          const productAdd =
            products.find((p) => p.resId === item.resId)?.resTime ||
            "알 수 없는 상품";
          const productUrl =
            products.find((p) => p.resId === item.resId)?.resImgUrl1 ||
            "알 수 없는 상품";
          return (
            <div key={item.wishId} className="mp_R_wishlist_prd_group">
              <div>
                <img
                  src={`http://localhost:8080/api/v1/not_band${productUrl}`}
                  alt={`${item.resId}`}
                />
                <div className="mp_R_ws_prd_text">
                  <div>
                    <p>{productName}</p>
                    <p>{productPrice.toLocaleString()}원</p>
                  </div>
                  <p>{getTimeAgo(productAdd)}</p>
                </div>
              </div>
              <button>
                <img
                  src="/images/cart/cart_x.png"
                  alt="x"
                  onClick={() => toggleHeart(item.resId)}
                />
              </button>
            </div>
          );
        })
      )}
    </div>
  );
}
