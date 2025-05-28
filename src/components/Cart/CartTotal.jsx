import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import React from "react";

export default function CartTotal({
  cartItems,
  products,
  selectedTotalPrice,
  memId,
  reload,
}) {
  const [cartNumber, setCartNumber] = useState(0);
  const [deliveryPrice, setDeliveryPrice] = useState(0);
  const [cartSelected, setCartSelected] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    const cartTotalPrice = {};
    setCartSelected(
      cartItems.filter((item) => item.cartChecked === true).length,
    );
    const calculateDeliveryPrice = () => {
      if (selectedTotalPrice <= 50000 && cartSelected >= 1) {
        return 3000;
      } else {
        return 0;
      }
    };
    setDeliveryPrice(calculateDeliveryPrice()); //배송비
  }, [selectedTotalPrice, reload]);

  const handleOrderClick = (memId) => {
    navigate("/not_band/order", {
      state: {
        memId,
      },
    });
  };

  return (
    <div className="cart_total_price">
      <p>장바구니 결제 예상 금액</p>
      <div className="cart_total_title_line"></div>
      <div className="cart_total_list_group">
        <p className="cart_total_p">상품 수</p>
        <p className="cart_total_p2">{cartSelected}개</p>
      </div>
      <div className="cart_total_list_group">
        <p className="cart_total_p">배송비</p>
        <p className="cart_total_p2">{deliveryPrice.toLocaleString()}원 </p>
      </div>
      <div className="cart_total_list_group">
        <p className="cart_total_p">상품 금액</p>
        <p className="cart_total_p2">{selectedTotalPrice.toLocaleString()}원</p>
      </div>
      <div className="cart_total_title_line2"></div>
      <div className="cart_total_group">
        <p className="cart_total_group_p">최종 결제 금액</p>
        <p className="cart_total_group_p2">
          {(selectedTotalPrice + deliveryPrice).toLocaleString()}원
        </p>
      </div>
      <button
        className="cart_buy_purchase"
        onClick={() => handleOrderClick(memId)}
      >
        선택한 상품 구매하기
      </button>
    </div>
  );
}
