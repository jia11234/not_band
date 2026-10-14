import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../css/resell/resell.css";
import "../../css/instrument/instrument.css";
import Paging from "../Mypage/Paging";

export default function ResellList({ products }) {
  const [showResellOnly, setShowResellOnly] = useState(false); // 중고 상품만 보기 상태
  const [value2, setValue2] = useState(1);
  const API_URL = import.meta.env.VITE_API_URL;
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
  const filteredProducts = showResellOnly
    ? products.filter((product) => product.resId)
    : products;
  const page = 16;
  const start = (value2 - 1) * page;
  const end = start + page;
  const totalPage = filteredProducts.length;

  const pagedItems = filteredProducts
    .sort((a, b) => new Date(b.revAdd) - new Date(a.revAdd))
    .slice(start, end);

  // 중고상품만 보기 필터링

  return (
    <>
      <button
        className="only_resell_btn"
        onClick={() => setShowResellOnly(!showResellOnly)}
      >
        {showResellOnly ? "전체 상품 보기" : "중고 상품만 보기"}
      </button>
      <div className="product_group_list" style={{ marginBottom: "150px" }}>
        {/* 중고 상품만 보기 버튼 */}

        {filteredProducts.length === 0 && (
          <div className="resell_none2">📭검색 결과가 없습니다.</div>
        )}

        {pagedItems.reverse().map((product, index) => (
          <div className="prd_post" key={index}>
            <div className="product_img">
              {product.resId && (
                <Link to={`/not_band/resell-detail?resId=${product.resId}`}>
                  <img
                    src={
                      product.image?.startsWith("http")
                        ? product.image
                        : `${API_URL}/api/v1/not_band${product.image}`
                    }
                    alt={product.name}
                  />
                </Link>
              )}
              {product.prdNo && (
                <Link to={`/not_band/instrument-detail?prdNo=${product.prdNo}`}>
                  <img
                    src={`${API_URL}/api/v1/not_band/images/product/${product.prdNo}.png`}
                    alt={product.name}
                  />
                </Link>
              )}
            </div>
            <div>
              {/* 태그가 있는 경우에만 보여주기 */}
              {product.tag && (
                <div className="resell_hstag">
                  <p>{product.tag}</p>
                </div>
              )}
              <h3 className="resell_prd_name">{product.name}</h3>
            </div>
            <div className="resell_prd_price">
              <p>{product.price.toLocaleString("ko-KR")}원</p>
            </div>
          </div>
        ))}
      </div>
      {pagedItems.length >= 1 && (
        <div className="page_change2">
          <Paging
            page={page}
            value2={value2}
            setValue2={setValue2}
            totalPage={totalPage}
          />
        </div>
      )}
    </>
  );
}
