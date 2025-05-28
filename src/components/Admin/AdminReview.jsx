import React, { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import {
  getReview,
  allProducts,
  getOrderRequest,
  removeReview,
  getReviewAll,
} from "../../apis";
import { useCookies } from "react-cookie";
import "../../css/mypage/mypageReview.css";
import "../../css/admin/adminReview.css";
import "../../css/mypage/mypage.css";
import "../../css/main/index.css";
import Paging from "../Mypage/Paging";

export default function AdminReview() {
  const [expanded, setExpanded] = useState(false);
  const [value2, setValue2] = useState(1);
  const [memId, setMemId] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);
  const [products, setProducts] = useState([]);
  const [products2, setProducts2] = useState([]);
  const [expandedStates, setExpandedStates] = useState({});

  useEffect(() => {
    fetchReview();
    fetchProducts();
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

  const fetchReview = async () => {
    try {
      const data = await getReviewAll(); // 수정된 API 호출
      setReviews(data);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const deleteReview = async (revNo) => {
    await removeReview(revNo);
    fetchReview();
  };

  //****페이징****//
  const page = 10;
  const start = (value2 - 1) * page;
  const end = start + page;
  const totalPage = reviews.length;

  const pagedItems = reviews
    .sort((a, b) => new Date(b.revAdd) - new Date(a.revAdd))
    .slice(start, end);
  //****페이징****//

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

  const toggleDescription = (index) => {
    setExpandedStates((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
  return (
    <>
      <h1>리뷰 관리</h1>
      <div className="adminProduct_group">
        <div className="adminProduct_maintitle">
          <h2>리뷰 목록</h2>
        </div>
        <div style={{ width: "1477px", marginTop: "20px" }}>
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
            const revImgUrl = [
              item.revImgUrl1,
              item.revImgUrl2,
              item.revImgUrl3,
              item.revImgUrl4,
              item.revImgUrl5,
            ].filter(Boolean);
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
                  <div>
                    <img
                      src={`http://localhost:8080/api/v1/not_band/images/product/${item.prdNo}.png`}
                      alt={item.prdNo}
                      style={{ backgroundColor: "#eeeeee" }}
                    />
                    <div className="mp_R_ws_prd_text">
                      <div>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <p style={{ marginRight: "10px" }}>{productName}</p>
                          <p
                            style={{
                              marginLeft: "0px",
                              paddingRight: "30px",
                              fontWeight: "400",
                              color: "#8a8a8a",
                            }}
                          >
                            {new Date(item.revAdd)
                              .toISOString()
                              .slice(0, 10)
                              .replace(/-/g, ".")}
                          </p>
                        </div>

                        <p className="reviewcon_option">
                          {isValidProduct && products2[item.ordNo].colorOpt && (
                            <p>옵션 : {products2[item.ordNo].colorOpt}</p>
                          )}
                        </p>

                        <div className="admin_reviewcon_option">
                          <p>{item.memId}</p>
                          <img
                            src="/images/review/fullstars.png"
                            alt=""
                            style={{
                              width: "20px",
                              height: "19px",
                              marginLeft: "8px",
                            }}
                          />
                          <p>{item.revRating}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    className="reviewcon_del_btn"
                    onClick={() => deleteReview(item.revNo)}
                  >
                    <img src="/images/cart/cart_x.png" alt="삭제" />
                  </button>
                </div>

                <div className="reviewcon_text">
                  <div style={{ whiteSpace: "pre-line" }}>
                    {expandedStates[index]
                      ? item.revContent
                      : item.revContent.split("\n").slice(0, 3).join("\n")}
                  </div>

                  {/* 이미지도 확장 상태일 때만 */}
                  {expandedStates[index] && revImgUrl.length > 0 && (
                    <div className="review_extra_images">
                      {revImgUrl.map((img, idx) => (
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

                  {(item.revContent.split("\n").length > 3 ||
                    revImgUrl.length > 0) && (
                    <div
                      onClick={() => toggleDescription(index)}
                      className="reviewcon_more-btn"
                    >
                      {expandedStates[index] ? "접기" : "더보기"}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="page_change3">
          <Paging
            page={page}
            value2={value2}
            setValue2={setValue2}
            totalPage={totalPage}
          />
        </div>
      </div>
    </>
  );
}
