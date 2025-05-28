import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import AdminDashChat from "./AdminDashChat";
import {
  allResells,
  getLogin,
  getReviewAll,
  getUserAll,
  getOrderAll,
  getInquiry,
  allProducts,
} from "../../apis";

import "../../css/admin/adminDashboard.css";
import "../../css/main/index.css";

import moment from "moment";
import "moment/locale/ko";

export default function AdminDashboard() {
  // 리뷰관리
  const [review, setReview] = useState([]);
  const [login, setLogin] = useState();
  const [user, setUser] = useState([]);
  const [order, setOrder] = useState([]);
  const [order2, setOrder2] = useState([]);
  const [resell, setResell] = useState();
  const [chatRoom, setChatRoom] = useState();
  const [product2, setProduct2] = useState([]);
  const [top3Products, setTop3Products] = useState([]);

  useEffect(() => {
    fetchReview();
    fetchLogin();
    fetchProducts();
    fetchUser();
    fetchResell();
    fetchChatRoom("admin");
  }, []);

  const fetchProducts = async () => {
    const data = await allProducts();
    setProduct2(data);
    fetchOrder(data);
  };

  const fetchChatRoom = async () => {
    const data = await getInquiry();

    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    let totalUnreadCount = 0;

    data.forEach((chat) => {
      const chatDate = new Date(chat.chatAdd);

      chat.messages.forEach((message) => {
        if (message.senderId !== "admin" && !message.mesRead) {
          totalUnreadCount += chat.unreadCount;
        }
      });
    });

    setChatRoom(totalUnreadCount);
  };

  const fetchLogin = async () => {
    const data = await getLogin();

    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const todayLogins = data.filter((login) => {
      const loginDate = new Date(login.loginTime);
      return loginDate >= startOfDay && loginDate <= endOfDay;
    });

    setLogin(todayLogins.length);
  };

  const fetchReview = async () => {
    const data = await getReviewAll();
    setReview(data);
  };

  const fetchUser = async () => {
    const data = await getUserAll();

    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const todayUsers = data.filter((user) => {
      const memAddDate = new Date(user.memAdd);
      return memAddDate >= startOfDay && memAddDate <= endOfDay;
    });

    const todayUserCount = todayUsers.length;

    setUser(todayUserCount);
  };

  const fetchOrder = async (data2) => {
    const data = await getOrderAll(); // 모든 주문 데이터를 가져옴
    setOrder(data);
    const product = data2;

    // 오늘 날짜의 시작과 끝 시간 설정
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // 오늘 주문 데이터를 필터링
    const todayUsers = data.filter((order) => {
      const memAddDate = new Date(order.ordDate);
      return memAddDate >= startOfDay && memAddDate <= endOfDay;
    });

    const todayUserCount = todayUsers.length;
    setOrder2(todayUserCount); // 오늘 주문한 사용자 수 상태 업데이트

    // prdNo 기반으로 상품 정보를 빠르게 찾기 위해 Map 생성
    const productMap = {};
    product.forEach((p) => {
      productMap[p.prdNo] = {
        prdName: p.prdName,
        prdPrice: p.prdPrice,
      };
    });

    // 상품별 총 판매 금액 계산
    const productSales = {};

    data.forEach((order) => {
      order.products.forEach((p) => {
        const { prdNo, ordQty } = p;
        const productInfo = productMap[prdNo];
        if (!productInfo) return; // 매칭 실패 시 건너뜀

        const { prdName, prdPrice } = productInfo;
        const totalPrice = prdPrice * ordQty;

        if (productSales[prdNo]) {
          productSales[prdNo].totalAmount += totalPrice;
        } else {
          productSales[prdNo] = {
            prdName,
            prdPrice,
            totalAmount: totalPrice,
          };
        }
      });
    });

    // 판매 총액 기준 Top 3 추출 + 수량 계산
    const top3Products = Object.values(productSales)
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, 3)
      .map((p) => ({
        ...p,
        totalCount: Math.round(p.totalAmount / p.prdPrice), // 수량 계산
      }));

    setTop3Products(top3Products);
  };

  const fetchResell = async () => {
    const data = await allResells();

    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const todayUsers = data.filter((resell) => {
      const memAddDate = new Date(resell.resTime);
      return memAddDate >= startOfDay && memAddDate <= endOfDay;
    });

    const todayUserCount = todayUsers.length;
    setResell(todayUserCount);
  };

  // 그래프
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: "#FCFEFD", padding: "8px" }}>
          <p>{payload[0].payload.date}</p>
          <p>{payload[0].value.toLocaleString()}원</p>
        </div>
      );
    }
    return null;
  };

  const [viewType, setViewType] = useState("day");
  const [chartData, setChartData] = useState([]);
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

  useEffect(() => {
    const generateChartData = () => {
      if (!Array.isArray(order)) return;

      const grouped = {};


      order.forEach((o) => {
        let date;
        if (viewType === "week") {
          date = moment(o.ordDate).startOf("week").format("YYYY-MM-DD"); // 주 단위 그룹핑
        } else if (viewType === "month") {
          date = moment(o.ordDate).format("YYYY-MM"); // 월 단위 그룹핑
        } else {
          date = moment(o.ordDate).format("YYYY-MM-DD"); // 일 단위 그룹핑
        }

        if (!grouped[date]) {
          grouped[date] = 0;
        }
        grouped[date] += o.ordTotal || 0;
      });


      const labels = [];
      const result = [];

      if (viewType === "day") {
        for (let i = 6; i >= 0; i--) {
          const d = moment().subtract(i, "days").format("YYYY-MM-DD");
          const label =
            moment(d).format("M.D") + `(${weekdays[moment(d).day()]})`;
          labels.push(label);
          result.push({ date: label, count: grouped[d] || 0 });
        }
      } else if (viewType === "week") {
        for (let i = 6; i >= 0; i--) {
          const d = moment()
            .subtract(i, "weeks")
            .startOf("week")
            .format("YYYY-MM-DD");
          const label = `Week ${moment(d).week()}`;
          labels.push(label);
          result.push({ date: label, count: grouped[d] || 0 });
        }
      } else if (viewType === "month") {
        for (let i = 5; i >= 0; i--) {
          const d = moment().subtract(i, "months").format("YYYY-MM");
          const label = moment(d).format("YYYY.MM");
          labels.push(label);
          result.push({ date: label, count: grouped[d] || 0 });
        }
      }

      setChartData(result);
    };
    generateChartData();
  }, [viewType, order]);

  let yAxisDomain = [0, 500]; // 단위: 만원
  let yAxisTicks = [0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500];
  let unitPerCount = 10000; // 단위: 만원

  if (viewType === "week") {
    yAxisDomain = [100, 2000];
    yAxisTicks = [100, 400, 700, 1000, 1300, 1600, 1900];
    unitPerCount = 10000;
  } else if (viewType === "month") {
    yAxisDomain = [300, 5000];
    yAxisTicks = [500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000];
    unitPerCount = 10000;
  }

  // 대시보드 방문자수, 신규 가입자 수
  const summary = {
    visitors: 1040,
    newUsers: 16,
    sales: 356,
    resell: 180,
    inquiries: 994,
  };

  // 인기상품
  const bestProducts = [
    { name: "삼익 디지털피아노 First-1", count: 102, price: 7500000 },
    { name: "야마하 키보드 PSR-F52", count: 89, price: 520000 },
    { name: "커즈와일 전자피아노 M110", count: 64, price: 1200000 },
  ];

  // 문의 톡
  const [room, setRoomCount] = useState(0);

  // 중고 거래 톡
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await allResells();
      setProducts(data);
    };
    fetchProducts();
  }, []);

  return (
    <>
      <h1>대시보드</h1>
      <div className="dashboard_summary">
        <div className="da_summary_div">
          <p>{login}</p>
          <p>오늘 방문자 수</p>
        </div>
        <div className="da_summary_div">
          <p>{user}</p>
          <p>오늘 신규 가입자 수</p>
        </div>
        <div className="da_summary_div">
          <p>{order2}</p>
          <p>오늘 판매 수</p>
        </div>
        <div className="da_summary_div">
          <p>{resell}</p>
          <p>오늘 등록된 중고 상품 수</p>
        </div>
        <div className="da_summary_div">
          <p>{chatRoom}</p>
          <p>미답변 문의 수</p>
        </div>
      </div>

      <div>
        <div className="da_sales">
          <div className="da_div_title">
            <p>매출 현황</p>
            <div className="da_div_date_group">
              {["day", "week", "month"].map((type) => (
                <div
                  key={type}
                  className="da_div_date"
                  style={{
                    backgroundColor: viewType === type ? "#FF4A01" : "#FCFEFD",
                    color: viewType === type ? "#FCFEFD" : "black",
                    border: viewType === type ? "none" : "1px solid #8a8a8a",
                  }}
                  onClick={() => setViewType(type)}
                >
                  {type === "day" ? "일" : type === "week" ? "주" : "월"}
                </div>
              ))}
            </div>
          </div>

          <ResponsiveContainer
            width="98%"
            height={350}
            style={{ marginTop: "25px" }}
          >
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid stroke="#8A8A8A" />
              <XAxis dataKey="date" />
              <YAxis
                yAxisId="left"
                orientation="right"
                domain={yAxisDomain.map((val) => val * unitPerCount)}
                ticks={yAxisTicks.map((val) => val * unitPerCount)}
                tickFormatter={(value) =>
                  `${(value / 10000).toLocaleString()}만원`
                }
                tick={{ textAnchor: 'end', dx: 65  }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar yAxisId="left" dataKey="count" fill="#6495ED" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="da_best">
          <div className="da_div_title">
            <p>인기 상품 TOP3</p>
            <p>누적 판매량 기준</p>
          </div>
          {top3Products.map((item, index) => (
            <div className="da_best_prd" key={index}>
              <h4>{index + 1}.</h4>
              <h4 style={{ width: "370px", wordWrap: "break-word" }}>
                {item.prdName}
              </h4>
              <div>
                <p>{item.totalCount}개</p>
                <p>{item.totalAmount.toLocaleString()}원</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="da_user_resell">
        <div className="da_div_title">
          <p>중고 거래 글</p>
          <div className="da_count_btn">{products.length}</div>
        </div>
        <div className="da_table_group">
          <div className="da_table_title_margin">
            <div className="da_table_title">
              <p>상품 사진</p>
              <p>제목</p>
              <p>가격</p>
              <p>등록일</p>
            </div>
          </div>
          <table>
            {products
              .sort((a, b) => new Date(b.resTime) - new Date(a.resTime)) // resTime을 기준으로 내림차순 정렬
              .slice(0, 4) // 상위 4개 항목만
              .map((product) => (
                <tr className="da_table_resell_tr" key={product.resId}>
                  <td>
                    {product.resImgUrl1 ? (
                      <img
                        src={`http://localhost:8080/api/v1/not_band${product.resImgUrl1}`}
                        alt={product.resPrd}
                        style={{ width: "80px", height: "80px" }}
                      />
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>
                    {product.resPrd.length > 23
                      ? product.resPrd.slice(0, 23) + "..."
                      : product.resPrd}
                  </td>
                  <td>{product.resPrice.toLocaleString("ko-KR")}원</td>
                  <td>
                    {product.resTime
                      ? product.resTime.slice(5, 10).replace("-", ".")
                      : "-"}
                  </td>
                </tr>
              ))}
          </table>
        </div>
      </div>

      <div className="da_oneonone_talk">
        <div className="da_Oneonone_talk"></div>
        <div className="da_div_title">
          <p>리뷰</p>
          <div className="da_count_btn">{review.length}</div>
        </div>
        <div className="da_review_title">
          <div className="da_review_title_text">
            <p>상품 사진</p>
            <p>내용</p>
            <p>작성자</p>
            <p>별점</p>
            <p>등록일</p>
          </div>
        </div>
        <table>
          {review.slice(0, 4).map((review, index) => (
            <tr key={index} className="da_review_text_table">
              <td>
                <img
                  src={`http://localhost:8080/api/v1/not_band/images/product/${review.prdNo}.png`}
                  alt={`${review.prdNo}`}
                  style={{ width: "80px", height: "80px", marginTop:"calc(19.75px)", marginBottom:"calc(19.75px)" }}
                />
              </td>
              <td>
                {review.revContent.length > 23
                  ? `${review.revContent.slice(0, 23)}...`
                  : review.revContent}
              </td>
              <td>{review.memId}</td>
              <td>
                <img src="/images/review/fullstars.png" alt="" />
                {review.revRating}
              </td>
              <td>{review.revAdd.slice(5, 10).replace("-", ".")}</td>
            </tr>
          ))}
        </table>
      </div>
    </>
  );
}
