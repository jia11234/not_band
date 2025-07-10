import React from "react";
import "../../css/main/index.css";
import "../../css/rental/rental.css";

export default function Resell() {
  const resell_post = [
    {
      name: "[렌탈] 고퍼우드 일렉기타 S-classic",
      price: 18000,
      image: "/images/rental/rental1.png",
    },
    {
      name: "[렌탈] 깁슨 CS-356 피거드 탑 일렉기타-Faded Cherry",
      price: 17000,
      image: "/images/rental/rental2.png",
    },
    {
      name: "[렌탈] 잭슨 5현 스펙트라 베이스 기타",
      price: 15000,
      image: "/images/rental/rental3.png",
    },
    {
      name: "[렌탈] 헥스 기타 B100M S/PBL 베이스 기타",
      price: 25000,
      image: "/images/rental/rental4.png",
    },
    {
      name: "[렌탈] 코르그 KORG 뮤직 워크 스테이션",
      price: 16000,
      image: "/images/rental/rental5.png",
    },
    {
      name: "[렌탈] 카시오 CT-X5000 전자피아노",
      price: 13000,
      image: "/images/rental/rental6.png",
    },
    {
      name: "[렌탈] RODE 로데 NT2000 콘텐서 마이크",
      price: 14000,
      image: "/images/rental/rental7.png",
    },
    {
      name: "[렌탈] 이어폰 포켓 미니 베이스 기타 앰프프",
      price: 15000,
      image: "/images/rental/rental8.png",
    },
  ];

  return (
    <div className="resell_gruop">
      <div className="resell_top">
        <h1 color>RENTAL</h1>
      </div>
      <hr />
      <div className="resell_smenu">
        <b style={{ color: "#0A0A0A" }}>전체</b>
        <span>&#8226;</span>
        <p>일렉</p>
        <span>&#8226;</span>
        <p>베이스</p>
        <span>&#8226;</span>
        <p>건반</p>
        <span>&#8226;</span>
        <p style={{ paddingLeft: "30px" }}>음향장비</p>
      </div>
      <hr />
      <div className="prdSht">
        <div>
          <p>상품정렬</p>{" "}
          <button>
            <img src="/images/main/best_plus.png" alt="" />
          </button>
        </div>
      </div>
      <div className="prd_group">
        {resell_post.map((re_num, resell) => (
          <div className="prd_post" key={resell}>
            <img src={re_num.image} alt={resell.name} />
            <div className="prd_name">{re_num.name}</div>
            <div className="prd_price">
              <p>일 {re_num.price.toLocaleString()}원</p>
            </div>
          </div>
        ))}
      </div>
      <div className="resell_bottom">
        <button>
          <img src="/images/instrument/left.png" alt="왼쪽 버튼" />
        </button>{" "}
        <p style={{ color: "#0A0A0A" }}>1</p> <p>2</p> <p>3</p>{" "}
        <button>
          <img src="/images/instrument/right.png" alt="오른쪽 버튼" />
        </button>
      </div>
    </div>
  );
}
