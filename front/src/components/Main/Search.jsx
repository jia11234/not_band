import { useState, useEffect } from "react";
import { search } from "../../apis";
import "../../css/main/index.css";
import "../../css/search/search.css";
import SearchList from "./SearchList";
import Paging from "../Mypage/Paging";

export default function Search() {
  const [keyword, setKeyword] = useState("");
  const [value2, setValue2] = useState(1);
  const [searchedKeyword, setSearchedKeyword] = useState("");
  const [products, setProducts] = useState([]);
  const [searched, setSearched] = useState(false); // 검색 실행 여부

  const handleSearch = async () => {
    if (!keyword.trim()) return;
    setSearched(false);
    try {
      const result = await search(keyword);
      setProducts(result);
      setSearchedKeyword(keyword); // 검색 당시 키워드 저장
      setSearched(true);
    } catch (error) {
      console.error("검색 중 오류:", error);
    }
  };

  const page = 5;
  const start = (value2 - 1) * page;
  const end = start + page;
  const totalPage = products.length;

  const pagedItems = products
    .sort((a, b) => new Date(b.revAdd) - new Date(a.revAdd))
    .slice(start, end);

  return (
    <div className="search_all_group">
      <div className="resell_gruop">
        <div className="shop_title">
          <div className="shop_title_group">
            <img src="/images/instrument/search.png" alt="" />
            <h1>
              {searched ? `"${searchedKeyword}" 검색 결과입니다.` : "검색"}
            </h1>
          </div>
          <div className="search_group">
            <input
              type="text"
              className="search_input"
              placeholder="검색어를 입력해주세요"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch(); // 엔터키 눌렀을 때 검색 실행
                }
              }}
            />
            <button
              className="search_button"
              onClick={handleSearch}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            >
              <img
                src="/images/header/search_white.png"
                alt="search icon"
                className="search_icon"
              />
            </button>
          </div>
        </div>
      </div>
      <SearchList products={products} />
    </div>
  );
}
