import { useRef, useState, useEffect } from "react";
import { getOrderRequest } from "../../apis";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import OrderStep from "./OrderStep";
import "../../css/order/orderCompleted.css";

export default function OrderCompleted() {
  const [searchParams] = useSearchParams();
  const [orderStep, setOrderStep] = useState(3);
  const [order, setOrder] = useState([]);
  const [error, setError] = useState(null);
  const location = useLocation();
  const { memId: stateMemId, ordNo: stateOrdNo } = location.state || {};
  const memId = stateMemId || searchParams.get("memId");
  const ordNo = stateOrdNo || searchParams.get("ordNo");

  useEffect(() => {
    if (memId) {
      fetchOrder(memId);
    }
  }, [memId]);

  //주문 조회
  const fetchOrder = async (memId) => {
    try {
      const data = await getOrderRequest(memId);

      const matchedOrder = data.find(
        (order) => String(order.ordNo) === String(ordNo),
      );
      //주문 번호로 주문 조회

      if (matchedOrder) {
        setOrder(matchedOrder);
      } else {
        console.warn("주문 못 찾음");
        setError("주문 정보를 찾을 수 없습니다.");
      }
    } catch (err) {
      console.error("에러:", err.message);
      setError(err.message);
    }
  };

  return (
    <div className="order_completed_group">
      <OrderStep orderStep={orderStep} />
      <div className="order_completed">
        <div className="order_title">배송지</div>
        <div className="order_completed_information">
          <p>{order.ordName}</p>
          <p>
            {order.ordPhone
              ? `${order.ordPhone.slice(0, 3)}-${order.ordPhone.slice(3, 7)}-${order.ordPhone.slice(7, 11)}`
              : ""}
          </p>
          <p>
            {order.ordAddress} {order.ordDetailAddress} ({order.ordZipcode})
          </p>
        </div>
        <div className="order_title">결제 금액</div>
        <div className="order_price_group">
          <div>
            <div className="order_price">
              <p>상품 금액</p>
              <p>{Number(order.ordTotal).toLocaleString()}원</p>
            </div>
            <div className="order_price">
              <p>배송비</p>
              <p>{Number(order.ordDelivery).toLocaleString()}원</p>
            </div>
            <div className="order_price">
              <p>사용 포인트</p>
              <p>{Number(order.ordPoint).toLocaleString()}P</p>
            </div>
            <div className="order_price">
              <p>포인트 적립 2%</p>
              <p>{(Number(order.ordTotal) * 0.02).toLocaleString()}P</p>
            </div>
            <div className="order_price_total">
              <p>총 결제 금액</p>
              <p>
                {(
                  Number(order.ordTotal) + Number(order.ordDelivery)
                ).toLocaleString()}
                원
              </p>
            </div>
          </div>
          <Link to="/not_band">
            <button className="btnRed">홈으로 가기</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
