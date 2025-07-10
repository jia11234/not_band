import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../css/resell/resell.css";
import "../../css/instrument/instrument.css";

export default function ResellList({ products, value2 }) {
  // 페이지에 따라 상품 필터링
  const filteredProducts = products.filter((_, index) => {
    if (value2 === 1) return index >= 0 && index < 16;
    if (value2 === 2) return index >= 16 && index < 32;
    if (value2 === 3) return index >= 32 && index < 48;
    return false;
  });

  //중고 상품 등록일 출력
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

  return (
    <>
      {products.length === 0 && (
        <div className="resell_none">📭등록된 게시물이 없습니다.</div>
      )}

      <div className="product_group_list">
        {[...products]
          .filter(
            (product) => product.resComment === 1 || product.resComment === 2,
          ) // 판매중(1), 예약중(2)만 필터링
          .reverse()
          .map((product, index) => (
            <div className="prd_post" key={index}>
              <div className="product_img">
                <Link to={`/not_band/resell-detail?resId=${product.resId}`}>
                  {product.resComment === 2 && (
                    <div className="status_overlay">예약중</div> // 예약중 표시
                  )}
                  <img
                    src={`http://localhost:8080/api/v1/not_band${product.resImgUrl1}`}
                    alt={`${product.resPrd}`}
                  />
                </Link>
              </div>
              <div className="resell_hstag">
                <p>{product.resTag1}</p>
                <p>{product.resTag2}</p>
                <p className="resell_before">{getTimeAgo(product.resTime)}</p>
              </div>
              <h3 className="resell_prd_name">{product.resPrd}</h3>
              <div className="resell_prd_price">
                <p>{product.resPrice.toLocaleString("ko-KR")}원</p>
                <div className="resell_view"></div>
                {product.resView}
                <div className="resell_like"></div>
                {product.resLike}
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
