import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/admin/adminProduct.css";
import "../../css/main/index.css";
import Paging from "../Mypage/Paging";
import { allProducts } from "../../apis";
import { getReviewProduct, productDel } from "../../apis";

function getAverageRating(reviews) {
  if (!reviews || reviews.length === 0) return 0;
  const total = reviews.reduce((acc, cur) => acc + cur.revRating, 0);
  return (total / reviews.length).toFixed(1);
}

export default function () {
  const [value2, setValue2] = useState(1);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const handleDelete2 = (prdNo) => {
    navigate(`/not_band/admin/productupload?prdNo3=${prdNo}`);
  };

  //****페이징****//
  const page = 10;
  const start = (value2 - 1) * page;
  const end = start + page;

  const pagedItems = products.slice(start, end);

  useEffect(() => {

    fetchAllProducts();
  }, []);
  const fetchAllProducts = async () => {
    try {
      const data = await allProducts();
      const dataWithReviews = await Promise.all(
        data.map(async (product) => {
          const reviews = await getReviewProduct(product.prdNo);
          return { ...product, reviews };
        }),
      );
      setProducts(dataWithReviews);
    } catch (error) {
      console.error("에러 발생:", error);
    }
  };

  return (
    <>
      <div className="adminProduct_top">
        <h1>상품 관리</h1>
        <div>
          <button onClick={() => navigate("/not_band/admin/productupload")}>
            상품등록
          </button>
        </div>
      </div>

      <div className="adminProduct_group">
        <div className="adminProduct_maintitle">
          <h2>상품 목록</h2>
          <p>
            {products.length}
            <span>개</span>
          </p>
        </div>

        <div className="adminProduct_titleArea">
          <div className="adminProduct_title">
            <p>상품사진</p>
            <p>상품명</p>
            <p>가격</p>
            <p>할인</p>
            <p>재고수량</p>
            <p>리뷰평점</p>
            <p>관리</p>
          </div>
        </div>

        <table>
          {pagedItems.map((product, index) => (
            <tr className="adminProduct_Tbody" key={index}>
              <td>
                <img
                  src={`http://localhost:8080/api/v1/not_band/images/product/${product.prdNo}.png`}

                  alt={`${product.prdNo}`}
                />
              </td>
              <td>{product.prdName}</td>
              <td>{product.prdPrice.toLocaleString()}</td>
              <td>{product.prdDiscount}%</td>
              <td>{product.prdStock}</td>
              <td>
                <img src="/images/review/fullstars.png" alt="" />
                <p>{getAverageRating(product.reviews || [])}</p>
              </td>
              <td>
              <button onClick={() => handleDelete2(product.prdNo)}>수정</button>
              </td>
            </tr>
          ))}
        </table>
        <div className="page_change3">
          <Paging
            page={page}
            value2={value2}
            setValue2={setValue2}
            totalPage={products.length}
          />
        </div>
      </div>
    </>
  );
}
