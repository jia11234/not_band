import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getReviewProduct } from "../../apis";
import "../../css/main/index.css";
import "../../css/instrument/productDetail.css";
import "../../css/instrument/instrument.css";
import Paging from "../Mypage/Paging";
export default function ProductDetailTab({ product }) {
  const [expanded, setExpanded] = useState(false);
  const [value2, setValue2] = useState(1);
  const [tab, setTab] = useState(1);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchReview(product.prdNo);
  }, [product]);

  const fetchReview = async (memId) => {
    try {
      const data = await getReviewProduct(memId); // 수정된 API 호출
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

  //****페이징****//
  const page = 5;
  const start = (value2 - 1) * page;
  const end = start + page;
  const totalPage = reviews.length;

  const pagedItems = reviews
    .sort((a, b) => new Date(b[0]) - new Date(a[0]))
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

  const renderAverageStars = (averageRating) => {
    const fullCount = Math.floor(averageRating);
    const emptyCount = 5 - fullCount;

    const fullStars = Array(fullCount).fill("/images/review/fullstars.png");
    const emptyStars = Array(emptyCount).fill("/images/review/stars.png");

    return [...fullStars, ...emptyStars].map((src, index) => (
      <img
        key={index}
        src={src}
        alt="평균 별점"
        style={{ width: "31px", height: "30px" }}
      />
    ));
  };

  const getAverageRating = (reviews) => {
    const total = reviews.reduce((sum, review) => sum + review.revRating, 0);
    const average = total / reviews.length;
    return average.toFixed(1);
  };

  const toggleDescription = () => {
    setExpanded(!expanded);
  };
  //////////////////////

  const sortedReviews = [...reviews].sort((a, b) => {
    if (a.isBest && !b.isBest) return -1;
    if (!a.isBest && b.isBest) return 1;
    return new Date(b.date) - new Date(a.date);
  });

  const reviewCount = reviews.length;
  const hasValidReviews = reviews.some(
    (review) => review.username && review.username.trim() !== "",
  );

  const formatNumber = (number) => {
    return number.toLocaleString("ko-KR"); // 한국식 천단위 콤마
  };

  const handlerTab = (value) => {
    setTab(value); // 선택된 탭을 설정
  };

  const maskName = (name) => {
    if (!name || name.length === 0) return "";
    return name[0] + "*".repeat(name.length - 1);
  };

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // 별점 렌더

  const currentReviews = sortedReviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const totalPages = Math.ceil(sortedReviews.length / itemsPerPage);
  return (
    <div className="tab_content">
      <div className="detail_tab">
        <div>
          <div
            onClick={() => handlerTab(1)}
            className={tab === 1 ? "active" : ""}
          >
            상세설명
          </div>
          <div
            onClick={() => handlerTab(2)}
            className={tab === 2 ? "active" : ""}
          >
            교환 및 반품
          </div>
          <div
            onClick={() => handlerTab(3)}
            className={tab === 3 ? "active" : ""}
          >
            리뷰
          </div>
        </div>
      </div>
      {tab === 1 && (
        <img
          src={`http://localhost:8080/api/v1/not_band/images/detail/${product.prdNo}.png`}
          alt={`${product.prdNo}`}
          className="con5"
        />
      )}
      {tab === 2 && <img src={`/images/detail/return.png`} alt="" />}
      {tab === 3 && (
        <div className="con3_group">
          {/* con3_title은 항상 보여줌 */}
          <div className="con3_title">
            <p>상품리뷰</p>
            <p>{formatNumber(reviewCount)}개</p>
          </div>

          {reviews.length > 0 ? (
            <>
              <div className="con3_aver_stars">
                <p>평균 평점</p>
                <p>{getAverageRating(reviews)}</p>
                <div className="stars">
                  {renderAverageStars(getAverageRating(reviews))}
                </div>
              </div>

              <div className="con3_review_group">
                {reviews.map((review, index) => (
                  <div className="con3_user_review" key={index}>
                    <div className="user_review_name">
                      {review.memNick}
                      <div className="user_review_date">
                        {new Date(review.revAdd)
                          .toISOString()
                          .slice(0, 10)
                          .replace(/-/g, ".")}
                      </div>
                    </div>
                    <div className="user_review_text">
                      <div>{renderStars(review.revRating)}</div>
                      <div className="reviewcon_text2">
                        <div style={{ whiteSpace: "pre-line" }}>
                          {expanded
                            ? review.revContent
                            : review.revContent
                                .split("\n")
                                .slice(0, 3)
                                .join("\n")}
                        </div>
                        {review.revContent.split("\n").length > 3 && (
                          <div
                            onClick={toggleDescription}
                            className="reviewcon_more-btn"
                          >
                            {expanded ? "접기" : "더보기"}
                          </div>
                        )}
                      </div>
                      {review.revImgUrl.map((img, idx) => (
                        <div className="reviewcon_img" key={idx}>
                          <img
                            src={
                              img.startsWith("/images/resell")
                                ? `http://localhost:8080/api/v1/not_band/images/review/${img.replace("/images/resell/", "")}`
                                : `http://localhost:8080/api/v1/not_band/${img.replace(/^\//, "")}` // 맨 앞 / 제거
                            }
                            alt={`Review Image ${idx}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
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
          ) : (
            // 유효한 리뷰 없을 때
            <div className="no_review_msg">작성된 리뷰가 없습니다.</div>
          )}
        </div>
      )}
    </div>
  );
}
