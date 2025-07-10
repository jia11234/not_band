import React from "react";
import "../../css/order/orderStep.css";

export default function OrderStep(props) {
  //주문 상태 01 장바구니 = 02 주문하기 03 주문완료
  const { orderStep } = props;
  return (
    <div className="step_title">
      {orderStep == 1 && (
        <>
          <p>장바구니</p>
          <div className="order_step">
            <span style={{ color: "#0A0A0A" }}>01 장바구니</span>
            <span>&#9475;</span> 02 주문하기 <span>&#9475;</span> 03 주문완료
          </div>
        </>
      )}
      {orderStep == 2 && (
        <>
          <p>주문하기</p>
          <div className="order_step">
            01 장바구니<span>&#9475;</span>{" "}
            <span style={{ color: "#0A0A0A" }}>02 주문하기</span>{" "}
            <span>&#9475;</span> 03 주문완료
          </div>
        </>
      )}
      {orderStep == 3 && (
        <>
          <p>주문완료</p>
          <div className="order_step">
            <span>01 장바구니</span>
            <span>&#9475;</span> 02 주문하기 <span>&#9475;</span>{" "}
            <span style={{ color: "#0A0A0A" }}>03 주문완료</span>
          </div>
        </>
      )}
    </div>
  );
}
