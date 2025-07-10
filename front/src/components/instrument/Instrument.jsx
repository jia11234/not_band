import { Link, useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { allProducts, productCategory } from "../../apis";
import "../../css/main/index.css";
import "../../css/instrument/instrument.css";
import FilterGroup from "./FilterGroup";
import ProductList from "./ProductList";
import Paging from "../Mypage/Paging";

export default function Instrument({setCartCount}) {
  const [value2, setValue2] = useState(1);
  const [products, setProducts] = useState([]);
  const [productTitle, setProductTitle] = useState("");
  const [sortedProducts, setSortedProducts] = useState([]);
  const [starter, setStarter] = useState(false);
  const [selectedSort, setSelectedSort] = useState("");

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
    { smenu: "S", menu: ["ALL"], link: ["S"] },
    { smenu: "Q", menu: ["ALL"], link: ["Q"] },
    
  ];

  const page = 16;
  const start = (value2 - 1) * page;
  const end = start + page;
  const totalPage = products.length;

  useEffect(() => {
    const fetchProducts = async () => {
      let categoryData = [];

      if (category) {
        categoryData = await productCategory(category);
        setProducts(categoryData);
        setSortedProducts(categoryData);

        if (category.charAt(0) === "G") {
          setDrop(false);
          setValue2(1);
          setProductTitle("GUITAR");
          if (category === "G") {
            const Data1 = await productCategory("GBG");
            const Data2 = await productCategory("GEG");
            categoryData = [...Data1, ...Data2];
          }
          setProducts(categoryData);
        } else if (category.charAt(0) === "D") {
          setDrop(false);
          setValue2(1);
          setProductTitle("DRUM");
          if (category === "D") {
            const Data1 = await productCategory("DAD");
            const Data2 = await productCategory("DED");
            categoryData = [...Data1, ...Data2];
          }
          setProducts(categoryData);
        } else if (category.charAt(0) === "K") {
          setDrop(false);
          setValue2(1);
          setProductTitle("KEYBOARD");
          if (category === "K") {
            const Data1 = await productCategory("KDP");
            const Data2 = await productCategory("KSY");
            const Data3 = await productCategory("KEK");
            categoryData = [...Data1, ...Data2, ...Data3];
          }
          setProducts(categoryData);
        } else if (category.charAt(0) === "M") {
          setDrop(false);
          setValue2(1);
          setProductTitle("Audio Equipment");
          if (category === "M") {
            const Data1 = await productCategory("MAMP");
            const Data2 = await productCategory("MFX");
            const Data3 = await productCategory("MMIC");
            categoryData = [...Data1, ...Data2, ...Data3];
          }
          setProducts(categoryData);
        } else if (category.charAt(0) === "A") {
          setDrop(false);
          setValue2(1);
          setProductTitle("ACCESSORIES");
          if (category === "A") {
            const Data1 = await productCategory("AGA");
            const Data2 = await productCategory("GDA");
            const Data3 = await productCategory("AMA");
            categoryData = [...Data1, ...Data2, ...Data3];
          }
          setProducts(categoryData);
        } else if (category.charAt(0) === "Q") {
          setDrop(false);
          setProductTitle("초보ZONE");
          const data = await allProducts();
          if (category.length === 2) {
            const filtered = products.filter((item) => {
              const secondChar = item.prdCategory.charAt(0);
              const isRental = item.prdRental === true;

              if (selectedCategory.charAt(1) === "G") {
                return isRental && secondChar === "G";
              } else if (selectedCategory.charAt(1) === "K") {
                return isRental && secondChar === "K";
              }
            });

            setProducts(filtered);
          } else {
            const start = data.filter((item) => item.prdRental === true);
            if (start.length > 0) {
              setProducts(start);
            } else {
            }
          }
        } else if (category === "S") {
          setDrop(false);
          setProductTitle("SHOP ALL");
          const data = await allProducts();
          setProducts(data);
        }
      }
    };

    fetchProducts();
  }, [category]);

  const handleSortChange = (sortType) => {
    let sortedData = [...products];

    if (sortType === "popular") {
      sortedData = sortedData.sort((a, b) => b.prdStock - a.prdStock); // 인기순
    } else if (sortType === "discount") {
      sortedData = sortedData.sort((a, b) => b.prdDiscount - a.prdDiscount); // 할인율
    } else if (sortType === "lowPrice") {
      sortedData = sortedData.sort((a, b) => a.prdPrice - b.prdPrice); // 낮은가격
    } else if (sortType === "highPrice") {
      sortedData = sortedData.sort((a, b) => b.prdPrice - a.prdPrice); // 높은 가격
    }
    setSelectedSort(sortType);
    setProducts(sortedData);
  };

  const [selectedCategory, setSelectedCategory] = useState("");

  const handleCategory = (selectedCategory) => {
    if (selectedCategory === category) {
      if (category.charAt(0) === "G") {
        setValue2(1);
        navigate("/not_band/instrument-list?category=G");
        setSelectedCategory("");
      } else if (category.charAt(0) === "D") {
        setValue2(1);
        navigate("/not_band/instrument-list?category=D");
        setSelectedCategory("");
      } else if (category.charAt(0) === "K") {
        setValue2(1);
        navigate("/not_band/instrument-list?category=K");
        setSelectedCategory("");
      } else if (category.charAt(0) === "M") {
        setValue2(1);
        navigate("/not_band/instrument-list?category=M");
        setSelectedCategory("");
      } else if (category.charAt(0) === "A") {
        setValue2(1);
        navigate("/not_band/instrument-list?category=A");
        setSelectedCategory("");
      } else if (category.charAt(0) === "S") {
        navigate("/not_band/instrument-list?category=S");
        setSelectedCategory("");
      }
    } else {
      navigate(`/not_band/instrument-list?category=${selectedCategory}`);
      setSelectedCategory(selectedCategory);
    }
  };

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

  const toggleDrop = () => {
    setDrop((prev) => !prev); //상태 반전
  };

  const total = Math.ceil(products.length / 16);

  return (
    <section className="shop">
      <div className="shop_title">
        <div className="shop_title_group">
          {productTitle == "초보ZONE" ? (
            <img src="/images/instrument/start_box.png" alt="" />
          ) : (
            <img src="/images/instrument/shop_box.png" alt="" />
          )}
          <h1>{productTitle}</h1>
        </div>
        <div className="Smenu2">
          <div className="Smenu">
            <Link
              to="/not_band/instrument-list?category=S"
              className={`menu ${category === "S" ? "active" : ""}`}
            >
              <p>전체</p>
            </Link>
            <Link
              to="/not_band/instrument-list?category=G"
              className={`menu ${category.charAt(0) === "G" ? "active" : ""}`}
            >
              <p>기타</p>
            </Link>
            <Link
              to="/not_band/instrument-list?category=D"
              className={`menu ${category.charAt(0) === "D" ? "active" : ""}`}
            >
              <p>드럼</p>
            </Link>
            <Link
              to="/not_band/instrument-list?category=K"
              className={`menu ${category.charAt(0) === "K" ? "active" : ""}`}
            >
              <p>건반</p>
            </Link>
            <Link
              to="/not_band/instrument-list?category=M"
              className={`menu ${category.charAt(0) === "M" ? "active" : ""}`}
            >
              <p>음향장비</p>
            </Link>
            <Link
              to="/not_band/instrument-list?category=A"
              className={`menu ${category.charAt(0) === "A" ? "active" : ""}`}
            >
              <p>액세서리</p>
            </Link>
            <Link
              to="/not_band/instrument-list?category=Q"
              className={`menu ${category.charAt(0) === "Q" ? "active" : ""}`}
            >
              <p>초보ZONE</p>
            </Link>
          </div>
        </div>
      </div>
      <FilterGroup
        category={category}
        handleCategory={handleCategory}
        ProductMenu={ProductMenu}
      />
      <div className="grid_btn">
        <div>
          <p>상품 정렬</p>
          <button onClick={toggleDrop}>
            <img src="/images/main/best_plus.png" alt="" />
          </button>
        </div>
        <div
          className={`drop_grid ${isDrop ? "active" : ""}`}
          style={{ zIndex: isDrop ? 999 : "auto" }}
        >
          <p onClick={() => handleSortChange("popular")}
            style={{ color: selectedSort === "popular" ? "#0A0A0A" : "#8A8A8A" }}>인기순</p>
          <p onClick={() => handleSortChange("discount")}
            style={{ color: selectedSort === "discount" ? "#0A0A0A" : "#8A8A8A" }}>할인율순</p>
          <p onClick={() => handleSortChange("lowPrice")}
            style={{ color: selectedSort === "lowPrice" ? "#0A0A0A" : "#8A8A8A" }}>낮은 가격순</p>
          <p onClick={() => handleSortChange("highPrice")}
            style={{ color: selectedSort === "highPrice" ? "#0A0A0A" : "#8A8A8A" }}>높은 가격순</p>
        </div>
      </div>

      <ProductList products={products} value2={value2} starter={starter} setCartCount={setCartCount}/>
      <div className="page_change">
          <Paging
            page={page}
            value2={value2}
            setValue2={setValue2}
            totalPage={totalPage}
          />
      </div>
    </section>
  );
}
