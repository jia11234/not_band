import { Link, useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { allResells } from "../../apis";
import "../../css/main/index.css";
import FilterGroup from "../instrument/FilterGroup";
import ResellList from "./ResellList";
import "../../css/resell/resell.css";

export default function Resell() {
  const [value2, setValue2] = useState(1);
  const [products, setProducts] = useState([]);
  const [productTitle, setProductTitle] = useState("");
  const [sortedProducts, setSortedProducts] = useState([]);
  const [starter, setStarter] = useState(false);

  const [isDrop, setDrop] = useState(false);

  const location = useLocation();
  const category = new URLSearchParams(location.search).get("category");
  const navigate = useNavigate();

  const ProductMenu = [
    { smenu: "G", menu: ["일렉 기타", "베이스 기타"], link: ["GEG", "GBG"] },
    { smenu: "D", menu: ["드럼", "전자드럼"], link: ["DAD", "DED"] },
    {
      smenu: "K",
      menu: ["디지털 피아노", "신디사이저", "전자 키보드"],
      link: ["KDP", "KSY", "KEK"],
    },
    {
      smenu: "M",
      menu: ["앰프", "이펙터", "마이크"],
      link: ["MAMP", "MFX", "MMIC"],
    },
    {
      smenu: "A",
      menu: ["기타", "건반", "드럼", "음향장비"],
      link: ["AGA", "AKA", "ADA", "AMA"],
    },
    { smenu: "S", menu: ["All"], link: ["S"] },
    { smenu: "Q", menu: ["전체", "기타", "건반"], link: ["Q", "T", "P"] },
  ];

  //카테고리별로 상품 상품 출력
  useEffect(() => {
    if (category === "S") {
      const fetchProducts = async () => {
        const data = await allResells();
        setProducts(data);
      };
      fetchProducts();
    } else if (category == "G") {
      const fetchProducts = async () => {
        const data = await allResells();
        const filteredData = data.filter((item) => item.resCategory === "기타");
        setProducts(filteredData);
      };
      fetchProducts();
    } else if (category == "D") {
      const fetchProducts = async () => {
        const data = await allResells();
        const filteredData = data.filter((item) => item.resCategory === "드럼");
        setProducts(filteredData);
      };
      fetchProducts();
    } else if (category == "K") {
      const fetchProducts = async () => {
        const data = await allResells();
        const filteredData = data.filter(
          (item) => item.resCategory === "키보드",
        );
        setProducts(filteredData);
      };
      fetchProducts();
    } else if (category == "M") {
      const fetchProducts = async () => {
        const data = await allResells();
        const filteredData = data.filter(
          (item) => item.resCategory === "음향장비",
        );
        setProducts(filteredData);
      };
      fetchProducts();
    }
  }, [category]);

  //페이징
  const handlePage = (value) => {
    setValue2((move) => {
      if (value === 1) {
        return move === 1 ? 1 : move - 1;
      } else if (value === 5) {
        return move === 3 ? 3 : move + 1;
      } else if (value === 2) {
        return 1;
      } else if (value === 3) {
        return 2;
      } else if (value === 4) {
        return 3;
      }
      return move;
    });
  };

  const total = Math.ceil(products.length / 16);

  return (
    <div className="shop">
      <div className="shop_title">
        <div className="shop_title_group">
          <img src="/images/instrument/resell_box.png" alt="" />
          <h1>중고 마켓</h1>
        </div>
        <div className="Smenu2">
          <div className="Smenu3">
            <Link
              to="/not_band/resell?category=S"
              className={`menu ${category?.charAt(0) === "S" ? "active" : ""}`}
            >
              <p>전체</p>
            </Link>
            <Link
              to="/not_band/resell?category=G"
              className={`menu ${category?.charAt(0) === "G" ? "active" : ""}`}
            >
              <p>기타</p>
            </Link>
            <Link
              to="/not_band/resell?category=D"
              className={`menu ${category?.charAt(0) === "D" ? "active" : ""}`}
            >
              <p>드럼</p>
            </Link>
            <Link
              to="/not_band/resell?category=K"
              className={`menu ${category?.charAt(0) === "K" ? "active" : ""}`}
            >
              <p>건반</p>
            </Link>
            <Link
              to="/not_band/resell?category=M"
              className={`menu ${category?.charAt(0) === "M" ? "active" : ""}`}
            >
              <p>음향장비</p>
            </Link>
            {/* <Link to="/not_band/resell?category=A" className={`menu ${category.charAt(0) === "A" ? "active" : ""}`}><p>액세서리</p></Link> */}
          </div>
        </div>
      </div>
      <div className="myresell">
        <div>
          <Link to="/not_band/mypage/wish">
            <p>
              <img src="/images/resell/pick.png" alt="" />
              &nbsp;찜 목록
            </p>
          </Link>
          <p className="resell_dot">&#8226;</p>
          <Link to="/not_band/chat-list">
            <p>
              <img src="/images/resell/chat.png" alt="" />
              &nbsp;중고 거래톡
            </p>
          </Link>
          <p className="resell_dot">&#8226;</p>
          <Link to="/not_band/resell-registration">
            <p>
              <img src="/images/resell/check-circle.png" alt="" />
              &nbsp;상품등록
            </p>
          </Link>
        </div>
      </div>

      <ResellList products={products} value2={value2} starter={starter} />
      <div className="page_change">
        <div>
          <button onClick={() => handlePage(1)}>
            {" "}
            <img src="/images/instrument/left.png" alt="왼쪽 버튼" />{" "}
          </button>
          {[...Array(total)].map((_, index) => (
            <p
              key={index}
              onClick={() => handlePage(index + 2)}
              className={`menu ${value2 === index + 1 ? "active" : ""}`}
            >
              {index + 1}
            </p>
          ))}
          <button onClick={() => handlePage(5)}>
            {" "}
            <img src="/images/instrument/right.png" alt="오른쪽 버튼" />{" "}
          </button>
        </div>
      </div>
    </div>
  );
}
