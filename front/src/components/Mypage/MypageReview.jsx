import React, { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import {
  getReview,
  allProducts,
  getOrderRequest,
  removeReview,
} from "../../apis";
import { useCookies } from "react-cookie";
import "../../css/mypage/mypageReview.css";
import "../../css/mypage/mypage.css";
import "../../css/mypage/mypageWish.css";
import "../../css/main/index.css";
import Paging from "./Paging";

export default function MypageReview() {
  const [expanded, setExpanded] = useState(false);
  const [value2, setValue2] = useState(1);
  const [memId, setMemId] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);
  const [products, setProducts] = useState([]);
  const [products2, setProducts2] = useState([]);

  useEffect(() => {
    const token = cookies.accessToken; // 쿠키에서 토큰 가져오기
    const memId = getMemIdFromToken(token);
    if (memId) {
      fetchReview(memId);
      fetchProducts();
      fetchOrder(memId);
    }
    setMemId(memId);
  }, []);

  const getMemIdFromToken = (token) => {
    if (!token) return null;


    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/"); // JWT 디코딩을 위한 변환
    const decoded = JSON.parse(window.atob(base64)); // 디코딩

    return decoded.sub; // memId 반환
  };

  const fetchProducts = async () => {
    try {
      const response = await allProducts();
      setProducts(response);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchOrder = async (memId) => {
    const data = await getOrderRequest(memId);
    const product2 = data.map((order) => order.products).flat();
    setProducts2(data);
  };

  const fetchReview = async (memId) => {
    try {
      const data = await getReview(memId); // 수정된 API 호출
      setReviews(data);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const today = new Date();
  const formatKoreanDate = (dateObj) => {
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    const dayOfWeek = days[dateObj.getDay()];
    return `${month}.${day}(${dayOfWeek})`;
  };

  const formattedDateweek = formatKoreanDate(today);

  const deleteReview = async (revNo) => {
    await removeReview(revNo);
    fetchReview(memId);
  };

  //****페이징****//
  const page = 5;
  const start = (value2 - 1) * page;
  const end = start + page;
  const totalPage = reviews.length;

  const pagedItems = reviews
    .sort((a, b) => new Date(b.revAdd) - new Date(a.revAdd))
    .slice(start, end);
  //****페이징****//

  const toggleDescription = () => {
    setExpanded(!expanded);
  };

  //별 누르면 이미지 변환
  const renderStars = (rating) => {
    const fullStars = Array(rating).fill("/images/review/fullstars.png");
    const emptyStars = Array(5 - rating).fill("/images/review/stars.png");
    const allStars = [...fullStars, ...emptyStars];

    return allStars.map((src, i) => (
      <img
        key={i}
        src={src}
        alt="별점"
        style={{ width: "22px", height: "21px" }}
      />
    ));
  };

  return (
    <>
      <div className="reviewcon_group">
        <div className="mp_R_s_title">
          <h3>리뷰 관리</h3>
          <select className="reviewcon_select">
            <option value="3개월">3개월</option>
            <option value="6개월">6개월</option>
            <option value="1년">1년</option>
            <option value="2년">2년</option>
            <option value="3년">3년</option>
          </select>
          <p>
            <span style={{ color: "#FF4A01" }}>{reviews.length}</span>건
          </p>
        </div>
        {pagedItems.length === 0 && (
          <div className="mp_R_wishlist_empty">작성된 리뷰가 없습니다.</div>
        )}

        {pagedItems.map((item, index) => {
          const productName =
            products.find((p) => p.prdNo === item.prdNo)?.prdName ||
            "알 수 없는 상품";
          const productOption = products2[item.ordNo]?.colorOpt || "";
          const isValidProduct =
            products2[item.ordNo]?.prdNo === item.prdNo &&
            products2[item.ordNo]?.addProduct === false;
          const matchingProduct = products2
            .find((order) => order.ordNo === item.ordNo)
            ?.products.find((product) => product.prdNo === item.prdNo);
          const review2 = reviews
            .filter((p) => p.prdNo === item.prdNo)
            .map((p) => p.ordNo);
          return (
            <div
              key={index}
              style={{
                borderBottom: "1px solid #8a8a8a",
                paddingBottom: "20px",
              }}
            >
              <div
                className="mp_R_wishlist_prd_group"
                style={{ borderBottom: "none", position: "relative" }}
              >
                <div className="mypage_review_title_group">
                <img src={`http://localhost:8080/api/v1/not_band/images/product/${item.prdNo}.png`} />
                  <div className="mp_R_ws_prd_text">
                    <div>
                      <p>
                        {productName}
                      </p>
                      <p className="reviewcon_option">
                        {isValidProduct && products2[item.ordNo].colorOpt && (
                          <p>옵션 : {products2[item.ordNo].colorOpt}</p>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                <Link
                  to="/not_band/review-registration"
                  state={{
                    ordNo: item.ordNo,
                    product: matchingProduct,
                    revNo: item.revNo,
                  }}
                >
                  <p className="reviewcon_change">수정</p>
                </Link>
                <button
                  className="reviewcon_del_btn"
                  onClick={() => deleteReview(item.revNo)}
                >
                  <img src="/images/cart/cart_x.png" alt="삭제" />
                </button>
              </div>
                <Link
                  to="/not_band/review-registration"
                  state={{
                    ordNo: item.ordNo,
                    product: matchingProduct,
                    revNo: item.revNo,
                  }}
                >
                  <p className="reviewcon_change2">수정</p>
                </Link>
              <div className="reviewcon_star_flex">
                <p>{renderStars(item.revRating)}</p>
                <p>
                  {new Date(item.revAdd)
                    .toISOString()
                    .slice(0, 10)
                    .replace(/-/g, ".")}
                </p>
              </div>
              {item.revImgUrl.length > 0 && (
                <div className="review_extra_images">
                  {item.revImgUrl.map((img, idx) => (
                    <div className="reviewcon_img" key={idx}>
                      <img
                          src={`http://localhost:8080/api/v1/not_band/images/review/${
                            img.substring(img.lastIndexOf("/") + 1)
                          }`}
                          alt={img}
                        />
                    </div>
                  ))}
                </div>
              )}
              <div className="reviewcon_text">
                <div className="reviewcon_text">
                  <div style={{ whiteSpace: "pre-line" }}>
                    {expanded
                      ? item.revContent
                      : item.revContent.split("\n").slice(0, 3).join("\n")}
                  </div>
                  {item.revContent.split("\n").length > 3 && (
                    <div
                      onClick={toggleDescription}
                      className="reviewcon_more-btn"
                    >
                      {expanded ? "접기" : "더보기"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="page_change2">
        <Paging
          page={page}
          value2={value2}
          setValue2={setValue2}
          totalPage={totalPage}
        />
      </div>
    </>
  );
}
