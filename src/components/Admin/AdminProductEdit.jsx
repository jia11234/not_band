import React, { useState } from "react";
import "../../css/admin/adminProduct.css";
import "../../css/main/index.css";
import Paging from "../Mypage/Paging";

export default function AdminProductEdit() {
  const [value2, setValue2] = useState(1);

  const dummyProducts = [
    {
      id: 1,
      name: "Darkglass- M500 Combo",
      price: "4,090,264원",
      discount: "10%",
      stock: "67개",
      date: "2025.05.03",
      rating: 4.8,
      image: "",
    },
    {
      id: 2,
      name: "Fender Rumble 100",
      price: "790,000원",
      discount: "5%",
      stock: "23개",
      date: "2025.05.01",
      rating: 4.5,
      image: "",
    },
    {
      id: 3,
      name: "Ampeg BA-110v2",
      price: "530,000원",
      discount: "8%",
      stock: "12개",
      date: "2025.04.28",
      rating: 4.2,
      image: "",
    },
    {
      id: 4,
      name: "Markbass CMD JB Players School",
      price: "1,200,000원",
      discount: "7%",
      stock: "5개",
      date: "2025.04.25",
      rating: 4.6,
      image: "",
    },
    {
      id: 5,
      name: "Boss Katana Bass",
      price: "650,000원",
      discount: "6%",
      stock: "14개",
      date: "2025.04.20",
      rating: 4.4,
      image: "",
    },
    {
      id: 6,
      name: "Hartke HD150",
      price: "580,000원",
      discount: "9%",
      stock: "9개",
      date: "2025.04.19",
      rating: 4.3,
      image: "",
    },
    {
      id: 7,
      name: "Orange Crush Bass 100",
      price: "890,000원",
      discount: "4%",
      stock: "3개",
      date: "2025.04.17",
      rating: 4.7,
      image: "",
    },
    {
      id: 8,
      name: "Phil Jones BG-120",
      price: "1,590,000원",
      discount: "3%",
      stock: "2개",
      date: "2025.04.10",
      rating: 4.9,
      image: "",
    },
    {
      id: 9,
      name: "Laney Richter RB4",
      price: "450,000원",
      discount: "12%",
      stock: "19개",
      date: "2025.04.08",
      rating: 4.1,
      image: "",
    },
    {
      id: 10,
      name: "Peavey Max 100",
      price: "610,000원",
      discount: "5%",
      stock: "7개",
      date: "2025.04.05",
      rating: 4.0,
      image: "",
    },
    {
      id: 11,
      name: "Ashdown Studio 12",
      price: "720,000원",
      discount: "6%",
      stock: "11개",
      date: "2025.04.01",
      rating: 4.5,
      image: "",
    },
  ];

  const page = 10;
  const start = (value2 - 1) * page;
  const end = start + page;

  const pagedItems = dummyProducts.slice(start, end);

  return (
    <>
      <div className="adminProduct_top">
        <h1>상품 관리</h1>
        <div>
          <button>상품등록</button>
        </div>
      </div>

      <div className="adminProduct_group">
        <div className="adminProduct_maintitle">
          <h2>상품 목록</h2>
          <p>
            {dummyProducts.length}
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
            <p>등록일</p>
            <p>리뷰평점</p>
            <p>관리</p>
          </div>
        </div>

        <table>
          {pagedItems.map((product) => (
            <tr className="adminProduct_Tbody" key={product.id}>
              <td>
                <img src={product.image} alt="thumbnail" />
              </td>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.discount}</td>
              <td>{product.stock}</td>
              <td>{product.date}</td>
              <td>
                <img src="/images/review/fullstars.png" alt="" />
                {product.rating}
              </td>
              <td>
                <button>수정</button>
              </td>
            </tr>
          ))}
        </table>

        <div className="page_change3">
          <Paging
            page={page}
            value2={value2}
            setValue2={setValue2}
            totalPage={dummyProducts.length}
          />
        </div>
      </div>
    </>
  );
}
