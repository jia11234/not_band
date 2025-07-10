import React, { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { getOrderRequest, getReview } from "../../apis";
import Paging from "./Paging";

export default function MypageOrder({ memId, products }) {
  const [products2, setProducts2] = useState({});
  const [value2, setValue2] = useState(1);
  const [totalOrder, setTotalOrder] = useState(0);
  const [groupedItems, setGroupedItems] = useState({});
  const [reviews, setReviews] = useState([]);
  const [orderStatus, setOrderStatus] = useState({
    received: 0,
    paid: 1,
    delivery: 0,
    delivered: 9,
  });
  useEffect(() => {
    if (memId) {
      fetchOrder(memId);
      fetchReview(memId);
    }
    setTotalOrder(Object.keys(groupedItems).length);
  }, [memId]);

  const fetchOrder = async (memId) => {
    const data = await getOrderRequest(memId);
    const product2 = data.map((order) => order.products).flat();
    setProducts2(product2);
    const groupedData = groupOrdersByDate(data);
    setGroupedItems(groupedData);
  };

  const groupOrdersByDate = (orders) => {
    return orders.reduce((acc, order) => {
      const orderDate = new Date(order.ordDate).toISOString().slice(0, 10);

      if (!acc[orderDate]) {
        acc[orderDate] = [];
      }

      acc[orderDate].push(order);

      return acc;
    }, {});
  };

  const fetchReview = async (memId) => {
    try {
      const data = await getReview(memId); // 수정된 API 호출
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

  //페이징 변수
  const page = 5;
  const start = (value2 - 1) * page;
  const end = start + page;
  const totalPage = Object.entries(groupedItems).length;

  const pagedItems = Object.entries(groupedItems)
    .sort((a, b) => new Date(b[0]) - new Date(a[0]))
    .slice(start, end);
  const totalItemsCount = Object.entries(groupedItems).reduce(
    (total, [date, items]) => {
      return total + items.length;
    },
    0,
  );

  return (
    <>
      <div className="mp_R_ord_delivery">
        <div className="mp_R_s_title">
          <h3>주문배송 현황</h3>
          <p>최근 3개월</p>
        </div>
        <div className="mp_R_order_sta_bg">
          <div className="mp_R_order_status">
            <div
              className="order_status_content"
              style={{ color: orderStatus.received > 0 ? "#0A0A0A" : "#8A8A8A" }}
            >
              <h3>{orderStatus.received}</h3>
              <p>주문접수</p>
            </div>
            <img
              src="/images/mypage/chevron-right.png"
              className="chevron_btn"
              alt=""
            />
            <div
              className="order_status_content"
              style={{ color: orderStatus.paid > 0 ? "#8A8A8A" : "#8A8A8A" }}
            >
              <h3>0</h3>
              <p>결제완료</p>
            </div>
            <img
              src="/images/mypage/chevron-right.png"
              className="chevron_btn"
              alt=""
            />
            <div
              className="order_status_content"
              style={{ color: orderStatus.delivery > 0 ? "#0A0A0A" : "#8A8A8A" }}
            >
              <h3>{orderStatus.delivery}</h3>
              <p>배송중</p>
            </div>
            <img
              src="/images/mypage/chevron-right.png"
              className="chevron_btn"
              alt=""
            />
            <div
              className="order_status_content"
              style={{ color: orderStatus.delivered > 0 ? "#0A0A0A" : "#8A8A8A" }}
            >
              <h3>{totalItemsCount}</h3>
              <p>배송완료</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mp_R_ord-list">
        <div className="mp_R_s_title">
          <h3>최근 주문 내역</h3>
          <select className="reviewcon_select">
            <option value="3개월">3개월</option>
            <option value="6개월">6개월</option>
            <option value="1년">1년</option>
            <option value="2년">2년</option>
            <option value="3년">3년</option>
          </select>
        </div>
        {pagedItems.map(([date, items], groupIndex) => {
          return (
            <div className="mp_ord_list_group" key={groupIndex}>
              {items.map((item, index) => (
                <table
                  key={index}
                  style={{
                    borderBottom:
                      index === items.length - 1 ? "1px solid #8A8A8A" : "none",
                  }}
                >
                  <tr style={{ display: index === 0 ? "table-row" : "none" }}>
                    <td colSpan={2}>
                      주문&nbsp;&#9474;&nbsp;
                      {new Date(item.ordDate)
                        .toISOString()
                        .slice(0, 10)
                        .replace(/-/g, ".")}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2}>
                      <div>
                        <p>배송 완료</p>
                        <p>{`${new Date(new Date(item.ordDate).setDate(new Date(item.ordDate).getDate() + 1)).getMonth() + 1}월 
                            ${new Date(new Date(item.ordDate).setDate(new Date(item.ordDate).getDate() + 1)).getDate()}일`}</p>
                      </div>
                    </td>
                  </tr>
                  {item.products.map((product, productIndex) => {
                    const productName =
                      products.find((p) => p.prdNo === product.prdNo)
                        ?.prdName || "알 수 없는 상품"; // 상품명 찾기
                    const productPrice =
                      products.find((p) => p.prdNo === product.prdNo)
                        ?.prdPrice || "알 수 없는 상품";
                    const productDiscount =
                      products.find((p) => p.prdNo === product.prdNo)
                        ?.prdDiscount || "알 수 없는 상품";
                    const review =
                      reviews.find((p) => p.prdNo === product.prdNo)?.prdNo ||
                      "알 수 없는 상품";
                    const review2 = reviews
                      .filter((p) => p.prdNo === product.prdNo)
                      .map((p) => p.ordNo);
                    return (
                      <>
                      <tr
                        className={`order_list_tr ${index === items.length - 1 ? "last-item" : ""}`}
                        key={productIndex}
                      >
                        <td className="mp_ord_list_product">
                          {product.parentPrdNo && (
                            <p className="mp_ord_add">추가상품</p>
                          )}
                          <div className="mp_ord_list_product_group">
                          <img src={`http://localhost:8080/api/v1/not_band/images/product/${product.prdNo}.png`} />
                            <div>
                              <p
                                style={{
                                  marginBottom: product.colorOpt
                                    ? "2px"
                                    : "16px",
                                }}
                              >
                                {productName} | {product.ordQty}개
                              </p>
                              {product.colorOpt && (
                                <p className="order_color_option">
                                  옵션: {product.colorOpt}
                                </p>
                              )}
                              <div>
                                {productDiscount > 0 && (
                                  <p className="mp_ord_discount">
                                    {Math.round(
                                      productPrice /
                                        (1 - productDiscount / 100),
                                    ).toLocaleString()}{" "}
                                    원
                                  </p>
                                )}
                                <p>{productPrice.toLocaleString()} 원</p>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="mp_ord_list_review_group">
                          <Link
                            to="/not_band/review-registration"
                            state={{
                              ordNo: item.ordNo,
                              product: product,
                            }}
                          >
                            {review === product.prdNo &&
                            review2.includes(item.ordNo) ? (
                              <div className="mp_ord_list_review2"></div>
                            ) : (
                              <div className="mp_ord_list_review">
                                리뷰 작성하기
                              </div>
                            )}
                          </Link>
                        </td>
                      </tr>
                       <tr className="mp_ord_list_review_group2">
                          <Link
                            to="/not_band/review-registration"
                            state={{
                              ordNo: item.ordNo,
                              product: product,
                            }}
                          >
                            {review === product.prdNo &&
                            review2.includes(item.ordNo) ? (
                              <div className="mp_ord_list_review2"></div>
                            ) : (
                              <div className="mp_ord_list_review">
                                리뷰 작성하기
                              </div>
                            )}
                          </Link>
                        </tr>
                        </>
                    );
                  })}
                </table>
              ))}
            </div>
          );
        })}
        {pagedItems.length === 0 && (
          <div className="mp_ord_list_group2">
            <p className="ord_list_none">주문하신 상품이 없습니다.</p>
          </div>
        )}
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
